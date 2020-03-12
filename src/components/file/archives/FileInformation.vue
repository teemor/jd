<template>
  <div id="file">
    <div class="fl treebg" style="min-width:230px;width:10%;overflow:scroll">
      <el-tree
        @node-click="handleNodeClick"
        class="filter-tree"
        :data="fileData"
        default-expand-all
        :props="defaultProps"
        ref="tree2"
      ></el-tree>
    </div>
    <div class="fl" style="width:79%;margin:20px 15px">
      <el-row>
        <el-form ref="file" :model="searchData" label-width="80px">
          <el-col :span="4">
            <el-button size="mini" type="primary" @click="addFile">新增</el-button>
          </el-col>
          <el-col :span="4">
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
          <el-col :span="2" style="margin-top:7px;margin-left:50px">
            <el-button size="mini" type="primary" @click="addFile">查询</el-button>
          </el-col>
        </el-form>
      </el-row>

      <general-table
        :body="$store.state.file.tableData"
        :showPagination="true"
        :total="$store.state.file.tableData.total"
        @paginationChange="paginationChange"
        @scan="scan"
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
    <el-dialog :visible.sync="pdfbox">
      <file-pdf :url="url" />
    </el-dialog>
  </div>
</template>
<script>
import tree from "@/api/system/file";
export default {
  data() {
    return {
      pdfbox: false,
      url: "",
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
      this.$store.dispatch("file/selectArchives", { spid: data.id });
      this.$store.commit("file/spid", { spid: data.id });
    },
    // 档案级别树形
    selectAll() {
      tree.selectAll().then(res => {
        this.fileData = res.data.data;
      });
    },
    scan(url) {
      console.log("hehe");
      this.pdfbox = true;
      this.url = url;
      // this.$emit("scan",url)
    },
    // 添加文档
    addFile() {
      this.$store.commit("file/addState", { state: true });
      this.$emit("add");
    },
    // 分页
    paginationChange(page, pageSize) {
      this.$store.commit("file/FILE_PAGE_SIZE", { page, pageSize });
      console.log(this.$store.state);
      this.$store.dispatch("file/selectArchives", {
        spid: this.$store.state.file.spid
      });
    },
    // 修改
    editFile(data) {
      this.$emit("edit");
      this.$store.commit("file/addState", { state: false });
      this.$store.commit("file/updisabled", false);
      this.$store.commit("file/getModifyCodeData", data);
      this.$store.commit("file/getId", { id: data.id });
    },
    // 删除
    delFile(data) {
      this.$store.dispatch("file/delData", data.id);
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
#file .el-tree {
  background: #f4f4f5;
}
</style>