<template>
<!-- 整改接收 -->
  <div id="assi-content">
    <div>
      <general-table 
        :body="tableData" 
        :showPagination="true" 
        :total="tableData.total" 
        :showcheck="false"
        @paginationChange="paginationChange"
      >
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editContent(scope.row)">
              <template>编辑</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <!-- 修改检查结果 -->
    <el-dialog :visible.sync="editDialog">
      <el-form :model="assi_form" label-width="150px" class="assi-form">
        <el-form-item label="任务编号" prop="id" class="form-item">
          <el-input size="mini" v-model="assi_form.id" placeholder="任务编号" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务名称" prop="name" class="form-item">
          <el-input size="mini" v-model="assi_form.name" placeholder="任务名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="检查单位" prop="unit" class="form-item">
          <el-input size="mini" v-model="assi_form.unit" placeholder="检查单位" disabled></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="person" class="form-item">
          <el-input size="mini" v-model="assi_form.person" placeholder="发布人" disabled></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="assi_form.time"
            type="datetime"
            placeholder="时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务说明" prop="instruction">
          <el-input type="textarea" v-model="assi_form.instruction" placeholder="请输入任务说明" disabled></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attachment">
          <el-table :data="assi_form.attachment" class="uplode-table">
            <el-table-column prop="name" label="文件名"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-download" size="small" @click="download(scope.row)">
                  <template>下载</template>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-table :data="assi_form.dpTable" class="dp-table">
          <el-table-column prop="receiveDp" label="接收部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="receivePerson" label="接收人" align="center"></el-table-column>
          <el-table-column prop="list" label="工作清单" align="center"></el-table-column>
        </el-table>
      </el-form>
      <!-- ---------------------------------------------- -->
      <div class="coop-form">
        <el-table :data="coopData">
          <el-table-column prop="receiveDp" label="迎检部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="weldata" label="迎检资料" align="center"></el-table-column>
          <el-table-column prop="welprocess" label="迎检内容" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- ---------------------------------------------- -->
      <el-form :model="result_form" label-width="150px" disabled class="result-form">
        <el-form-item label="总结" prop="summary">
          <el-input type="textarea" v-model="result_form.summary" placeholder="请输入总结" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="结果" prop="result" class="form-item">
          <el-input v-model="result_form.result" size="mini"></el-input>
        </el-form-item>
        <el-table :data="result_form.reformTable" class="reform-table">
          <el-table-column prop="reformDp" label="整改部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="reformContent" label="整改内容" align="center"></el-table-column>
          <el-table-column prop="effective" label="整改时效" align="center"></el-table-column>
        </el-table>
        <el-form-item label="总结时间" prop="summaryTime" class="form-item">
          <el-input v-model="result_form.summaryTime" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="经手人" prop="handler" class="form-item">
          <el-input v-model="result_form.handler" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <!-- ----------------------------------------------- -->
      <el-form :model="content_form" label-width="150px" class="content-form">
        <el-form-item label="附件" prop="reformAttachment"> 
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
        <el-form-item label="整改说明" prop="reformIntroduction">
          <el-input type="textarea" v-model="content_form.reformIntroduction" placeholder="整改说明" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="整改时间" prop="reformTime" class="form-item">
          <el-date-picker
            v-model="content_form.reformTime"
            type="datetime"
            placeholder="整改时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="科室" prop="dp" class="form-item">
          <el-input size="mini" v-model="content_form.dp" placeholder="科室"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="head" class="form-item">
          <el-input size="mini" v-model="content_form.head" placeholder="负责人"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSaveContent">保 存</el-button>
        <el-button type="primary" @click="commitContent">保存并提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/work/wel/assignment_content'

export default {
  data() {
    return {
      tableData: {
        header: [
          {
            prop: "name",
            value: "任务名称"
          },
          {
            prop: "id",
            value: "任务编号"
          },
          {
            prop: "reformTime",
            value: "整改时间"
          },
          {
            prop: "stu",
            value: "状态"
          },
          {
            prop: "handler",
            value: "经手人"
          },
          {
            prop: "effective",
            value: "整改效期"
          }
        ],
        tableData: [],
        total: 0
      },
      editDialog: false,
      assi_form: {
        id: '',
        name: '',
        unit: '',
        time: '',
        person: '',
        personId: '',
        instruction: '',
        attachment: [],
        dpTable: [],
      },
      coopData: [],
      result_form: {
        summary: '',
        result: '',
        reformTable: [],
        summaryTime: '',
        handler: ''
      },
      content_form: {
        reformAttachment: '',
        reformIntroduction: '',
        reformTime: '',
        dp: '',
        head: ''
      },
      fileList: [],
      attachment: [],
      form: {
        page: 1,
        pageSize: 10,
        personId: ''
      }
    }
  },
  mounted() {
    this.getUser();
    this.getContent({});
  },
  methods: {
    // 获取整改内容
    getContent(model) {
      request.getContent(JSON.stringify(model) == "{}" ? this.form : model)
      .then(res => {
        if(res.data.data == 'false') {
          console.log(res.data.data)
        } else {
          this.tableData.tableData = res.data.data;
          this.tableData.total = res.data.total;
        }
      })
    },
    // 修改
    editContent(data) {
      this.editDialog = true;
      console.log(data,'data')
      this.assi_form.attachment = [];
      this.assi_form.id = data.id;
      this.assi_form.name = data.name;
      this.assi_form.unit = data.unit;
      this.assi_form.time = data.time;
      this.assi_form.person = data.person;
      this.assi_form.personId = data.personId;
      this.assi_form.instruction = data.instruction;
      this.assi_form.dpTable = data.dpTable;
      if(data.attachment !== ''){
        data.attachment.split(',').map((res) => {
          const index = res.replace(/\\/g,"/").lastIndexOf('\/');
          this.assi_form.attachment.push({
            name: res.substring(index+1, res.length),
            url: res
          }) 
        })
      }
      this.coopData = data.dpTable; 
      this.result_form = data;
      this.content_form.taskId = data.id;
      var newDate = new Date()
      let date = newDate.toLocaleString('chinese', { hour12: false }).replace(/\//g,"-"); 
      this.content_form.reformTime = date
    },
    editSaveContent() {
      this.content_form.reformAttachment = this.attachment.join(',');
      request.editSaveContent(this.content_form)
      .then(res => {
        this.getContent({});
      })
    },
    // 提交整改内容
    commitContent() {
      this.content_form.reformAttachment = this.attachment.join(',');
      request.commitResult(this.content_form)
      .then(res => {
        this.editDialog = false;
        this.getContent({});
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
    // 下载附件
    download(data) {
      let url = '';
      if (data.url.indexOf('webapps') !== -1) {
        let index = data.url.lastIndexOf('webapps')
        url = data.url.substr(index+8, data.url.length)
      }
      window.location.href = "http://yz.c.ic.ci/" + url;
    },
    // 获取当前登录用户信息
    getUser() {
      this.$commonUtils.getCookie('id').replace(/{/g,'').replace(/}/g,'').replace(/"/g,'').split(',').map((res) => {
        if(res.split(":")[0] == 'fname'){
          this.content_form.head = res.split(":")[1]
        } else if(res.split(":")[0] == 'dp') {
          this.content_form.dp = res.split(":")[1]
        } else if(res.split(":")[0] == 'id') {
          this.form.personId = res.split(":")[1]
        }
      })
    },
    // 分页查询
    paginationChange(page,pageSize) {
      this.getResult({ page: page, pageSize: pageSize });
    },
  }
}
</script>
<style>
#assi-content {
  padding: 10px;
}
#assi-content .assi-form,#assi-content .coop-form,#assi-content .result-form{
  padding-bottom: 20px; 
  border-bottom: 1px rgba(0,0,0,0.2) dashed;
}
#assi-content .coop-form,#assi-content .result-form,#assi-content .content-form{
  padding-top: 20px; 
}
#assi-content .el-form-item{
  margin-bottom: 15px;
  width: 90%;
}
#assi-content  .uplode-table th{
  background-color: #fff !important;
  padding: 0;
}
#assi-content  .el-upload__tip{
  padding-left: 20px;
}
</style>