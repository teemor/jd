<template>
  <!-- 专项任务-任务处理 -->
  <div id="task-process">
    <div>
     <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
        <el-form-item label="发布时间" prop="time"> 
          <el-date-picker
            v-model="formInline.time"
            type="date"
            placeholder="发布时间"
            value-format="yyyy-MM-dd"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="科室" prop="dp">
          <el-cascader
            :options="options"
            :props="{ emitPath: false, checkStrictly: true, label: 'name', key: 'id', value: 'name' }"
            size="mini"
            ref="cascader"
            placeholder="请选择科室"
            v-model="formInline.dp"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="任务类别" prop="type">
          <el-select v-model="formInline.type" placeholder="请选择任务类别" size="mini">
            <el-option label="迎检任务" value="迎检任务"></el-option>
            <el-option label="巡检任务" value="巡检任务"></el-option>
            <el-option label="专项任务" value="专项任务"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布人" prop="person">
          <el-input size="mini" v-model="formInline.person" placeholder="发布人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchProcess('formInline')">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div>
      <general-table 
        :body="tableData" 
        :showPagination="true" 
        :total="tableData.total" 
        :showcheck="false"
        @paginationChange="paginationChange"
      >
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editProcess(scope.row)">
              <template>编辑</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <!-- 编辑专项任务 -->
    <el-dialog :visible.sync="editDialog" title="编辑专项任务">
      <el-form :model="form" label-width="120px" ref="form" :rules="rules" class="form" disabled>  
        <el-form-item label="任务编号" prop="num">
          <el-input size="mini" v-model="form.num" placeholder="任务编号"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择任务类型" size="mini">
            <el-option label="迎检任务" value="迎检任务"></el-option>
            <el-option label="巡检任务" value="巡检任务"></el-option>
            <el-option label="专项任务" value="专项任务"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="name">
          <el-input size="mini" v-model="form.name" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="person">
          <el-input size="mini" v-model="form.person" placeholder="发布人"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="time">
          <el-date-picker
            v-model="form.time"
            type="date"
            placeholder="发布时间"
            value-format="yyyy-MM-dd"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门" prop="dp">
          <el-input size="mini" v-model="form.dp" placeholder="部门"></el-input>
        </el-form-item>
        <el-form-item label="处理人" prop="dealer">
          <el-input size="mini" v-model="form.dealer" placeholder="处理人"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            v-model="form.deadline"
            type="date"
            placeholder="截止时间"
            value-format="yyyy-MM-dd"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input size="mini" type="textarea" v-model="form.content" placeholder="任务内容"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload 
            action="http://yz.c.ic.ci/jdem/jdTesting/inspectiontask/import" 
            ref="upload"
            :file-list="fileList"
            :show-file-list="true"
            accept=".doc,.docx,.pdf,.jpg"
          >
            <el-button size="mini" type="primary">上传附件</el-button>
            <span slot="tip" class="el-upload__tip">只能上传doc、pdf文件，且不超过500kb</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-form :model="dealForm" label-width="120px" ref="dealForm" :rules="rules" class='dealForm'>
        <el-form-item label="处理信息" prop="dealContent">
          <el-input size="mini" type="textarea" v-model="dealForm.dealContent" placeholder="处理信息"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload 
            action="http://yz.c.ic.ci/jdem/jdTesting/inspectiontask/import" 
            ref="upload"
            :file-list="dealFileList"
            :show-file-list="true"
            :before-upload="beforeUpload"
            :on-success="upload"
            :on-remove="handleRemove"
            accept=".doc,.docx,.pdf,.jpg"
          >
            <el-button size="mini" type="primary">上传附件</el-button>
            <span slot="tip" class="el-upload__tip">只能上传doc、pdf文件，且不超过500kb</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="完成日期" prop="finishTime">
          <el-date-picker
            v-model="dealForm.finishTime"
            type="date"
            placeholder="完成日期"
            value-format="yyyy-MM-dd"
            size="mini">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dealSave" :disabled="disabled">保 存</el-button>
          <el-button type="primary" @click="dealCommit" :disabled="disabled">提 交</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import dp from '@/api/work/wel/add_assignment';
import request from '@/api/work/special/taskprocess'

export default {
  data() {
    return {
      options: [],
      formInline: {
        time: "",
        dp: "",
        type: "",
        person: ""
      },
      tableData: {
        header: [
          {
            prop: 'name',
            value: '任务名称'
          },
          {
            prop: 'num',
            value: '任务编号'
          },
          {
            prop: 'time',
            value: '发布时间'
          },
          {
            prop: 'person',
            value: '发布人'
          },
          {
            prop: 'deadline',
            value: '截止日期'
          },
          {
            prop: 'stu',
            value: '状态'
          },
          {
            prop: 'dealer',
            value: '处理人'
          }
        ],
        tableData: [],
        total: 0
      },
      editDialog: false,
      form: {
        num: '',
        name: '',
        type: "",
        person: '',
        time: '',
        dp: '',
        dealer: '',
        deadline: '',
        content: '' ,
        attachment: '',
        stu: ''
      },
      dealForm: {
        dealContent: '',
        dealAttachment:'',
        finishTime: ''
      },
      rules: {
        name: { required: true, message: '请输入任务名称', trigger: 'blur' },
        time: { required: true, message: '请输入时间', trigger: 'blur' },
      },  
      attachment: [],
      fileList: [],
      dealAttachment: [],
      dealFileList: [],
      pageForm: {
        page: 1,
        pageSize: 10,
        stu: '已提交',
        personId: ''
      },
      disabled: false
    }
  },
  mounted() {
    this.getDp();
    this.getProcess({});
    this.getUser();
  },
  methods: {
    // 获取任务
    getProcess(model) {
      request.getProcess(JSON.stringify(model) == "{}" ? this.pageForm : model).then(res => {
        console.log(res)
        if(res.data.data === '无任务') {
          console.log(res.data.data)
          this.$commonUtils.setMessage("warning", "无任务");
        } else {
          this.tableData.tableData = res.data.data;
          this.tableData.total = res.data.count;
        }
      })
    },
    // 查询
    searchProcess(formInline) {
      request.searchProcess(this.formInline).then(res => {
        if(res.data.data === '无任务') {
          this.$commonUtils.setMessage("warning", "无符合条件结果");
        } else {
          this.tableData.tableData = res.data.data;
          this.$refs[formInline].resetFields()
        }
      })
    },
    //  编辑
    editProcess(data) {
      this.editDialog = true;
      this.form = data;
      // this.dealForm = data;
      this.dealForm.num = data.num;
      this.dealForm.dealContent = data.dealContent;
      this.dealForm.dealAttachment = data.dealAttachment;
      this.dealForm.finishTime = data.finishTime;
      if(data.stu === '已完成') {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      // 处理文件链接
      this.fileList = []; 
      this.dealFileList = []; 
      if(data.attachment.length !== 0) {
        let a = data.attachment.split(',');  
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
        this.attachment.push(data.attachment.split(','))
      }
      if(data.dealAttachment.length !== 0 && data.dealAttachment !== null) {
        let a = data.dealAttachment.split(',');  
        if(a.length > 0) {
          a.forEach(item => {
            var obj = {} 
            let index = item.replace(/\\/g,"/").lastIndexOf('\/');
            let fileName  = item.substring(index + 1, item.length); //最后的文件名截取出来
            this.$set(obj,'name', fileName);
            this.$set(obj,'url', item);  //修改fileList里面的结构（name,url）
            this.dealFileList.push(obj);
          })
        }
        this.dealAttachment.push(data.dealAttachment.split(','))
      }
    },
    // 编辑保存
    dealSave() {
      this.dealForm.dealAttachment = this.dealAttachment.join(',');
      this.dealForm.stu = '已提交';
      console.log(this.dealForm, '保存')
      request.dealSave(this.dealForm).then(res => {
        this.$commonUtils.setMessage("success", "保存成功");
        this.getProcess({});
      })
    },
    // 编辑发布
    dealCommit() {
      this.dealForm.stu = '已完成';
      this.dealForm.dealAttachment = this.dealAttachment.join(',');
      console.log(this.dealForm, '发布')
      request.dealSave(this.dealForm).then(res => {
        this.$commonUtils.setMessage("success", "发布成功");
        this.getProcess({});
        this.editDialog = false;
      })
    },
    // 文件类型判断
    beforeUpload(file) {
      var filetype = file.name.substring(file.name.lastIndexOf('.') + 1)
      const type = filetype === 'doc'
      const type1 = filetype === 'docx'
      const type2 = filetype === 'pdf'
      if(!type && !type1 && !type2) {
        this.$message({
          message: '只能上传doc，pdf文件!',
          type: 'warning'
        });
      }
      return type || type1 || type2
    },
    // 上传成功
    upload(res, file, fileList) {
      this.dealAttachment.push(res)
    },
    // 删除上传附件
    handleRemove(file, fileList) {
      if(file.status === 'success') {
        this.dealAttachment.splice(this.dealFileList.findIndex(item => item.url === file.url), 1)
      } else {
        this.dealFileList.splice(this.dealFileList.findIndex(item => item.url === file.url), 1)
      }
    },
    // 分页查询
    paginationChange(page,pageSize) {
      this.getProcess({ page: page, pageSize: pageSize });
    },
    // 获取部门
    getDp() {
      dp.department().then(res => {
        Object.values(res.data).map((data) => {
          data.map((res1) => {
            this.options = data;
            if(res1.children.length == 0){
              res1.children = undefined;
            } else {
              res1.children.map((res2) => {
                if(res2.children.length == 0){
                  res2.children = undefined;
                }
              })
            }
          })
        })
      });
    },
    // 获取当前登录用户信息
    getUser() {
      this.$commonUtils.getCookie('id').replace(/{/g,'').replace(/}/g,'').replace(/"/g,'').split(',').map((res) => {
        if(res.split(":")[0] == 'id'){
          this.pageForm.personId = res.split(":")[1]
        }
      })
    },
  }
}
</script>

<style>
#task-process .form .el-form-item,#task-process .dealForm .el-form-item{
  margin-bottom: 15px;
  width: 90%;
  margin-top: 15px;
}
#task-process .form{
  border-bottom: 1px rgba(0,0,0,0.2) dashed; 
}
</style>