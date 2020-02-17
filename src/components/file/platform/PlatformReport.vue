<template>
  <div>
    <div>
      <el-button size="mini" type="primary" @click="addPlatformReport">新增</el-button>
      <el-button size="mini" type="danger" @click="delAllPlatformReport">批量删除</el-button>
    </div>
    <div>
      <el-row>
        <el-form ref="file" :model="searchData" label-width="80px">
          <el-col :span="5">
            <el-form-item label="平台" prop="platformid">
              <el-select clearable size="mini" v-model="searchData.platformid" placeholder="关联报表">
                <el-option
                  size="mini"
                  v-for="item in platformList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <!-- <el-form-item label="填报状态" prop="number">
              <el-input size="mini" v-model="searchData.number" placeholder="位置"></el-input>
            </el-form-item>-->
          </el-col>
          <el-col :span="5" style="margin-top:7px;margin-left:50px">
            <el-button size="mini" type="primary" @click="searchReport">查询</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div>
      <general-table
        :body="$store.state.platformreport.tableData"
        :showPagination="true"
        :total="$store.state.book.tableData.total"
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
            <el-button type="text" icon="el-icon-edit" size="small" @click="editReport(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-popconfirm
              confirmButtonText="好的"
              @onConfirm="deleteReport(scope.row)"
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
import request from "@/api/file/platform_report";
import dictonary from "@/mixins/dictonary";
export default {
  mixins: [dictonary],
  data() {
    return {
      idBatch: "",
      searchData: {
        platformid: ""
      }
    };
  },
  mounted() {
    this.selectPlatform(); //关联平台
    let page = 1;
    let pageSize = 10;
    this.$store.commit("book/BOOK_PAGE_SIZE", { page, pageSize });
    this.searchBook();
  },
  methods: {
    // 多选操作
    handleSelectionChange(val) {
      this.idBatch = val.map(item => {
        return item.id;
      });
    },
    // 批量删除
    delAllPlatformReport() {
        if (this.idBatch == "") {
        this.$message({
          type: "warning",
          message: "请选择删除的平台报表!"
        });
      } else {
        this.$confirm("此操作将永久删除该平台报表, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request
              .deleteAllReportAssociation({ idBatch: this.idBatch.join() })
              .then(res => {
                if (res.data === "deleteBatch!!") {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.$store.dispatch("platformreport/getPlatformReportData");
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
    // 搜索按钮
    searchReport() {
      if (this.searchData.platformid) {
        this.$store.dispatch(
          "platformreport/getPlatformReportData",
          this.searchData.platformid
        );
      } else {
        this.$store.dispatch("platformreport/getPlatformReportData");
      }
    },
    // 批量删除
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
                  this.searchBook();
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
    // 删除
    deleteReport(data) {
      this.$store.dispatch("platformreport/delData", data.id);
    },
    // 浏览内容
    skimContent(data) {
      this.$emit("skimContent", data);
    },
    // 查看分表
    viewTable(data) {
      this.$emit("viewSub", data);
    },
    // 分页
    paginationChange(page, pageSize) {
      this.$store.commit("book/BOOK_PAGE_SIZE", { page, pageSize });
      this.$store.dispatch("book/getbookData");
    },
    // 新增
    addPlatformReport() {
      this.$emit("add");
    },
    // 修改
    editReport(data) {
      this.$emit("edit");
      this.$store.commit("platformreport/getModifyPlatformReportData", data);
    },

    // 存档
    saveBook() {},
    // 查询
    searchBook() {
      this.$store.dispatch("platformreport/getPlatformReportData");
    }
  }
};
</script>

<style>
</style>