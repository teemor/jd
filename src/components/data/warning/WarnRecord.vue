<template>
<!-- 报警记录 -->
  <div>
    <div> 
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="searchForm">
        <el-form-item label="编号" prop="num">
          <el-input size="mini" v-model="formInline.num" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input size="mini" v-model="formInline.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="报警类型" prop="type">
          <el-input size="mini" v-model="formInline.type" placeholder="类型"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select size="mini" v-model="formInline.status" placeholder="状态">
            <el-option label="报警" value="报警"></el-option>
            <el-option label="未处理" value="未处理"></el-option>
            <el-option label="已处理" value="已处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchWarn">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <general-table 
        :body="tableData" 
        :showPagination="true" 
        :total="tableData.total" 
        :showcheck="false"
        @paginationChange="paginationChange"
      ></general-table>
    </div>
  </div>
</template>

<script>
import request from "@/api/data/warning";

export default {
  data(){
    return{
      formInline:{
        num:"",
        name:"",
        type:"",
        status:""
      },
      tableData: {
        header:[
          {
            prop:"warnNum",
            value:"报警编号"
          },{
            prop:"type",
            value:"报警类型"
          },{
            prop:"num",
            value:"编号"
          },{
            prop:"name",
            value:"名称"
          },{
            prop:"excessive",
            value:"超标内容"
          },{
            prop:"warnTime",
            value:"报警时间"
          },{
            prop:"settle",
            value:"需处理"
          },{
            prop:"status",
            value:"状态"
          }
        ],
        tableData: [],
        total: 0
      },
      form: {
        page: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getWarn({});
  },
  methods: {
    // 查询报警记录
    getWarn(model) {
      request.getWarn(JSON.stringify(model) == "{}" ? this.form : model).then(res => {
        this.tableData.tableData = res.data.data;
        this.tableData.total = res.data.count;
      })
    },
    // 查询报警记录
    searchWarn() {
      request.searchWarn(this.formInline).then(res => {
        if(res.data.data == '无符合条件任务') {
          this.$commonUtils.setMessage("warning", res.data.data)
          this.tableData.tableData = [];
        } else {
          this.tableData.tableData = res.data.data;
        }
        this.$refs['searchForm'].resetFields();
      })
    },
    // 分页查询
    paginationChange(page,pageSize) {
      this.getWarn({ page: page, pageSize: pageSize });
    },
  }

}
</script>
<style>

</style>