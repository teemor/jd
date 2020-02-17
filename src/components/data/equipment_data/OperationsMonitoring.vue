<template>
<!-- 第三方运维-监测记录 -->
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="运维时间">
          <el-input size="mini" v-model="formInline.time" placeholder="运维时间"></el-input>
        </el-form-item>
        <el-form-item label="报告编号">
          <el-input size="mini" v-model="formInline.reportNum" placeholder="报告编号"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input size="mini" v-model="formInline.type" placeholder="类型"></el-input>
        </el-form-item>
        <el-form-item label="经手人">
          <el-input size="mini" v-model="formInline.handler" placeholder="经手人"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="mini" v-model="formInline.status" placeholder="状态">
            <el-option size="mini" label="待办" value="待办"></el-option>
            <el-option size="mini" label="已办" value="已办"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <general-table 
        :body="$store.state.thirdoperations.tableData" 
        :showPagination="true" 
        :total="$store.state.thirdoperations.tableData.total" 
        :showcheck="false"
        @paginationChange="paginationChange"
      >
        <el-table-column label="处理" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-tickets" size="small" @click="deal(scope.row)">
              <template>处理</template>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="删除" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" size="small" @click="del(scope.row)">
              <template>删除</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
  </div>
</template>

<script>

  export default {
    data(){
      return{
        formInline:{
          time:"",
          reportNum:"",
          type:"",
          handler:"",
          status:""
        },
      }
    },
    mounted() {
      this.getList({});
    },
    methods: {
      getList() {
        this.$store.dispatch('thirdoperations/getOperations')
      },
      // 搜索
      search() {
        console.log(this.formInline)
        this.$store.dispatch('thirdoperations/searchOperations', this.formInline)
      },
      // 处理
      deal(data) {
        this.$emit('deal', data)
      },
      // 删除
      del(data) {
        this.$confirm('此操作将删除该监测记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('thirdoperations/delOperations', data.recordNum).then(() => {
            this.$commonUtils.setMessage('success', '删除成功')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 分页查询
      paginationChange(page,pageSize) {
        this.getList({ page: page, pageSize: pageSize });
      },
    }

  }
</script>
<style>

</style>