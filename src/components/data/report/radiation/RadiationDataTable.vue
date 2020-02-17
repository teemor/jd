<template>
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input size="mini" v-model="formInline.user" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input size="mini" v-model="formInline.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="mini" v-model="formInline.region" placeholder="状态">
            <el-option size="mini" label="正常" value="normal"></el-option>
            <el-option size="mini" label="警报" value="warn"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="fl" style="width:60%">
      <general-table
        :body="tableData"
        :showPagination="true"
        :total="tableData.total"
        @paginationChange="paginationChange"
      >
        <el-table-column label="实时数据" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="scanTable(scope.row)">
              <template>查看</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <div class="fr" style="width:30%">
      <general-table :body="datashow" :total="tableData.total" @paginationChange="paginationChange"></general-table>
    </div>
  </div>
</template>

<script>
import request from "@/api/data/reportonline";
import datashow from "@/mixins/datashow";
export default {
  mixins: [datashow],
  data() {
    return {
      form: {
        page: 1,
        pageSize: 10,
        id: 7
      },
      formInline: {
        user: "",
        region: ""
      },
      tableData: {
        header: [
          {
            prop: "deviceid",
            value: "编号"
          },
          {
            prop: "name",
            value: "名称"
          },
          {
            prop: "police",
            value: "状态"
          }
        ],
        tableData: []
      }
    };
  },
  created() {
    this.selectAll({});
  },
  methods: {
    // 分页
    paginationChange(page, pageSize) {
      this.form.page = page;
      this.form.pageSize = pageSize;
      this.selectSewage(this.form);
    },
    selectAll(model) {
      request
        .getonLinePage(JSON.stringify(model) == "{}" ? this.form : model)
        .then(res => {
          if (res.data.tableData.length === 0 && res.data.totalItem !== 0) {
            this.selectAll({ page: 1, pageSize: 10 });
          }
          this.tableData.tableData = res.data.tableData;
          this.tableData.total = res.data.totalItem;
        });
    },
    onSubmit() {
      console.log("submit!");
    },
    sellStyle({ row, column, rowIndex, colIndex }) {
      if (column.property === "state") {
        switch (row.state) {
          case "正常":
            return {
              background: "#fff",
              color: "#606266"
            };
            break;
          case "警报":
            return {
              background: "#f00",
              color: "#FFFFFF"
            };
            break;
        }
      }
    }
  }
};
</script>

<style>
.block {
  margin-top: 30px;
}
.el-button--primary {
  background-color: #6eaaab;
  border: #6eaaab;
}
.el-button--primary:focus,
.el-button--primary:hover {
  background-color: #60969a;
  border: #60969a;
}
</style>


