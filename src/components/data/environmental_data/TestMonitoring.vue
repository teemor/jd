<template>
<!-- 监测记录 -->
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="监测时间">
          <el-input size="mini" v-model="formInline.cycle" placeholder="监测时间"></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input size="mini" v-model="formInline.deviceId" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item label="经手人">
          <el-input size="mini" v-model="formInline.handler" placeholder="经手人"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="mini" v-model="formInline.stu" placeholder="状态">
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
        :body="$store.state.environmentdata.tableData" 
        :showPagination="true" 
        :total="$store.state.environmentdata.tableData.total" 
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
import request from "@/api/data/environmentdata";

export default {
  data(){
    return{
      formInline:{
        cycle:"",
        deviceId:"",
        handler:"",
        stu:""
      },
    }
  },
  mounted() {
    this.getList({});
  },
  methods: {
    // 查询列表
    getList() {
      this.$store.dispatch('environmentdata/getTestMonitor')
    },
    // 搜索
    search() {
      console.log(this.formInline)
      this.$store.dispatch('environmentdata/searchMonitor', this.formInline)
    },
    // 处理
    deal(data) {
      if(data.testData === null) {
        let dealData = [];
        data.testItem.split(',').map((res) => {
          dealData.push({
            name: res,
            value: ''
          })
        })
        this.$emit('deal', data, dealData)
      } else {
        this.$emit('deal', data, data.testData)
      }
    },
    // 删除
    del(data) {
      this.$confirm('此操作将删除该监测记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('environmentdata/delMonitor', data.recordNum).then(() => {
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