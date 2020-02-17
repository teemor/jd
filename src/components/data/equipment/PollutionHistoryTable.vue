<template>
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="时间类型">
          <el-date-picker v-model="formInline.type" placeholder="时间类型" size="mini"></el-date-picker>
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="formInline.time" placeholder="时间" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="formInline.num" placeholder="编号" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formInline.name" placeholder="名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="mini" v-model="formInline.state" placeholder="状态">
            <el-option size="mini" label="正常" value="normal"></el-option>
            <el-option size="mini" label="警报" value="warning"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
        <el-table :data="tableData" border style="width:100%">
            <el-table-column v-for="(item,index) in colData" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
        </el-table>
    </div>
    <div class="block">
      <el-pagination :page-size="10" layout="total, prev, pager, next" :total="100"></el-pagination>
    </div>
  </div>
</template>

<script>

  export default {
      data(){
          return{
              formInline:{
                  type:"",
                  time:"",
                  num:"",
                  name:"",
                  state:""
              },
              colData:[
                  { 
                      prop:"time",
                      label:"时间"
                  },{
                      prop:"name",
                      label:"名称"
                  },{
                      prop:"num",
                      label:"编号"
                  },{
                      prop:"type",
                      label:"类型"
                  },{
                      prop:"hotair",
                      label:"热风挡板开度"
                  },{
                      prop:"circulation",
                      label:"循环风挡板开度"
                  },{
                      prop:"tower",
                      label:"增湿塔挡板开度"
                  },{
                      prop:"tower_flow",
                      label:"增湿塔喷水流量"
                  },{
                      prop:"in_pressure",
                      label:"入口压力"
                  },{
                      prop:"out_pressure",
                      label:"出口压力"
                  },{
                      prop:"in_temp",
                      label:"入口温度"
                  },{
                      prop:"flow",
                      label:"喷水量"
                  }
              ],
              tableData:[
                  {
                      time:"2019-01-10",
                      name:"1", 
                      num:"DA105",
                      type:"1",
                      hotair:"1",
                      circulation:"1",
                      tower:"1",
                      tower_flow:"1",
                      in_pressure:"0.16",
                      out_pressure:"1.21",
                      in_temp:"1",
                      flow:"1"
                  }
              ]
          }
      }

  }
</script>
<style>
.el-table th{
  color: #000;
  background-color: rgba(0,0,0,0.1)
}
</style>