<template>
  <div id="file">
    <div class="fl treebg" style="width:200px;margin-right:20px">
      <el-tree
        @node-click="handleNodeClick"
        class="filter-tree"
        :data="fileData"
        default-expand-all
        :props="defaultProps"
        ref="tree2"
      ></el-tree>
    </div>
    <div class="fl">
      <el-row>
        <el-col style="margin:20px 15px">
          <el-button size="mini" type="primary" @click="addFile">新增</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form ref="file" :model="searchData" label-width="80px">
          <el-col :span="5">
            <el-form-item label="时间" prop="abbreviation">
              <el-input size="mini" v-model="searchData.abbreviation" placeholder="时间"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="排污号" prop="sewage">
              <el-input size="mini" v-model="searchData.sewage" placeholder="排污号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="设备号" prop="device">
              <el-input size="mini" v-model="searchData.device" placeholder="设备号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="编号" prop="number">
              <el-input size="mini" v-model="searchData.number" placeholder="编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="位置" prop="position">
              <el-input size="mini" v-model="searchData.position" placeholder="位置"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-top:7px;margin-left:50px">
            <el-button size="mini" type="primary" @click="addFile">查询</el-button>
          </el-col>
        </el-form>
      </el-row>

      <general-table
        :body="$store.state.file.tableData"
        :showPagination="true"
        :total="$store.state.file.tableData.total"
        @paginationChange="paginationChange"
      >
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editFile(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-button type="text" icon="el-icon-delete" size="small" @click="delFile(scope.row)">
              <template>删除</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
  </div>
</template>
<script>
import tree from "@/api/system/file";
export default {
  data() {
    return {
      searchData: {
        abbreviation: "",
        sewage: "",
        device: "",
        number: "",
        position: ""
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      fileData: []
    };
  },

  mounted() {
    this.selectAll();
  },
  methods: {
    handleNodeClick(data) {
      let page = 1;
      let pageSize = 10;
      this.$store.commit("file/FILE_PAGE_SIZE", { page, pageSize });
      this.$store.dispatch("file/getListData", { spid: data.id });
      this.$store.commit("file/setId", data.id);
    },
    // 档案级别树形
    selectAll() {
      tree.selectAll().then(res => {
        this.fileData = res.data.data;
      });
    },
    // 添加文档
    addFile() {
      this.$emit("add");
    },
    // 分页
    paginationChange(page, pageSize) {
      this.$store.commit("file/FILE_PAGE_SIZE", { page, pageSize });
      console.log(this.$store.state)
      this.$store.dispatch("file/getListData", { spid: this.$store.state.file.id });
    },
    // 修改
    editFile(data) {
      this.$emit("edit", data);
    },
    // 删除
    delFile(data) {
      this.$confirm("确定删除这条数据么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("file/delData", data.id);
      });
    }
  }
};
</script>

<style>
#file .treebg {
  width: 200px;
  border-right: 1px solid #e8e8e8;
  padding: 40px;
  height: 600px;
  background: #f4f4f5;
}
</style>