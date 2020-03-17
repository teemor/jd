<template>
  <!-- 专项任务-任务发布 -->
  <div id="task-release">
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
            :props="{ emitPath: false, checkStrictly: true, label: 'name', key: 'id', value: 'id' }"
            size="mini"
            ref="cascader"
            placeholder="请选择科室"
            v-model="formInline.dp"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="任务类别" prop='type'>
          <el-select v-model="formInline.type" placeholder="请选择任务类别" size="mini">
            <el-option label="迎检任务" value="迎检任务"></el-option>
            <el-option label="巡检任务" value="巡检任务"></el-option>
            <el-option label="专项任务" value="专项任务"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布人" prop='person'>
          <el-input size="mini" v-model="formInline.person" placeholder="发布人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchRelease">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button size="mini" type="primary" @click="addRelease">新增</el-button>
    <div>
      <general-table 
        :body="tableData" 
        :showPagination="true" 
        :total="tableData.total" 
        :showcheck="false"
        @paginationChange="paginationChange"
      >
        <el-table-column label="编辑" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editRelease(scope.row)">
              <template>编辑</template>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" size="small" @click="delRelease(scope.row)">
              <template>删除</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <!-- 新增专项任务 -->
    <el-dialog :visible.sync="addDialog" :title="title">
      <el-form :model="addForm" label-width="120px" ref="addForm" :rules="rules" class='addForm'>  
        <el-form-item label="任务类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择任务类型" size="mini">
            <el-option label="迎检任务" value="迎检任务"></el-option>
            <el-option label="巡检任务" value="巡检任务"></el-option>
            <el-option label="专项任务" value="专项任务"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="name">
          <el-input size="mini" v-model="addForm.name" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="person">
          <el-input size="mini" v-model="addForm.person" placeholder="发布人"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="time">
          <el-date-picker
            v-model="addForm.time"
            type="date"
            placeholder="发布时间"
            value-format="yyyy-MM-dd"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门" prop="dp">
          <el-cascader
            :options="options"
            :props="{ emitPath: false, checkStrictly: true, label: 'name', key: 'id', value: 'id' }"
            size="mini"
            ref="cascader"
            placeholder="请选择部门"
            v-model="addForm.dp"
            @change="getPerson"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="处理人" prop="dealer">
          <el-select v-model="dealer" size="mini" placeholder="请选择处理人">
            <el-option
              v-for="item in personOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id+','+item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            v-model="addForm.deadline"
            type="date"
            placeholder="截止时间"
            value-format="yyyy-MM-dd"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input size="mini" type="textarea" v-model="addForm.content" placeholder="任务内容"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload 
            action="http://yz.c.ic.ci/jdem/jdTesting/inspectiontask/import" 
            ref="upload"
            :file-list="fileList"
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
      </el-form> 
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSave" :disabled="disabled">保 存</el-button>
        <el-button type="primary" @click="addCommit" v-if='edit' :disabled="disabled">发 布</el-button>
      </div>
      <el-form :model="addDealForm" label-width="120px" ref="addDealForm" :rules="rules" v-if='edit' class='dealForm' disabled>
        <el-form-item label="处理信息" prop="dealContent">
          <el-input size="mini" type="textarea" v-model="addDealForm.dealContent" placeholder="处理信息"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload 
            action="http://yz.c.ic.ci/jdem/jdTesting/inspectiontask/import" 
            ref="upload"
            :file-list="dealFileList"
            :show-file-list="true"
            accept=".doc,.docx,.pdf,.jpg"
          >
            <el-button size="mini" type="primary">上传附件</el-button>
            <span slot="tip" class="el-upload__tip">只能上传doc、pdf文件，且不超过500kb</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="完成日期" prop="finishTime">
          <el-date-picker
            v-model="addDealForm.finishTime"
            type="date"
            placeholder="完成日期"
            value-format="yyyy-MM-dd"
            size="mini">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dp from '@/api/work/wel/add_assignment';
import request from '@/api/work/special/taskrelease'
const form = {
  name: '',//任务名称
  type: "",//任务类型
  person: '',//发布人
  time: '',//发布时间
  dp: '',//部门
  dealer: '',//处理人
  dealerId: '',
  deadline: '',//截止日期
  content: '' ,//任务内容
  attachment: '',//附件
  stu: '待提交',
}
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
      addDialog: false,
      title: '',
      addForm: Object.assign({}, form),
      edit: false,
      addDealForm: {
        dealContent: '',//处理信息
        dealAttachment:'',//处理附件
        finishTime: ''//完成日期
      },
      rules: {
        name: { required: true, message: '请输入任务名称', trigger: 'blur' },
        time: { required: true, message: '请输入时间', trigger: 'blur' },
        dp: { required: true, message: '请选择部门', trigger: 'blur' },
        dealer: { required: true, message: '请选择处理人', trigger: 'blur' },
        person: { required: true, message: '请输入发布人', trigger: 'blur' },
      },  
      attachment: [],
      fileList: [],
      dealAttachment: [],
      dealFileList: [],
      pageForm: {
        page: 1,
        pageSize: 10
      },
      disabled: false,
      personOptions: [],
      dealer: ''
    }
  },
  mounted() {
    this.getDp();
    this.getRelease({});
  },
  methods: {
    // 获取任务
    getRelease(model) {
      request.getRelease(JSON.stringify(model) == "{}" ? this.pageForm : model).then(res => {
        if(res.data.data === '无任务') {
          this.$commonUtils.setMessage("warning", "无任务");
        } else {
          this.tableData.tableData = res.data.data;
          this.tableData.total = res.data.count;
        }
      })
    },
    // 查询
    searchRelease() {
      request.searchRelease(this.formInline).then(res => {
        if(res.data.data === '无任务') {
          this.$commonUtils.setMessage("warning", "无符合条件结果");
        } else {
          this.tableData.tableData = res.data.data;
        }
        this.$refs['formInline'].resetFields()
      })
    },
    // 新增
    addRelease() {
      this.title = '新增专项任务';
      this.addDialog = true;
      this.edit = false;
      this.addForm = Object.assign({}, form);
      this.getUser();
      var date = new Date();
      let nowDate = date.getFullYear() + "-" + this.getDate(date.getMonth() + 1) + "-" + this.getDate(date.getDate());
      this.addForm.time = nowDate;
      this.dealer = '';
    },
    // 新增保存
    addSave() {
      let deal = this.dealer.split(',');
      this.addForm.dealerId = deal[0];
      this.addForm.dealer = deal[1];
      this.addForm.attachment = this.attachment.join(',');
      let dp = this.addForm.dp.toLocaleString();
      this.addForm.dp = dp;
      this.$refs.addForm.validate(pass => {
        if(pass) {
          if(this.edit == false) {
            request.addSave(this.addForm).then(res => {
              this.$commonUtils.setMessage("success", "保存成功");
              this.getRelease({});
              this.addDialog = false;
            })
          } else {
            this.addForm.stu = '待提交'
            request.editSave(this.addForm).then(res => {
              this.$commonUtils.setMessage("success", "保存成功");
              this.getRelease({});
            })
          }
        } else {
          this.$commonUtils.setMessage("error", "请填完整信息");
        }
      })
    },
    // 新增发布
    addCommit() {
      let dealCommit = this.dealer.split(',')
      this.addForm.dealerId = dealCommit[0];
      this.addForm.dealer = dealCommit[1];
      this.addForm.attachment = this.attachment.join(',');
      this.addForm.stu = '已提交'
      this.$refs.addForm.validate(pass => {
        if(pass) {
          request.editSave(this.addForm).then(res => {
            this.addDialog = false;
            this.$commonUtils.setMessage("success", "发布成功");
            this.getRelease({});
          })
        }else {
          this.$commonUtils.setMessage("error", "请填完整信息");
        }
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
    getPerson(data) {
      dp.person({ dpid : data }).then(res => {
        this.personOptions = res.data
        this.dealer = '';
      })
    },
    getDate(num) {
      return num > 9 ? (num + "") : ("0" + num); 
    },
    // 上传成功
    upload(res, file, fileList) {
      this.attachment.push(res)
    },
    // 删除上传附件
    handleRemove(file, fileList) {
      if(file.status === 'success') {
        this.attachment.splice(this.fileList.findIndex(item => item.url === file.url), 1)
      } else {
        this.fileList.splice(this.fileList.findIndex(item => item.url === file.url), 1)
      }
    },
    // 编辑
    editRelease(data) {
      this.title = '编辑专项任务'
      this.edit = true;
      this.addDialog = true;
      if(data.stu === '已提交') {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      this.addForm = Object.assign({}, data)
      this.addDealForm = Object.assign({}, data)
      dp.person({ dpid : data.dp }).then(res => {
        this.personOptions = res.data
      })
      this.dealer = '';
       this.dealer = data.dealerId+","+data.dealer
      // 处理文件链接
      this.fileList = []; 
      this.dealFileList = []; 
      if(data.attachment !== "" && data.attachment !== null) {
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
      if(data.dealAttachment !== "" && data.dealAttachment !== null) {
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
    // 删除
    delRelease(data) {
      this.$confirm("是否删除?","提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        request.delRelease({ num: data.num }).then(res => {
          this.getRelease({});
          this.$commonUtils.setMessage("success", "删除成功");
        })
      }) 
    },
    // 分页查询
    paginationChange(page,pageSize) {
      this.getRelease({ page: page, pageSize: pageSize });
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
        if(res.split(":")[0] == 'fname'){
          this.addForm.person = res.split(":")[1]
        }
      })
    },
  }
}
</script>

<style>
#task-release .addForm .el-form-item,#task-release .dealForm .el-form-item{
  margin-bottom: 15px;
  width: 90%;
  margin-top: 15px;
}
#task-release .addForm{
  border-bottom: 1px rgba(0,0,0,0.2) dashed; 
}
</style>