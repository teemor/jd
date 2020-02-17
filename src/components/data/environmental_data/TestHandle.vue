<template>
  <div id="test-handler">
    <el-button size="mini" type="primary" @click="add">新增</el-button>
    <el-button size="mini" type="success" @click="modify">修改</el-button>
    <el-button size="mini" type="danger" @click="save">保存</el-button>
    <el-button size="mini" type="warning" @click="commit">提交</el-button>
    <el-button size="mini" type="primary" @click="out">导出</el-button>
    <!-- 修改 -->
    <el-form 
      :model="JSON.stringify(modifyData) === '{}' ? dealForm : dealForm = modifyData" 
      label-width="150px"
      :disabled="disabled"
      :rules="rules"
      ref="dealForm"
      v-if="sign === 'deal'"
    >
      <el-form-item label="名称" prop="name">
        <el-select v-model="dealForm.name" placeholder="请选择名称" size="mini" @change="clickNode" filterable>
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编号" prop="deviceId">
        <el-input v-model="dealForm.deviceId" placeholder="编号" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="工艺段" prop="process">
        <el-input v-model="dealForm.process" placeholder="工艺段" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="经手人" prop="handler">
        <el-input v-model="dealForm.handler" placeholder="经手人" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="监测单位" prop="company">
        <el-input v-model="dealForm.company" placeholder="监测单位" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="检测时间" prop="cycle">
        <el-date-picker
          size="mini"
          v-model="dealForm.cycle"
          type="date"
          placeholder="检测时间"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报告编号" prop="reportNum">
        <el-input v-model="dealForm.reportNum" placeholder="报告编号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="检测项目" class="form-textarea">
        <div class="text-item">
          <el-form-item v-for="(items, index) in item" :label="items.name" label-width="180px" :prop="items.name" :key="index">
            <el-input v-model="items.value" :placeholder="items.name" size="mini"></el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="报告内容" class="form-textarea" prop="reportCon">
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
      :disabled="disabled"
      :rules="rules"
      ref="dealForm"
      v-if="sign === 'add'"
    >
      <el-form-item label="名称" prop="name">
        <el-select v-model="addForm.name" placeholder="请选择名称" size="mini" @change="clickNode" filterable>
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编号" prop="deviceId">
        <el-input v-model="addForm.deviceId" placeholder="编号" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="工艺段" prop="process">
        <el-input v-model="addForm.process" placeholder="工艺段" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="经手人" prop="handler">
        <el-input v-model="addForm.handler" placeholder="经手人" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="监测单位" prop="company">
        <el-input v-model="addForm.company" placeholder="监测单位" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="检测时间" prop="cycle">
        <el-date-picker
          size="mini"
          v-model="addForm.cycle"
          type="date"
          placeholder="检测时间"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报告编号" prop="reportNum">
        <el-input v-model="addForm.reportNum" placeholder="报告编号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="检测项目" class="form-textarea">
        <div class="text-item">
          <el-form-item v-for="(items, index) in item" :label="items.name" label-width="180px" :prop="items.name" :key="index">
            <el-input v-model="items.value" :placeholder="items.name" size="mini"></el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="报告内容" class="form-textarea" prop="reportCon">
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
const { mapGetters } = createNamespacedHelpers("environmentdata");

  export default {
    data(){
      return{
        dealForm:{
          deviceId: "",//编号
          name: "",//名称
          process: "",//工序
          handler: "",//经手人
          company: "",//监测单位
          cycle: "",//监测时间
          reportNum: "",//报告编号
          testItem: "",//检测项目
          reportCon: "",//报告内容
        },
        disabled: true,
        rules: {
          deviceId: { required: true, message: '请输入编号', trigger: 'blur' },
          name: { required: true, message: '请输入名称', trigger: 'blur' },
          handler: { required: true, message: '请输入经手人', trigger: 'blur' },
          reportNum: { required: true, message: '请输入报告编号', trigger: 'blur' },
        },
        attachment: [],
        fileList: [],
      }
    },
    computed: {
      ...mapGetters({
        modifyData: "modifyData",
        item: "item",
        options: 'options',
        sign: 'sign',
        addForm: 'addForm'
      })
    },
    methods:{
      // 获取排污口
      getDrain() {
        this.$store.dispatch('environmentdata/getDrain')
      },
      // 搜索排污口数据
      clickNode(node) {
        this.$store.dispatch('environmentdata/searchDrain', node)
      },
      add() {
        this.getDrain();
        this.disabled = false;
        this.$store.commit('environmentdata/signChange', 'add')
        this.fileList = []
        let item = []
        this.$store.commit('environmentdata/clear', item)
        this.$store.dispatch('environmentdata/getUser')
        this.$store.dispatch('environmentdata/getTime')
      },
      modify() {
        this.getDrain();
        this.attachment = []
        this.fileList = []
        this.disabled = false;
        this.$store.commit('environmentdata/signChange', 'deal')
        if(this.modifyData.reportCon !== '') {
          let a = this.modifyData.reportCon.split(',');  
          if(a.length > 0) {
            a.forEach(item => {
              var obj = {} 
              let index = item.replace(/\\/g,"/").lastIndexOf('\/');
              let fileName  = item.substring(index + 1, item.length); //最后的文件名截取出来
              this.$set(obj,'name', fileName);
              this.$set(obj,'url', item);  //修改fileList里面的结构（name,url）
              this.fileList.push(obj);
            })
          }
          this.attachment.push(this.modifyData.reportCon.split(','))
        }
        this.$store.commit("environmentdata/upload", this.attachment)
        this.$store.dispatch('environmentdata/getUser')
      },
      save() {
        this.$refs.dealForm.validate(valid => {
          if(valid) {
            if(this.sign === 'deal') {
              this.$store.dispatch('environmentdata/dealSave', this.dealForm).then(() => {
                this.disabled = true;
              })
            } else {
              this.$store.dispatch('environmentdata/dealSave', this.addForm).then(() => {
                this.disabled = true;
              })
            }
          } else {
            this.$commonUtils.setMessage("warning", "请输入完整内容");
          }
        })
      },
      commit() {
        this.$store.dispatch('environmentdata/dealCommit', this.dealForm)
      },
      out() {
        let url = '';
        if (this.dealForm.reportCon.indexOf('webapps') !== -1) {
          let index = this.dealForm.reportCon.lastIndexOf('webapps')
          url = this.dealForm.reportCon.substr(index+8, this.dealForm.reportCon.length)
        } 
        if(url !== '') {
          // window.location.href = "http://yz.c.ic.ci/" + url;
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
        this.attachment.push(res)
        this.$store.commit('environmentdata/upload', this.attachment)
      },
      // 删除上传附件
      handleRemove(file, fileList) {
        if(file.status === 'success') {
          this.attachment.splice(this.fileList.findIndex(item => item.url === file.url), 1)
        } else {
          this.fileList.splice(this.fileList.findIndex(item => item.url === file.url), 1)
        }
      },
    }
  }
</script>
<style>
#test-handler .text-item{
  border:#dcdfe6 1px solid;
  border-radius: 4px;
  padding: 20px;
}
#test-handler .el-form-item{
   display: inline-block;
   width: 30%;
   vertical-align: top;
}
#test-handler .form-textarea{
  width:90%;
}
</style>