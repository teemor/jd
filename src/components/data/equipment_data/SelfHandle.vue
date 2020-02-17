<template>
<!-- 自行维护-处理 -->
  <div id="self-handle">
    <el-button @click="add" size="mini" type="primary">新增</el-button>
    <el-button @click="modify" size="mini" type="success">修改</el-button>
    <el-button @click="save" size="mini" type="warning">保存</el-button>
    <el-button @click="commit" size="mini" type="danger">提交</el-button>
    <el-form
      :model="JSON.stringify(modifyData) === '{}' ? dealForm : dealForm = modifyData" 
      label-width="150px" 
      ref="dealForm"
      :rules="rules"
      :disabled="disabled"
      v-if="sign === 'deal'"
    >
      <el-form-item label="维护类型" prop="type">
        <el-input v-model="dealForm.type" placeholder="维护类型" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="设备档案" prop="name">
        <el-select v-model="dealForm.name" placeholder="请选择设备档案" size="mini" @change="clickNode" filterable>
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工艺段" prop="process">
        <el-input v-model="dealForm.process" placeholder="工艺段" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="编号" prop="num">
        <el-input v-model="dealForm.num" placeholder="编号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="维护时间" prop="time">
        <el-date-picker
          v-model="dealForm.time"
          type="date"
          placeholder="维护时间"
          value-format="yyyy-MM-dd"
          size="mini">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="维护科室" prop="department">
        <el-input v-model="dealForm.department" placeholder="维护科室" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="经手人" prop="handler">
        <el-input v-model="dealForm.handler" placeholder="经手人" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="运维内容" class="form-textarea" prop="content">
        <el-input type="textarea" v-model="dealForm.content" placeholder="运维内容" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <!-- 新增 -->
    <el-form
      :model="addForm" 
      label-width="150px" 
      ref="addForm"
      :rules="rules"
      :disabled="disabled"
      v-if="sign === 'add'"
    >
      <el-form-item label="维护类型" prop="type">
        <el-input v-model="addForm.type" placeholder="维护类型" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="设备档案" prop="name">
        <el-select v-model="addForm.name" placeholder="请选择设备档案" size="mini" @change="clickNode" filterable>
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工艺段" prop="process">
        <el-input v-model="addForm.process" placeholder="工艺段" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="编号" prop="num">
        <el-input v-model="addForm.num" placeholder="编号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="维护时间" prop="time">
        <el-date-picker
          v-model="addForm.time"
          type="date"
          placeholder="维护时间"
          value-format="yyyy-MM-dd"
          size="mini">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="维护科室" prop="department">
        <el-input v-model="addForm.department" placeholder="维护科室" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="经手人" prop="handler">
        <el-input v-model="addForm.handler" placeholder="经手人" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="运维内容" class="form-textarea" prop="content">
        <el-input type="textarea" v-model="addForm.content" placeholder="运维内容" size="mini"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState } = createNamespacedHelpers("selfmonitor");

  export default {
    data(){
      return{
        dealForm:{
          type: "",// 维护类型
          name: "",// 设备档案
          process: "",// 工艺段
          num: "",// 编号
          time: "",// 维护时间
          department: "",// 维护科室
          handler: "",// 经手人
          content: "" // 运维内容
        },
        disabled: true,
        rules: {
          type: { required: true, message: '请输入维护类型', trigger: 'blur' },
          handler: { required: true, message: '请输入经手人', trigger: 'blur' },
          num: { required: true, message: '请输入编号', trigger: 'blur' },
          content: { required: true, message: '请输入运维内容', trigger: 'blur' }
        },
      }
    },
    computed: {
      ...mapGetters({
        modifyData: "modifyData",
        sign: "sign",
        options: 'options',
        addForm: 'addForm'
      })
    },
    mounted() {
      this.getEqu()
    },
    methods:{
      add(){
        this.disabled = false;
        this.$store.commit('selfmonitor/signChange', 'add')
        this.$store.dispatch('selfmonitor/getUser')
        this.$store.dispatch('selfmonitor/getTime')
      },
      modify(){
        this.disabled = false;
        this.$store.commit('selfmonitor/signChange', 'deal')
        this.$store.dispatch('selfmonitor/getUser')
      },
      save(){
        if(this.sign === 'add') {
          this.$store.dispatch('selfmonitor/save', this.addForm).then(() => {
            let form = {
              type: "",
              name: "",
              process: "",
              num: "",
              time: "",
              department: "",
              handler: "",
              content: "" 
            }
          this.$store.commit('selfmonitor/reset', form)
          this.disabled = true;
          })
        } else {
          this.$store.dispatch('selfmonitor/save', this.dealForm)
          this.disabled = true;
        }
      },
      commit(){
        this.$store.dispatch('selfmonitor/selfCommit', this.dealForm).then(() => {
          this.disabled = true;
        })
      }, 
      // 获取设备名称 
      getEqu() {
        this.$store.dispatch('selfmonitor/getEqu')
      },
      clickNode(node) {
        this.$store.dispatch('selfmonitor/searchEqu', node)
      }
    }

  }
</script>
<style>
#self-handle .el-form-item{
   display: inline-block;
   width: 30%;
   vertical-align: top;
}
#self-handle .form-textarea{
  width:90%;
}
</style>