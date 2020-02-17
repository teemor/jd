<template>
<!-- 处理 -->
  <div id="warn-handle">
    <el-button size="mini" type="primary" @click="modify">修改</el-button>
    <el-button size="mini" type="primary" @click="save">保存</el-button>
    <el-form 
      :model="JSON.stringify($store.state.warnrecord.modifyData) === '{}' ? dealForm : dealForm = $store.state.warnrecord.modifyData" 
      label-width="150px" 
      :disabled="disabled"
      :rules="rules"
      ref="dealForm"
    >
      <el-form-item label="报警编号" prop='warnNum'>
        <el-input v-model="dealForm.warnNum" placeholder="报警编号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="报警类型" prop="type">
        <el-input v-model="dealForm.type" placeholder="报警类型" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="编号" prop="num">
        <el-input v-model="dealForm.num" placeholder="编号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dealForm.name" placeholder="名称" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="报警时间" prop="warnTime">
        <el-input v-model="dealForm.warnTime" placeholder="报警时间" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="处理人" prop="handler">
        <el-input v-model="dealForm.handler" placeholder="处理人" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="报警内容" class="form-textarea" prop="excessive">
        <el-input type="textarea" v-model="dealForm.excessive" placeholder="报警内容" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="问题原因" class="form-textarea" prop="reason">
        <el-input type="textarea" v-model="dealForm.reason" placeholder="问题原因" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="处理方法" class="form-textarea" prop="handleMethod">
        <el-input type="textarea" v-model="dealForm.handleMethod" placeholder="处理方法" size="mini"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data(){
    return{
      disabled: true,
      dealForm:{
        warnNum: "",
        type: "",
        num: "",
        name: "",
        warnTime: "",
        handler: "",
        warnContent: "",
        reason: "",
        handleMethod: ""
      },
      rules: {
        warnNum: { required: true, message: '请输入报警编号', trigger: 'blur' },
        type: { required: true, message: '请输入报警类型', trigger: 'blur' },
        num: { required: true, message: '请输入编号', trigger: 'blur' },
        name: { required: true, message: '请输入名称', trigger: 'blur' },
        warnTime: { required: true, message: '请输入报警时间', trigger: 'blur' },
        handler: { required: true, message: '请输入处理人', trigger: 'blur' },
        excessive: { required: true, message: '请输入报警内容', trigger: 'blur' },
        reason: { required: true, message: '请输入问题原因', trigger: 'blur' },
        handleMethod: { required: true, message: '请输入处理方法', trigger: 'blur' }
      }
    }
  },
  methods:{
    modify(){
      this.disabled = false;
    },
    save(){
      this.$refs.dealForm.validate(valid => {
        if(valid) {
          this.$store.dispatch('warnrecord/dealSave', this.dealForm).then(() => {
            this.disabled = true;
          })
        } else {
          this.$commonUtils.setMessage("warning", "请输入完整内容");
        }
      })
    },
  }

}
</script>
<style>
#warn-handle .el-form-item{
   display: inline-block;
   width: 30%;
   vertical-align: top;
}
#warn-handle .form-textarea{
  width:90%;
}
</style>