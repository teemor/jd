<template>
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="时间类型">
          <el-date-picker v-model="formInline.data" placeholder="时间类型" size="mini"></el-date-picker>
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
      <el-table :data="historyData" border style="100%" class="history_form">
        <el-table-column v-for="(item,index) in historyCol" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
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
        data:"",
        time:"",
        num:"",
        name:"",
        state:""
      },
      historyCol:[
        {
          prop:"time",
          label:"时间",
          width: 200
        },{
          prop:"num",
          label:"编号"
        },{
          prop:"name",
          label:"名称"
        },{
          prop:"state",
          label:"状态"
        },{
          prop:"hunidity",
          label:"湿度（%）"
        },{
          prop:"tem",
          label:"温度（%）"
        },{
          prop:"vel",
          label:"流速原始（m/s）",
          width:100
        },{
          prop:"oxy",
          label:"氧含量（%）"
        },{
          prop:"pm_original",
          label:"颗粒物原始（mg/m3）",
          width:100
        },{
          prop:"pm_reduced",
          label:"颗粒物折算（mg/m3）",
          width:100
        },{
          prop:"so_original",
          label:"SO2原始（mg/m3）",
          width:100
        },{
          prop:"so_reduced",
          label:"SO2折算（mg/m3）",
          width:100
        },{
          prop:"nox_original",
          label:"NOX原始（mg/m3）",
          width:100
        },{
          prop:"nox_reduced",
          label:"NOX折算（mg/m3）",
          width:100
        }
      ],
      historyData:[
        {
          time:"2019-09-10 16:01:00",
          num:"DA004",
          name:"A线窑尾",
          state:"正常",
          hunidity:"12.32",
          tem:"139.9",
          vel:"485655",
          oxy:"8.64",
          pm_original:"0.10",
          pm_reduced:"0.16",
          so_original:"0.21",
          so_reduced:"0.19",
          nox_original:"66.02",
          nox_reduced:"58.76",
        }
      ]
    }
  },
  methods:{
    onSubmit(){}
  }
}
</script>

<style>
</style>