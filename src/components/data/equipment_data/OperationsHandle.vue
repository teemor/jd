<template>
<!-- 第三方运维-处理 -->
  <div id="operation-handle">
    <el-button size="mini" type="primary" @click="add">新增</el-button>
    <el-button size="mini" type="success" @click="modify">修改</el-button>
    <el-button size="mini" type="danger" @click="save">保存</el-button>
    <el-button size="mini" type="warning" @click="commit">提交</el-button>
    <el-button size="mini" type="primary" @click="out">导出</el-button>
    <!-- 修改 -->
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
      <el-form-item label="经手人" prop="handler">
        <el-input v-model="dealForm.handler" placeholder="经手人" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="运维单位" prop="unit">
        <el-input v-model="dealForm.unit" placeholder="运维单位" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="运维时间" prop="time">
        <el-date-picker
          v-model="dealForm.time"
          type="date"
          placeholder="运维时间"
          value-format="yyyy-MM-dd"
          size="mini">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报告编号" prop="reportNum">
        <el-input v-model="dealForm.reportNum" placeholder="报告编号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="运维项目" class="form-textarea" prop="item">
        <el-input type="textarea" v-model="dealForm.item" placeholder="运维项目" size="mini"></el-input>        
      </el-form-item>
      <el-form-item label="报告内容" class="form-textarea">
        <el-upload 
          action="http://yz.c.ic.ci/jdem/jdTesting/inspectiontask/import" 
          ref="upload"
          :file-list="fileList"
          :show-file-list="true"
          :before-upload="beforeUpload"
          :on-success="upload"
          :on-remove="handleRemove"
          accept=".pdf"
          :limit='1' 
        >
          <el-button size="mini" type="primary">上传附件</el-button>
          <span slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过500kb</span>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 新增 -->
    <el-form 
      :model="addForm" 
      label-width="150px" 
      ref="dealForm"
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
      <el-form-item label="经手人" prop="handler">
        <el-input v-model="addForm.handler" placeholder="经手人" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="运维单位" prop="unit">
        <el-input v-model="addForm.unit" placeholder="运维单位" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="运维时间" prop="time">
        <el-date-picker
          v-model="addForm.time"
          type="date"
          placeholder="运维时间"
          value-format="yyyy-MM-dd"
          size="mini">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报告编号" prop="reportNum">
        <el-input v-model="addForm.reportNum" placeholder="报告编号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="运维项目" class="form-textarea" prop="item">
        <el-input type="textarea" v-model="addForm.item" placeholder="运维项目" size="mini"></el-input>        
      </el-form-item>
      <el-form-item label="报告内容" class="form-textarea">
        <el-upload 
          action="http://yz.c.ic.ci/jdem/jdTesting/inspectiontask/import" 
          ref="upload"
          :file-list="fileList"
          :show-file-list="true"
          :before-upload="beforeUpload"
          :on-success="upload"
          :on-remove="handleRemove"
          accept=".pdf"
          :limit='1' 
        >
          <el-button size="mini" type="primary">上传附件</el-button>
          <span slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过500kb</span>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("thirdoperations");

  export default {
    data(){
      return{
        dealForm:{
          type: "",//维护类型
          name: "",//设备档案
          process: "",//工艺段
          handler: "",//经手人
          unit: "",//运维单位
          time: "",//运维时间
          reportNum: "",//报告编号
          item: "",//检测项目
          reportCon: ""//报告内容
        },
        fileList: [],
        rules: {
          type: { required: true, message: '请输入维护类型', trigger: 'blur' },
          handler: { required: true, message: '请输入经手人', trigger: 'blur' },
          reportNum: { required: true, message: '请输入报告编号', trigger: 'blur' },
          item: { required: true, message: '请输入检测项目', trigger: 'blur' },
          time: { required: true, message: '请输入检测时间', trigger: 'blur' }
        },
        disabled: true,
      }
    },
    computed: {
      ...mapGetters({
        addForm: 'addForm',
        modifyData: "modifyData",
        sign: 'sign',
        options: 'options'
      })
    },
    methods:{
      // 获取设备名称 
      getEqu() {
        this.$store.dispatch('thirdoperations/getEqu')
      },
      // 搜索设备数据
      clickNode(node) {
        this.$store.dispatch('thirdoperations/searchEqu', node)
      },
      add(){
        this.getEqu()
        this.fileList = []
        this.disabled = false;
        this.$store.commit('thirdoperations/signChange', 'add')
        this.$store.dispatch('thirdoperations/getUser')
        this.$store.dispatch('thirdoperations/getTime')
      },
      modify(){
        this.getEqu();
        this.disabled = false;
        console.log(this.modifyData,'modify')
        this.fileList = []
        if(this.modifyData.reportCon !== '' && this.modifyData.reportCon !== null) {
          let a = this.modifyData.reportCon;  
          if(a.length > 0) {
            var obj = {} 
            let index = a.replace(/\\/g,"/").lastIndexOf('\/');
            let fileName  = a.substring(index + 1, a.length); //最后的文件名截取出来
            this.$set(obj,'name', fileName);
            this.$set(obj,'url', a);  //修改fileList里面的结构（name,url）
            this.fileList.push(obj);
          }
        }
        this.$store.commit("thirdoperations/upload", this.modifyData.reportCon)
        this.$store.commit('thirdoperations/signChange', 'deal')
        this.$store.dispatch('thirdoperations/getUser')
      },
      save(){
        if(this.sign === 'add') {
          this.$store.dispatch('thirdoperations/saveOperations', this.addForm).then(res => {
            let form = {
              type: "",
              name: "",
              process: "",
              handler: "",
              unit: "",
              time: "",
              reportNum: "",
              item: "",
              reportCon: ""
            }
            this.$store.commit('thirdoperations/reset', form)
            this.disabled = true;
          })
        } else {
          this.$store.dispatch('thirdoperations/saveOperations', this.dealForm).then(res => {
            this.disabled = true;
          })
        }
      },
      commit(){
        this.$store.dispatch('thirdoperations/dealCommit', this.dealForm)
      },
      out(){
        let url = '';
        console.log(this.dealForm.reportCon)
        if (this.dealForm.reportCon.indexOf('webapps') !== -1) {
          let index = this.dealForm.reportCon.lastIndexOf('webapps')
          url = this.dealForm.reportCon.substr(index+8, this.dealForm.reportCon.length)
        } 
        if(url !== '') {
          window.open("http://yz.c.ic.ci/" + url)
        } else {
          this.$commonUtils.setMessage("warning", "无文件导出");
        }
      },
      // 文件类型判断
      beforeUpload(file) {
        var filetype = file.name.substring(file.name.lastIndexOf('.') + 1)
        const type = filetype === 'pdf'
        if(!type) {
          this.$message({
            message: '只能上传pdf文件!',
            type: 'warning'
          });
        }
        return type
      },
      // 上传成功
      upload(res, file, fileList) {
        this.$store.commit('thirdoperations/upload', res)
      },
      // 删除上传附件
      handleRemove(file, fileList) {
        this.fileList.splice(this.fileList.findIndex(item => item.url === file.url), 1)
      },
    }

  }
</script>
<style>
#operation-handle .text-item{
  border:#dcdfe6 1px solid;
  border-radius: 4px;
  padding: 20px;
}
#operation-handle .el-form-item{
   display: inline-block;
   width: 30%;
   vertical-align: top;
}
#operation-handle .form-textarea{
  width:90%;
}
</style>