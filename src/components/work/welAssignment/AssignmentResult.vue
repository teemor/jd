<template>
<!-- 检查结果 -->
  <div id="assi-result">
    <!-- 检查结果表格 -->
    <div>
      <general-table 
        :body="tableData" 
        :showPagination="false" 
        :total="tableData.total" 
        :showcheck="false"
      >
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editResult(scope.row)">
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
      <!-- ---------------------------------------------- -->
      <div class="coop-form">
        <el-table :data="coopData">
          <el-table-column prop="receiveDp" label="迎检部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="weldata" label="迎检资料" align="center"></el-table-column>
          <el-table-column prop="welprocess" label="迎检内容" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- ---------------------------------------------- -->
      <el-form :model="result_form" label-width="150px" class="result-form" ref="resultForm" :rules="rules">
        <el-form-item label="总结" prop="summary">
          <el-input type="textarea" v-model="result_form.summary" placeholder="请输入总结" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="结果" prop="result">
          <el-select v-model="result_form.result" placeholder="请选择结果" size="mini">
            <el-option label="合格" value="合格"></el-option>
            <el-option label="不合格" value="不合格"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="result_form.result=='不合格'">
          <el-form-item label="不合格部门" prop="result" class="form-item">
            <el-select v-model="failDp" size="mini" multiple placeholder="请选择不合格部门" @visible-change="importDp">
              <el-option
                v-for="item in failoptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-table :data="reformData" class="reform-table">
            <el-table-column prop="reformDp" label="整改部门" align="center" width="120px"></el-table-column>
            <el-table-column prop="reformPerson" label="接收人" align="left" width="200px">
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.receive">
                  <!-- <el-checkbox v-for="item in scope.row.person" :label="item" :key="item.id">{{ item.name }}</el-checkbox> -->
                  <el-checkbox v-for="item in scope.row.person" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column prop="reformContent" label="整改内容" align="center">
              <template slot-scope="scope">
                <el-input type="textarea" v-model="scope.row.reformContent" placeholder="请输入整改内容" autosize align="center"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="effective" label="整改时效" align="center">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.effective"
                  type="datetime"
                  placeholder="整改时效"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  size="mini">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="删除" align="center" width="100px">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="总结时间" prop="summaryTime" class="form-item">
          <el-date-picker
            v-model="result_form.summaryTime"
            type="datetime"
            placeholder="总结时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="经手人" prop="handler" class="form-item">
          <el-input size="mini" v-model="result_form.handler" placeholder="经手人"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSaveResult">保 存</el-button>
        <el-button type="primary" @click="commitResult">保存并发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/work/wel/assignmentresult';
import dp from '@/api/work/wel/add_assignment';


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
            value: "开始时间"
          },
          {
            prop: "result",
            value: "结果"
          },
          {
            prop: "handler",
            value: "经手人"
          },
          {
            prop: "endTime",
            value: "结束时间"
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
      reformData: [],
      options: [],
      props: { multiple: true, label: 'name', key: 'id', checkStrictly: true },
      rules: {
        summary: { required: true, message: '请输入总结', trigger: 'blur' },
        result: { required: true, message: '请选择结果', trigger: 'blur' },
        summaryTime: { required: true, message: '请输入总结时间', trigger: 'blur' }
      },
      failDp: [],
      failoptions: []
    }
  },
  mounted() {
    this.getDp();
    this.getUser();
    this.getResult({});
  },
  methods: {
    // 检查结果
    getResult(model) {
      request.getResult(JSON.stringify(model) == "{}" ? this.form : model)
      .then(res => {
        this.tableData.tableData = res.data.data;
      })
    },
    // 添加不合格部门
    importDp(change) {
      if(change == false) {
        this.failDp.map((res) => {
          dp.person({ dpid: res.value }).then(data => {
            this.reformData.push({
              reformDp: res.label,
              reformContent: '',
              effective: '',
              receive: [],
              person: data.data
            })
          })
        })
      }
    },
    // 修改
    editResult(data) {
      console.log(data,'d')
      this.editDialog = true;
      this.assi_form.attachment = [];
      this.assi_form.id = data.id;
      this.assi_form.name = data.name;
      this.assi_form.unit = data.unit;
      this.assi_form.time = data.time;
      this.assi_form.person = data.person;
      this.assi_form.personId = data.personId;
      this.assi_form.instruction = data.instruction;
      this.assi_form.dpTable = data.dpTable;
      this.coopData = data.dpTable; 
      data.attachment.split(',').map((res) => {
        const index = res.replace(/\\/g,"/").lastIndexOf('\/');
        this.assi_form.attachment.push({
          name: res.substring(index+1, res.length),
          url: res
        }) 
      })
      this.result_form.taskId = data.id;
      data.dpTable.map((res) => { 
        this.failoptions.push({
          value: res.dpId,
          label: res.receiveDp
        })
      })
      var newDate = new Date()
      let date = newDate.toLocaleString('chinese', { hour12: false }).replace(/\//g,"-"); 
      this.result_form.summaryTime = date
    },
    editSaveResult() {
      this.setTable();
      this.$refs.resultForm.validate(pass => {
        if(pass) {
          request.editSaveResult(this.result_form)
          .then(res => {
            this.getResult({});
            this.$commonUtils.setMessage("success", "保存成功");
          })
        } else {
          this.$commonUtils.setMessage("error", "请填完整信息");
        }
      })
    },
    // reformData数据放入reformTable
    setTable() {
      this.reformData.map((res) => {
        // let reformPerson = [];
        // let reformName = [];
        // res.receive.map((data) => {
        //   reformPerson.push(data.id);
        //   reformName.push(data.name)
        // })
        this.result_form.reformTable.push({
          reformDp: res.reformDp,
          reformContent: res.reformContent,
          effective: res.effective,
          reformPerson: res.receive.join(','),
          // reformPerson: reformPerson.join(','),
          // reformName: reformName.join(',')
        })
      })
    },
    // 发布结果
    commitResult() {
      this.setTable();
      request.commitResult( this.result_form ).then(res => {
        this.editDialog = false;
        this.getResult({});
        this.$commonUtils.setMessage("success", "发布成功");
      })
    },
    // 删除行
    deleteRow(index) {
      this.reformData.splice(index,1)
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
    // 获取部门
    getDp() {
      dp.department().then(res => {
        Object.values(res.data).map((data) => {
          data.map((res1) => {
            this.options = data
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
          this.result_form.handler = res.split(":")[1]
        }
      })
    },
  }

}
</script>
<style>
#assi-result {
  padding: 10px;
}
#assi-result .el-form-item{
  margin-bottom: 15px;
  width: 90%;
}
#assi-result .assi-form,#assi-result .coop-form{
  padding-bottom: 20px; 
  border-bottom: 1px rgba(0,0,0,0.2) dashed;
}
#assi-result .coop-form{
  padding-top: 20px;
}
#assi-result .result-form{
  padding-top: 20px;
}
.reform-table{
  margin-bottom: 15px;
}
#assi-result .uplode-table th{
  background-color: #fff !important;
  padding: 0;
}
</style>