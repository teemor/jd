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
      <el-table :data="tableData" border style="width: 100%" class="datashow_form">
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
          prop:"state",
          label:"状态"
        },{
          prop:"tsp",
          label:"TSP"
        },{
          prop:"pm10",
          label:"PM10"
        },{
          prop:"pm25",
          label:"PM2.5"
        }
      ],
      tableData:[
        {
          time:"2019-09-10 16:00:00",
          num:"D0375",
          name:"料棚",
          state:"正常",
          tsp:"",
          pm10:"",
          pm25:""
        }
      ]
    }
  }
}
</script>