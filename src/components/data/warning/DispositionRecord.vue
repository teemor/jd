<template>
<!-- 处理记录 -->
  <div>
    <!-- 搜索 -->
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="searchForm">
        <el-form-item label="原因" prop="reason">
          <el-input size="mini" v-model="formInline.reason" placeholder="原因"></el-input>
        </el-form-item>
        <el-form-item label="报警时间" prop='warnTime'>
          <el-input size="mini" v-model="formInline.warnTime" placeholder="报警时间"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop='num'>
          <el-input size="mini" v-model="formInline.num" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item label="报警类型" prop='type'>
          <el-input size="mini" v-model="formInline.type" placeholder="报警类型"></el-input>
        </el-form-item>
        <el-form-item label="处理人" prop='handler'>
          <el-input size="mini" v-model="formInline.handler" placeholder="处理人"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop='status'>
          <el-select size="mini" v-model="formInline.status" placeholder="状态">
            <el-option size="mini" label="已处理" value="已处理"></el-option>
            <el-option size="mini" label="未处理" value="未处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchRecord">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <general-table 
        :body="$store.state.warnrecord.tableData" 
        :showPagination="true" 
        :total="$store.state.warnrecord.tableData.total" 
        :showcheck="false"
        @paginationChange="paginationChange"
      >
        <el-table-column label="处理" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-tickets" size="small" @click="deal(scope.row)" v-if="scope.row.status == '未处理'">
              <template>处理</template>
            </el-button>
            <el-button type="text" icon="el-icon-tickets" size="small" @click="deal(scope.row)" v-else disabled>
              <template>处理</template>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="浏览" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" size="small" @click="deal(scope.row)">
              <template>浏览</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
  </div>
</template>

<script>
import request from "@/api/data/warning";

  export default {
    data(){
      return{
        formInline:{
          reason: "",
          warnTime: "",
          num: "",
          type: "",
          handler: "",
          status: ""
        },
      }
    },
    mounted() {
      this.getRecord();
    },
    methods: {
      // 获取记录管理列表
      getRecord() {
        this.$store.dispatch('warnrecord/getRecord')
      },
      // 搜索
      searchRecord() {
        this.$store.dispatch("warnrecord/searchRecord", this.formInline).then(() => {
          this.$refs['searchForm'].resetFields();
        })
      },
      // 处理，浏览
      deal(data) {
        this.$emit('deal', data)
      },
      // 分页查询
      paginationChange(page,pageSize) {
        this.$store.dispatch("warnrecord/getRecord");
      },
      
    }

  }
</script>
<style>

</style>


