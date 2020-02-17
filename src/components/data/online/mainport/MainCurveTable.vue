<template>
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input size="mini" v-model="formInline.num" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input size="mini" v-model="formInline.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input size="mini" v-model="formInline.item" placeholder="项目"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      formInline:{
        num:"",
        name:"",
        item:""
      }
    }
  },
  methods:{
    onSubmit(){}
  }
}
</script>

<style>

</style>