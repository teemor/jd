<template>
<!-- 迎检任务-部门配合 -->
  <div id="dep-coop">
    <div>
      <general-table 
        :body="tableData" 
        :showPagination="false" 
        :total="tableData.total" 
        :showcheck="false"
      >
        <el-table-column label="迎检任务" prop="receiveState" width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row[scope.column.property]=='未接收'">
              <el-button type="text" size="small" @click="receive(scope.row)">
                接收
              </el-button>
            </span>
            <span v-else-if="scope.row[scope.column.property]=='已接收'"> 
              <el-button type="text" size="small" @click="prepare(scope.row)">
                准备
              </el-button>
            </span>
            <span v-else> 
              <el-button type="text" size="small" disabled>
               {{ scope.row[scope.column.property] }}
              </el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" size="small" @click="detailCooper(scope.row)">
              <template>详情</template>
            </el-button>
            <span v-if="scope.row.receiveState=='已准备'">
              <el-button type="text" icon="el-icon-edit" size="small" @click="editCooper(scope.row)">
                <template>编辑</template>
              </el-button>
            </span>
            <span v-else>
              <el-button type="text" icon="el-icon-edit" size="small" @click="editCooper(scope.row)" disabled="disabled">
                <template>编辑</template>
              </el-button>
            </span>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <!-- 修改任务 -->
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
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-download" size="small" @click="download(scope.row)">
                  <template>下载</template>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-table :data="assi_form.dpTable" class="dp-table">
          <el-table-column prop="receiveDp" label="接收部门" width="150px"></el-table-column>
          <el-table-column prop="receivePerson" label="接收人"></el-table-column>
          <el-table-column prop="list" label="工作清单"></el-table-column>
        </el-table>
      </el-form>
      <!-- ----------------------------- -->
      <el-form :model="coop_form" label-width="150px" class="coop-form">
        <el-form-item label="接收时间" prop="receiveTime" class="form-item">
          <el-date-picker
            v-model="coop_form.receiveTime"
            type="datetime"
            placeholder="接收时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="准备时间" prop="prepareTime" class="form-item">
          <el-date-picker
            v-model="coop_form.prepareTime"
            type="datetime"
            placeholder="准备时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="档案" prop="file" class="form-item">
          <el-cascader
            :options="fileOptions"
            :props="props"
            size="mini"
            ref="cascader"
            placeholder="请选择档案"
            filterable
            @change="importFile"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="历史记录" prop="history">
          <el-select size="mini" v-model="history" placeholder="请选择" filterable no-data-text='目前无历史记录'>
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.taskId"
              :value="item">
            </el-option>
          </el-select>
          <el-button size="mini" type="primary" @click="importNote">导入</el-button>
        </el-form-item>
        <el-form-item label="迎检资料" prop="weldata">
          <el-input type="textarea" v-model="coop_form.weldata" placeholder="在档案处选择迎检资料" size="mini" autosize></el-input>
        </el-form-item>
         <el-form-item label="迎检过程" prop="welprocess">
          <el-input type="textarea" v-model="coop_form.welprocess" placeholder="迎检过程" size="mini" autosize></el-input>
        </el-form-item>
        <el-form-item label="完成时间" prop="endTime" class="form-item">
          <el-date-picker
            v-model="coop_form.endTime"
            type="datetime"
            placeholder="完成时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="科室" prop="dp" class="form-item">
          <el-input size="mini" v-model="coop_form.dp" placeholder="科室"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="head" class="form-item">
          <el-input size="mini" v-model="coop_form.head" placeholder="负责人"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSaveCooper">保 存</el-button>
        <el-button type="primary" @click="commitCooper">保存并提交</el-button>
      </div>
    </el-dialog>
    <!-- 任务详情 -->
    <el-dialog :visible.sync="detailDialog">
      <el-form :model="assi_form" label-width="150px">
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
            <el-table-column label="操作" width="150px">
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialog=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/work/wel/depcoopertable';
import commonUtils from "@/assets/util/commonUtil";
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
            prop: "time",
            value: "发布时间"
          },
          {
            prop: "receiveState",
            value: "状态"
          },
          {
            prop: "person",
            value: "发布人"
          },
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
      coop_form: {
        receiveTime: '',//接收时间
        prepareTime: '',//准备时间
        weldata: '',//迎检资料
        welprocess: '',//迎检过程
        endTime: '',//完成时间
        dp: '',//科室
        head: '',//负责人
        taskId: '',
      },
      history: [],
      weldata:[],
      options: [],
      fileOptions: [],
      props :{ multiple: true, label: 'name',key: 'id' ,value: 'name',  checkStrictly: true},
      form: {
        personId: ''
      },
      stateModel: {
        receiveState: '',
        statePersonId: '',
        taskId: '',
        receiveDp: '',
        nowDate: ''
      },
      detailDialog: false,
    }
  },
  mounted() {
    this.getFile();
    this.getUser();
    this.getCooper({});
  },
  methods: {
    // 获取任务
    getCooper(model) {
      request.getCooper(this.form).then(res => {
        this.tableData.tableData = res.data.data;
      })
    },
    // 档案导入
    importFile() {
      this.file = [];
      this.$refs['cascader'].getCheckedNodes().map((res) => {
        this.file.push(res.label);
        this.coop_form.weldata = this.file.join(',');
      })
    },
    // 接收状态
    receive(data) {
      this.stateModel.receiveState = '已接收';
      this.stateModel.taskId = data.dpTable[0].taskId;
      this.stateModel.dp = data.dpTable[0].receiveDp;
      this.stateModel.nowDate = this.getNowDate();
      request.receiveState({ 
        personId: this.stateModel.statePersonId,
        state: this.stateModel.receiveState,
        taskId: this.stateModel.taskId,
        dp: this.stateModel.dp,
        nowDate: this.stateModel.nowDate
      }).then(res => { 
        sessionStorage.setItem("receiveTime",res.data.receiveTime);
        this.getCooper({});
      })
    },
    prepare(data) {
      this.stateModel.receiveState = '已准备';
      this.stateModel.taskId = data.dpTable[0].taskId;
      this.stateModel.dp = data.dpTable[0].receiveDp;
      this.stateModel.nowDate = this.getNowDate();
      request.receiveState({ 
        personId:this.stateModel.statePersonId,
        state: this.stateModel.receiveState,
        taskId: this.stateModel.taskId,
        dp: this.stateModel.dp,
        nowDate: this.stateModel.nowDate
      }).then(res => {
        sessionStorage.setItem("prepareTime",res.data.prepareTime);
        this.getCooper({});
      })
    },
    // 修改任务
    editCooper(data) {
      this.editDialog = true;
      console.log(data)
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
      this.coop_form.taskId = data.dpTable[0].taskId;
      this.coop_form.receiveTime = sessionStorage.getItem("receiveTime");
      this.coop_form.prepareTime = sessionStorage.getItem("prepareTime");
      this.getHistory(data);
      var newDate = new Date()
      let date = newDate.toLocaleString('chinese', { hour12: false }).replace(/\//g,"-"); 
      this.coop_form.endTime = date;
    },
    editSaveCooper() {
      console.log(this.coop_form)
      request.editSaveCooper(this.coop_form).then(res => {
        this.getCooper({});
      })
    },
    // 获取历史记录
    getHistory(data) {
      request.getHistory({ receiveDp: this.coop_form.dp, unit: data.unit}).then(res => {
        this.options = res.data.data;
      })
    },
    // 导入历史记录
    importNote() {
      this.coop_form.weldata = this.history.weldata;
      this.coop_form.welprocess = this.history.welprocess;
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
    //任务详情
    detailCooper(data) {
      this.detailDialog = true;
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
    },
    // 提交部门协同
    commitCooper() {
      request.commitCooper(this.coop_form).then(res => {
        this.editDialog = false;
        this.getCooper({});
        sessionStorage.clear();
      })
    },
    // 获取档案
    getFile() {
      request.file().then(res => {
        Object.values(res.data).map((items) => {
          items.map((item) => {
            this.fileOptions = items;
            if(item.children.length == 0) {
              item.children = undefined;
            } else {
              item.children.map((data) => {
                if(data.children.length == 0) {
                  data.children = undefined;
                }
              })
            }
          })
        })
      })
    },
    // 获取当前登录用户信息
    getUser() {
      this.$commonUtils.getCookie('id').replace(/{/g,'').replace(/}/g,'').replace(/"/g,'').split(',').map((res) => {
        if(res.split(":")[0] == 'fname'){
          this.coop_form.head = res.split(":")[1]
        } else if(res.split(":")[0] == 'dp') {
          this.coop_form.dp = res.split(":")[1]
        } else if(res.split(":")[0] == 'id') {
          this.form.personId = res.split(":")[1];
          this.stateModel.statePersonId = res.split(":")[1];
        } 
      })
    },
    // 获取当前时间
    getNowDate() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var hours = date.getHours();
      var min = date.getMinutes();
      var second = date.getSeconds();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
      }
      if (min >= 0 && min <= 9) {
        min = "0" + min;
      }
      if (second >= 0 && second <= 9) {
        second = "0" + second;
      }
      var currentdate = year + '-' + month + '-' + strDate + ' ' + hours + ':' + min + ':' + second;
      return currentdate;
    }
  }
}
</script>
<style>
#dep-coop{
  padding: 10px;
}
#dep-coop .el-button--mini{
  margin-bottom: 15px;
}
#dep-coop .el-form-item{
  margin-bottom: 15px;
  width: 90%;
}
#dep-coop .assi-form{
  padding-bottom: 20px;
  border-bottom: 1px rgba(0,0,0,0.2) dashed;
}
#dep-coop .coop-form{
  margin-top: 20px;
}
#dep-coop .el-textarea.is-disabled .el-textarea__inner{
  color: #606266;
}
#dep-coop .uplode-table th{
  background-color: #fff !important;
  padding: 0;
}
</style>