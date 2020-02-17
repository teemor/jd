<template>
  <div>
    <div>
      <el-button size="mini" type="primary" @click="addStatistical">新增</el-button>
      <el-button size="mini" type="danger" @click="delAllStatistical">批量删除</el-button>
    </div>
    <div>
      <general-table
        :body="$store.state.state.tableData"
        :showPagination="true"
        :total="$store.state.state.tableData.total"
        @paginationChange="paginationChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="选择" align="center">
          <template slot-scope="scope">
            <el-popconfirm
              confirmButtonText="好的"
              @onConfirm="stateChoose(scope.row)"
              cancelButtonText="不用了"
              iconColor="red"
              :title="scope.row['state']=== '未选'?'确定选择吗':'取消选择吗'"
            >
              <el-button type="text" size="small" slot="reference">{{scope.row['state']}}</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editState(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-popconfirm
              confirmButtonText="好的"
              @onConfirm="deleteState(scope.row)"
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
import request from "@/api/file/state";
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
    this.$store.commit("state/STATE_PAGE_SIZE", { page, pageSize });
    this.searchStatic();
  },
  methods: {
    // 多选操作
    handleSelectionChange(val) {
      this.idBatch = val.map(item => {
        return item.id;
      });
    },
    // 批量删除
    delAllStatistical() {
      if (this.idBatch == "") {
        this.$message({
          type: "warning",
          message: "请选择删除的报表!"
        });
      } else {
        this.$confirm("此操作将永久删除该报表, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request
              .deleteAllStatistical({ idBatch: this.idBatch.join() })
              .then(res => {
                if (res.data === "deleteBatch!!") {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.$store.dispatch("state/getStatisticalData");
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
          "platformreport/getStatisticalData",
          this.searchData.platformid
        );
      } else {
        this.$store.dispatch("platformreport/getStatisticalData");
      }
    },
    // 状态
    stateChoose(data) {
      request.state(data.id).then(res => {
        if (res.data === "success") {
          this.$commonUtils.setMessage("success", "修改成功");
          this.$store.dispatch("state/getAllTree");
          this.$store.dispatch("state/getStatisticalData");
        } else {
          this.$commonUtils.setMessage("info", "更改失败");
        }
      });
    },
    // 删除
    deleteState(data) {
      this.$store.dispatch("state/deleteState", data.id);
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
      this.$store.commit("state/STATE_PAGE_SIZE", { page, pageSize });
      this.$store.dispatch("state/getStatisticalData");
    },
    // 新增
    addStatistical() {
      this.$emit("add");
    },
    // 修改
    editState(data) {
      this.$emit("edit");
      this.$store.commit("state/getModifyStatisticalData", data);
    },

    // 存档
    saveBook() {},
    // 查询
    searchStatic() {
      this.$store.dispatch("state/getStatisticalData");
    }
  }
};
</script>

<style>
</style>