<template>
  <div>
    <div>
      <el-button size="mini" type="primary" @click="addBook">新增</el-button>
      <el-button size="mini" type="danger" @click="delBook">批量删除</el-button>
      <!-- <el-button size="mini" type="info" @click="cancel">取消</el-button> -->
    </div>
    <div>
      <el-row>
        <el-form ref="file" :model="searchData" label-width="80px">
          <el-col :span="5">
            <el-form-item label="科室" prop="abbreviation">
              <el-input size="mini" v-model="searchData.abbreviation" placeholder="科室"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="总表" prop="sewage">
              <el-input size="mini" v-model="searchData.sewage" placeholder="总表"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="分表" prop="device">
              <el-input size="mini" v-model="searchData.device" placeholder="分表"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-top:7px;margin-left:50px">
            <el-button size="mini" type="primary" @click="searchBook">查询</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div>
      <general-table
        :body="$store.state.subbook.tableData"
        :showPagination="true"
        :total="$store.state.subbook.tableData.total"
        @paginationChange="paginationChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="浏览" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-document"
              size="small"
              @click="skimContent(scope.row)"
            >
              <template>浏览</template>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editBook(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-popconfirm
              confirmButtonText="好的"
              @onConfirm="deleteBook(scope.row)"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              title="确定删除吗？"
            >
              <el-button type="text" icon="el-icon-delete" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </general-table>
    </div>
  </div>
</template>

<script>
import request from "@/api/file/ledger";

export default {
  data() {
    return {
      idBatch: "",
      searchData: {
        abbreviation: "",
        sewage: "",
        device: "",
        number: "",
        position: ""
      }
    };
  },
  mounted() {},
  methods: {
    // 多选操作
    handleSelectionChange(val) {
      this.idBatch = val.map(item => {
        return item.id;
      });
    },
    //批量删除
    delBook() {
      if (this.idBatch == "") {
        this.$message({
          type: "warning",
          message: "请选择删除的台账"
        });
      } else {
        this.$confirm("此操作将永久删除该台账, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request
              .deleteAllLedger({ idBatch: this.idBatch.join() })
              .then(res => {
                if (res.data === "deleteBatch!!") {
                  this.$commonUtils.setMessage("success", "删除成功");
                  this.$store.dispatch(
                    "subbook/getbookData",
                    this.$store.state.subbook.id.id
                  );
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    // 浏览内容
    skimContent(data) {
      this.$emit("skimContent", data);
    },
    paginationChange(page, pageSize) {
      this.$store.commit("subbook/FILE_PAGE_SIZE", { page, pageSize });
      this.$store.dispatch(
        "subbook/getbookData",
        this.$store.state.subbook.id.id
      );
    },
    // 新增
    addBook() {
      this.$emit("add");
    },
    // 修改
    editBook(data) {
      this.$store.commit("book/addState", { state: false });
      this.$emit("editSub", data);
    },
    // 删除
    deleteBook(data) {
      this.$store.dispatch("subbook/delData", data.id);
    },
    // 存档
    saveBook() {},
    // 查询
    searchBook() {}
  }
};
</script>

<style>
</style>