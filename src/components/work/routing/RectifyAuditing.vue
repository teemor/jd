<template>
<!-- 整改审核 -->
  <div id="auditing">
    <div>
      <general-table 
        :body="tableData" 
        :showPagination="false" 
        :total="tableData.total" 
        :showcheck="false"
      >
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editAudit(scope.row)">
              <template>编辑</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <!-- 编辑审核 -->
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
        <el-table :data="insForm.failTable">
          <el-table-column prop="reformDp" label="整改部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="reformName" label="接收人" align="center"></el-table-column>
          <el-table-column prop="reformContent" label="不合格内容" align="center"></el-table-column>
          <el-table-column prop="figure" label="金额" align="center"></el-table-column>
          <el-table-column prop="reformTime" label="整改时效" align="center"></el-table-column>
        </el-table>
        <el-table :data="insForm.rewardTable">
          <el-table-column prop="rewardDp" label="奖励部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="rewardName" label="接收人" align="center"></el-table-column>
          <el-table-column prop="rewardFigure" label="金额" align="center"></el-table-column>
        </el-table>
      </el-form>
      <!-- -------------------------------------------- -->
      <el-table :data="auditData" class="audittable">
        <el-table-column prop="reformDp" label="整改部门" width="150px"></el-table-column>
        <el-table-column prop="disIntroduction" label="整改说明"></el-table-column>
        <el-table-column prop="disAttachment" label="整改附件">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.disAttachment" :key="index">
              <span>{{ item.name }}</span>
              <el-button type="text" icon="el-icon-download" size="small" @click="download(item)">下载</el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="auditResult" label="审核结果" width="150px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.auditResult" placeholder="请选择结果" size="mini">
              <el-option label="合格" value="合格"></el-option>
              <el-option label="不合格" value="不合格"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSaveAudit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/work/route/rectify_auditing'

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
        rewardTable: []
      },
      attachment: [],
      fileList: [],
      dp: '',
      auditData: [],
      form: {
        taskId: ''
      }
    }
  },
  mounted() {
    this.getAudit();
  },
  methods: {
    // 查询巡检工作
    getAudit(model) {
      request.getAudit(JSON.stringify(model) == "{}" ? this.form : model)
      .then(res => {
        this.tableData.tableData = res.data.data;
      })
    },
    // 编辑审核
    editAudit(data) {
      this.editDialog = true;
      this.insForm.name = data.name;
      this.insForm.time = data.time;
      this.insForm.person = data.person,
      this.insForm.insContent = data.insContent;
      this.insForm.failTable = data.failTable,
      this.insForm.rewardTable = data.rewardTable;
      this.insForm.attachment = [];
      if(data.attachment !== "" && data.attachment !== null) {
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
        insdp.push(res.label);
      })
      this.dp = insdp.join(",");
      this.auditData = data.failTable;
      let Attachment = [];
      //处理文件链接
      this.auditData.map((res) => {
        if(res.disAttachment !== null && res.disAttachment !== ""){
          let a = res.disAttachment.split(',');  
          let b = [];
          if(a.length > 0) {
            a.forEach(item => {
              var obj = {} 
                let index = item.replace(/\\/g,"/").lastIndexOf('\/');
                let fileName  = item.substring(index + 1, item.length); //最后的文件名截取出来
                this.$set(obj,'name',fileName);
                this.$set(obj,'url',item);  //修改files里面的结构（name,url）
                b.push(obj);
            })
          }
          res.disAttachment = b;
        }
      })
      this.form.taskId = data.taskId;
    },
    editSaveAudit() {
      let pass = [];
      let fail =[];
      this.auditData.map((data) => {
        if(data.auditResult == '合格') {
          pass.push(data.dpId)
          this.form.success = pass.join(','); 
        } else {
          fail.push(data.dpId)
          this.form.false = fail.join(','); 
        }
      })
      request.editSaveAudit(this.form).then(res => {
        this.getAudit();
        this.editDialog = false;
        this.$commonUtils.setMessage("success", "审核保存成功");
      })
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
  }
}
</script>

<style>
#auditing .insform{
  padding-bottom: 20px; 
  border-bottom: 1px rgba(0,0,0,0.2) dashed;
}
#auditing .uplode-table th{
  background-color: #fff !important;
  padding: 0;
}
#auditing .audittable{
  padding-top: 20px;
}
</style>