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
                      prop:"num",
                      label:"编号"
                  },{
                      prop:"name",
                      label:"名称"
                  },{
                      prop:"process",
                      label:"工序"
                  },{
                      prop:"state",
                      label:"状态"
                  },{
                      prop:"smoke",
                      label:"标杆烟气量（Nm3/h）"
                  },{
                      prop:"oxy",
                      label:"氧含量（%）"
                  },{
                      prop:"so_original",
                      label:"SO2原始（mg/m3）"
                  },{
                      prop:"so_reduced",
                      label:"SO2折算（mg/m3)"
                  },{
                      prop:"pm_original",
                      label:"颗粒物原始（mg/m3)"
                  },{
                      prop:"pm_reduced",
                      label:"颗粒物折算（mg/m3)"
                  },{
                      prop:"no_original",
                      label:"氮氧化物原始（mg/m3）"
                  },{
                      prop:"no_reduced",
                      label:"氮氧化物折算（mg/m3)"
                  },{
                      prop:"fl_original",
                      label:"氟化物原始（mg/m3）"
                  },{
                      prop:"fl_reduced",
                      label:"氟化物折算（mg/m3）"
                  },{
                      prop:"hcl_original",
                      label:"氯化氢原始（mg/m3）"
                  },{
                      prop:"hcl_reduced",
                      label:"氯化氢折算（mg/m3)"
                  },{
                      prop:"nh_original",
                      label:"氨原始（mg/m3）"
                  },{
                      prop:"nh_reduced",
                      label:"氨折算（mg/m3）"
                  },{
                      prop:"hg",
                      label:"汞及其化合物（mg/m3）"
                  },{
                      prop:"unit",
                      label:"检测单位"
                  },{
                      prop:"report_num",
                      label:"报告编号"
                  },{
                      prop:"report_con",
                      label:"报告内容"
                  }
              ],
              tableData:[
                  {
                      time:"2019-01-10",
                      num:"DA105",
                      name:"",
                      process:"烧成",
                      state:"正常",
                      smoke:"485655",
                      oxy:"8.64",
                      so_original:"0.1",
                      so_reduced:"0.16",
                      pm_original:"1.21",
                      pm_reduced:"1.19",
                      no_original:"66.02",
                      no_reduced:"58.76",
                      fl_original:"",
                      fl_reduced:"",
                      hcl_original:"",
                      hcl_reduced:"",
                      nh_original:"",
                      nh_reduced:"",
                      hg:"",
                      unit:"永正",
                      report_num:"",
                      report_con:"浏览"
                  }
              ]
          }
      }

  }
</script>
<style>

</style>