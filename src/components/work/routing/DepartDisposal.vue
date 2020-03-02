<template>
<!-- 部门处置 -->
  <div id="depdis">
    <div>
      <general-table 
        :body="tableData" 
        :showPagination="false" 
        :total="tableData.total" 
        :showcheck="false"
      >
        <el-table-column label="巡检结果" width="150px" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" size="small" @click="disDetail(scope.row)">
              <template>查看</template>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.rewards == "惩罚"'>
              <el-button type="text" icon="el-icon-edit" size="small" @click="editDis(scope.row)">
                <template>编辑</template>
              </el-button>
            </span>
            <span v-else>
              <el-button type="text" icon="el-icon-edit" size="small" disabled>
                <template>编辑</template>
              </el-button>
            </span>
          </template>
          
        </el-table-column>
      </general-table>
    </div>
    <!-- 编辑巡检工作&查看 -->
    <el-dialog :visible.sync="editDialog">
      <el-form :model="insForm" label-width="120px" class="insform">
        <el-form-item label="任务名称" prop="name">
          <el-input size="mini" v-model="insForm.name" placeholder="任务名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="insForm.time"
            type="datetime"
            placeholder="时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布人" prop="person">
          <el-input size="mini" v-model="insForm.person" placeholder="发布人" disabled></el-input>
        </el-form-item>
        <el-form-item label="巡检内容" prop="person">
          <el-input type="textarea" size="mini" v-model="insForm.insContent" placeholder="巡检内容" disabled></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attachment">
          <el-table :data="insForm.attachment" class="uplode-table">
            <el-table-column prop="name" label="文件名"></el-table-column>
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-download" size="small" @click="download(scope.row)">
                  <template>下载</template>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="检查部门">
          <el-input type="textarea" size="mini" v-model="dp" placeholder="检查部门" disabled></el-input>
        </el-form-item>
        <el-table :data="insForm.failTable" v-if="insForm.rewards == '惩罚'">
          <el-table-column prop="reformDp" label="整改部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="reformName" label="接收人" align="center"></el-table-column>
          <el-table-column prop="reformContent" label="不合格内容" align="center"></el-table-column>
          <el-table-column prop="figure" label="金额" align="center"></el-table-column>
          <el-table-column prop="reformTime" label="整改时效" align="center"></el-table-column>
        </el-table>
        <el-table :data="insForm.rewardTable" v-if="insForm.rewards == '奖励'">
          <el-table-column prop="rewardDp" label="奖励部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="rewardName" label="接收人" align="center"></el-table-column>
          <el-table-column prop="rewardFigure" label="金额" align="center"></el-table-column>
        </el-table>
      </el-form>
      <!-- -------------------------------------------- -->
      <el-form :model="disForm" label-width="150px" class="disform" ref="disForm" :rules="rules"  v-if="result == false">
        <el-form-item label="附件" prop="disAttachment"> 
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
            <span slot="tip" class="el-upload__tip">只能上传doc、pdf、jpg文件</span>
            <el-button size="mini" type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="整改说明" prop="disIntroduction">
          <el-input type="textarea" v-model="disForm.disIntroduction" placeholder="整改说明" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="disTime" class="form-item">
          <el-date-picker
            v-model="disForm.disTime"
            type="datetime"
            placeholder="时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="科室" prop="dp" class="form-item">
          <el-input size="mini" v-model="disForm.dp" placeholder="科室"></el-input>
        </el-form-item>
        <el-form-item label="经手人" prop="handler" class="form-item">
          <el-input size="mini" v-model="disForm.handler" placeholder="负责人"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSaveDis" v-if="result == false">保 存</el-button>
        <el-button type="primary" @click="commitDis" v-if="result == false">保存并提交</el-button>
        <el-button type="primary" @click="editDialog=false" v-if="result == true">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/work/route/depart_disposal'

export default {
  data() {
    return {
      tableData: {
        header: [
          {
            prop: 'name',
            value: '任务名称'
          },
          {
            prop: 'taskId',
            value: '任务编号'
          },
          {
            prop: 'time',
            value: '发布时间'
          },
          {
            prop: 'rewards',
            value: '奖惩'
          },
          {
            prop: 'stu',
            value: '状态'
          },
        ],
        tableData: [],
        total: 0
      },
      editDialog: false,
      insForm: {
        name: '',
        time: '',
        person: '',
        insContent: '',
        attachment: [],
        insDp: [],
        failTable: [],
        rewardTable: [],
        rewards: ''
      },
      attachment: [],
      fileList: [],
      editAttachment: [],
      dp: '',
      disForm: {
        disAttachment: '', //整改附件
        disIntroduction: '',//整改说明
        disTime: '',//时间
        dp: '',//科室
        handler: '',//经手人
        taskId: ''
      },
      form: {
        personId: ''
      },
      rules: {
        disIntroduction: { required: true, message: '请输入整改说明', trigger: 'blur' },
        disTime: { required: true, message: '请输入时间', trigger: 'blur' },
        dp: { required: true, message: '请输入科室', trigger: 'blur' },
        handler: { required: true, message: '请输入经手人', trigger: 'blur' },
      },
      result: true
    }
  },
  mounted() {
    this.getUser();
    this.getDis({});
  },
  methods: {
    // 获取部门处置
    getDis(model) {
      request.getDis({ personId : this.form.personId }).then(res => {
        if(res.data.data == '无任务') {
          this.$commonUtils.setMessage("info", "暂无任务");
        } else {
          let tabledata = [];
          if(res.data.jl !== undefined ) {
            res.data.jl.map((data) => {
              tabledata.push({
                ...data,
                rewards: '奖励'
              })
            })
          }
          if(res.data.zg !== undefined) {
            res.data.zg.map((data) => {
              tabledata.push({
                ...data,
                rewards: '惩罚'
              })
            })
          }
          this.tableData.tableData = tabledata;
        }
      })  
    },
    // 编辑部门处置
    editDis(data) {
      console.log(data)
      this.editDialog = true;
      this.result = false;
      this.fileList = [];
      this.attachment = [];
      this.insForm.name = data.name;
      this.insForm.time = data.time;
      this.insForm.person = data.person;
      this.insForm.insContent = data.insContent;
      this.insForm.failTable = data.failTable;
      this.insForm.rewardTable = data.rewardTable;
      this.insForm.rewards = data.rewards;
      this.insForm.attachment = [];
      if(data.attachment !== null && data.attachment !== "") {
        data.attachment.split(',').map((res) => {
          const index = res.replace(/\\/g,"/").lastIndexOf('\/');
          this.insForm.attachment.push({
            name: res.substring(index+1, res.length),
            url: res
          }) 
        })
      }
      let insdp = [];
      data.insDp.map((res) => {
        insdp.push(res.dp);
      })
      this.dp = insdp.join(",");
      if(data.failTable[0].disTime === null) {
        this.disForm.disTime = new Date()
      } else {
        this.disForm.disTime = data.failTable[0].disTime;
      }
      this.disForm.disIntroduction = data.failTable[0].disIntroduction;
      this.disForm.taskId = data.taskId;
      // 处理文件链接
      if(data.failTable[0].disAttachment !== null && data.failTable[0].disAttachment !== "") {
        let a = (data.failTable[0].disAttachment).split(',');  
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
        this.attachment.push((data.failTable[0].disAttachment).split(','))
      }
    },
    editSaveDis() {
      this.disForm.disAttachment = this.attachment.join(',');
      request.editSaveDis(this.disForm).then(res => {
        this.getDis();
        this.$commonUtils.setMessage("success", "保存成功");
      })
    },
    // 提交
    commitDis() {
      this.disForm.disAttachment = this.attachment.join(',');
      this.$refs.disForm.validate(pass => {
        if(pass) {
          request.commitDis(this.disForm).then(res => {
            this.getDis();
            this.$commonUtils.setMessage("success", "提交成功");
            this.editDialog = false;
          })
        } else {
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
      const type3 = filetype === 'jpg'
      if(!type && !type1 && !type2 && !type3) {
          this.$message({
              message: '只能上传doc，pdf，jpg文件!',
              type: 'warning'
          });
      }
      return type || type1 || type2 || type3
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
    // 下载
    download(data) {
      let url = '';
      if (data.url.indexOf('webapps') !== -1) {
        let index = data.url.lastIndexOf('webapps')
        url = data.url.substr(index+8, data.url.length)
      }
      window.location.href = "http://yz.c.ic.ci/" + url;
    },
    // 查看奖惩结果
    disDetail(data) {
      this.editDialog = true;
      this.result = true;
      this.insForm.name = data.name;
      this.insForm.time = data.time;
      this.insForm.person = data.person,
      this.insForm.insContent = data.insContent;
      this.insForm.failTable = data.failTable,
      this.insForm.rewardTable = data.rewardTable;
      this.insForm.rewards = data.rewards;
      this.insForm.attachment = [];
      data.attachment.split(',').map((res) => {
        const index = res.replace(/\\/g,"/").lastIndexOf('\/');
        this.insForm.attachment.push({
          name: res.substring(index+1, res.length),
          url: res
        }) 
      })
      let insdp = [];
      data.insDp.map((res) => {
        insdp.push(res.dp);
      })
      this.dp = insdp.join(",");
    },
    // 获取当前登录用户信息
    getUser() {
      this.$commonUtils.getCookie('id').replace(/{/g,'').replace(/}/g,'').replace(/"/g,'').split(',').map((res) => {
        if(res.split(":")[0] == 'fname'){
          this.disForm.handler = res.split(":")[1]
        } else if(res.split(":")[0] == 'dp') {
          this.disForm.dp = res.split(":")[1]
        } else if(res.split(":")[0] == 'id') {
          this.form.personId = res.split(":")[1]
        }
      })
    },
  }
}
</script>

<style>
#depdis .insform{
  padding-bottom: 20px; 
  border-bottom: 1px rgba(0,0,0,0.2) dashed;
}
#depdis .disform{
  padding-top: 20px; 
}
#depdis .disform .el-upload__tip{
  padding-left: 20px;
}
#depdis .uplode-table th{
  background-color: #fff !important;
  padding: 0;
}
</style>