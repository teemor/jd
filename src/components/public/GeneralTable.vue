<template>
  <div id="BasicTable">
    <el-table
      :cell-style="sellStyle"
      border
      :fit="true"
      style
      :data="body?body.tableData:[]"
      @selection-change="handleSelectionChange"
      max-height="625"
      height="625"
    >
      <el-table-column v-if="showcheck==true" type="selection" width="50" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>

      <slot name="left"></slot>
      <template v-for="(column,index) in body?body.header:[]">
        <el-table-column :prop="column.prop" align="center" :label="column.value" :key="index">
          <template slot-scope="scope">
            <span v-if="scope.column.property=='state'">
              <el-popconfirm
                @onConfirm="stateModel(scope.row)"
                :title="scope.row[scope.column.property]=='停用'?'确定启用':'确定停用'+'用户吗'"
              >
                <el-button
                  type="text"
                  slot="reference"
                  size="small"
                >已{{scope.row[scope.column.property]}}</el-button>
              </el-popconfirm>
            </span>
            <span v-else-if="scope.column.property=='pdf'&&scope.row['pdf']!=='暂无'">
              <el-button type="text" size="small" @click="scan(scope.row[scope.column.property])">浏览</el-button>
            </span>
            <span v-else-if="scope.column.property=='doc'&&scope.row['doc']!=='暂无'">
              <el-button
                type="text"
                size="small"
                @click="download(scope.row[scope.column.property])"
              >下载</el-button>
            </span>
            <span v-else-if="scope.column.property=='reportid'">
              <el-button
                type="text"
                size="small"
                @click="download(scope.row[scope.column.property])"
              >浏览</el-button>
            </span>
            <span v-else>{{scope.row[scope.column.property]}}</span>
          </template>
        </el-table-column>
      </template>
      <slot />
      <!-- <el-table-column v-if="operating" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="edit" size="mini" @click="editUser(scope.$index,scope.row)">编辑</el-button>
          <el-button v-if="role" size="mini" @click="assignRole(scope.$index,scope.row)">角色</el-button>
          <el-button v-if="del" size="mini" @click="delUser(scope.$index,scope.row)">删除</el-button>
          <el-button v-if="agreed" size="mini" @click="agree(scope.$index,scope.row)">同意</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <pagination
      v-if="showPagination"
      :total="total"
      :changePage="changePage"
      @pagination-change="paginationChange"
    ></pagination>
  </div>
</template>

<script>
export default {
  props: {
    showcheck: {
      type: Boolean,
      default: true
    },
    // 当前页数
    changePage: Number,
    // 分页属性
    showPagination: {
      type: Boolean,
      default: false
    },
    // 列表相关属性
    body: Object,
    total: ""
  },
  methods: {
    sellStyle({ row, column, rowIndex, colIndex }) {
      if (column.property === "police") {
        switch (row.police) {
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
      if (column.property === "record") {
           switch (row.tableState) {
          case 0:
            return {
              background: "#fff",
              color: "#606266"
            };
            break;
          case 1:
            return {
              background: "#f00",
              color: "#FFFFFF"
            };
            break;
        }
        // if(row.record <= row.standard){
        //   return {
        //       background: "#fff",
        //       color: "#606266"
        //     };
        // }else{
        //    return {
        //       background: "#f00",
        //       color: "#FFFFFF"
        //     };
        // }
      }
      if (column.property === "equipmentDrainpolice") {
        switch (row.equipmentDrainpolice) {
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
    },
    stateModel: function(data) {
      this.$emit("state", data);
    },
    download(url) {
      window.location.href = url;
    },
    scan(url) {
      this.$emit("scan", url);
    },
    /**
     *
     */
    handleSelectionChange: function(e) {
      this.$emit("handleSelectionChange", e);
    },
    // 表格操作按钮
    // handleClick:function(operation,key,index){
    //   this.$emit('')
    // }
    // 分页操作
    paginationChange: function(currentPage, pageSize) {
      this.$emit("paginationChange", currentPage, pageSize);
    },
    // editUser: function(index, data) {
    //   this.$emit("editUser", index, data);
    // },
    // delUser: function(index, data) {
    //   this.$emit("delUser", index, data);
    // },
    // 单选功能
    handleCurrentChange: function(val) {
      this.currentRow = val;
      console.log("aa", val);
      console.log("this.currentRow", this.currentRow.id);
      this.$emit("selsChange", this.currentRow.id);
    }
    // 绑定角色
    // assignRole: function(index, data) {
    //   this.$emit("assignRole",index, data)
    // },
    // 审核通过
    // agree:function(index,data){
    //   this.$emit("agree",index,data)
    // }
  }
};
</script>

<style>
#BasicTable {
  overflow: auto;
}
#pagination {
  margin: auto;
  margin-top: 30px;
}
.el-table th,
.el-table td {
  text-align: center;
}
.el-table th {
  color: #000;
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>
