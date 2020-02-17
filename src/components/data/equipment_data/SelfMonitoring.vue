<template>
<!-- 自行维护-监测记录 -->
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="维护科室">
          <el-input size="mini" v-model="formInline.department" placeholder="维护科室"></el-input>
        </el-form-item>
        <el-form-item label="维护时间">
          <el-input size="mini" v-model="formInline.time" placeholder="维护时间"></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input size="mini" v-model="formInline.num" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input size="mini" v-model="formInline.type" placeholder="类型"></el-input>
        </el-form-item>
        <el-form-item label="经手人">
          <el-input size="mini" v-model="formInline.handler" placeholder="经手人"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="mini" v-model="formInline.status" placeholder="状态">
            <el-option label="待办" value="待办"></el-option>
            <el-option label="已办" value="已办"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <general-table 
        :body="$store.state.selfmonitor.tableData" 
        :showPagination="true" 
        :total="$store.state.selfmonitor.tableData.total" 
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
          department:"",// 维护科室
          time:"",// 维护时间
          num:"",// 编号
          type:"",// 维护类型
          handler:"",// 经手人
          status:""// 状态
        },
        
      }
    },
    mounted() {
      this.getList({})
    },
    methods: {
      // 查询列表
      getList() {
        this.$store.dispatch('selfmonitor/getSelf')
      },
      // 搜索
      search() {
        this.$store.dispatch('selfmonitor/searchSelf', this.formInline)
      },
      // 处理
      deal(data) {
        this.$emit('deal', data)
      },
      del(data) {
        this.$confirm('此操作将删除该监测记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('selfmonitor/delSelf', data.recordNum).then(() => {
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