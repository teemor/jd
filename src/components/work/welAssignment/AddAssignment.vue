<template>
<!-- 迎检任务-发布信息 -->
  <div id="add-assi">
    <!-- 任务表格 -->
    <div class="assi-table">
      <el-button size="mini" type="primary" @click="addAss">新增</el-button>
      <general-table 
        :body="tableData" 
        :showPagination="true" 
        :total="tableData.total" 
        :showcheck="false"
        @paginationChange="paginationChange"
      >
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" size="small" @click="addDetail(scope.row)">
              <template>浏览</template>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="接收状态" width="150" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              width="400"
              trigger="click">
              <el-table :data="scope.row.dpTable" :cell-style="sellStyle">
                <el-table-column width="150" prop="receiveDp" label="接收部门"></el-table-column>
                <el-table-column width="250" prop="receiveState" label="接收状态"></el-table-column>
              </el-table>
              <el-button type="text" size="small" slot="reference">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <!-- 新增任务 -->
    <el-dialog title="新增任务" :visible.sync="addDialog">
      <el-form :model="add_assi_form" label-width="150px" ref="addForm" :rules="rules">
        <el-form-item label="任务名称" prop="name" class="form-item">
          <el-input size="mini" v-model="add_assi_form.name" placeholder="任务名称" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="检查单位" prop="unit" class="form-item">
          <el-input size="mini" v-model="add_assi_form.unit" placeholder="检查单位" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time" class="form-item">
          <el-date-picker
            v-model="add_assi_form.time"
            type="datetime"
            placeholder="时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布人" prop="person" class="form-item">
          <el-input size="mini" v-model="add_assi_form.person" autocomplete="off" placeholder="发布人" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="任务说明" prop="instruction">
          <el-input type="textarea" v-model="add_assi_form.instruction" placeholder="请输入任务说明" autosize></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attachment"> 
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
            <span slot="tip" class="el-upload__tip">只能上传doc、pdf、jpg文件</span>
          </el-upload>
        </el-form-item>
        <el-cascader
          :options="options"
          :props="props"
          size="mini"
          ref="cascader"
          :emitPath="true"
        ></el-cascader>
        <el-button size="mini" type="primary" @click="addReceiveDp" style="margin-bottom:15px">增加部门</el-button>
        <el-table :data="table" class="dp-table" prop="dpTable">
          <el-table-column prop="receiveDp" label="接收部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="receivePerson" label="接收人" align="center">
            <template slot-scope="scope">
              <el-checkbox-group v-model="scope.row.receive">
                <!-- <el-checkbox v-for="item in scope.row.person" :label="item" :key="item.id">{{ item.name }}</el-checkbox> -->
                <el-checkbox v-for="item in scope.row.person" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column prop="list" label="工作清单" align="center">
            <template slot-scope="scope">
              <el-input type="textarea" v-model="scope.row.list" placeholder="请输入工作清单" autosize></el-input>
            </template>
          </el-table-column>
          <el-table-column label="删除" align="center" width="100px">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSaveAss">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 浏览 -->
    <el-dialog title="信息详情" :visible.sync="detailDialog">
      <el-form :model="assi_form" label-width="150px">
        <el-form-item label="任务编号" prop="id">
          <el-input size="mini" v-model="assi_form.id" placeholder="任务编号"></el-input>
        </el-form-item>
        <el-form-item label="任务名称" prop="name">
          <el-input size="mini" v-model="assi_form.name" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-form-item label="检查单位" prop="unit">
          <el-input size="mini" v-model="assi_form.unit" placeholder="检查单位"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-input size="mini" v-model="assi_form.time" placeholder="时间"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="person">
          <el-input size="mini" v-model="assi_form.person" placeholder="发布人"></el-input>
        </el-form-item>
        <el-form-item label="任务说明" prop="instruction">
          <el-input type="textarea" v-model="assi_form.instruction" placeholder="请输入任务说明"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attachment">
          <el-table :data="assi_form.attachment" class="uplode-table">
            <el-table-column prop="name" label="文件名"></el-table-column>
          </el-table>
        </el-form-item>
        <el-table :data="assi_form.dpTable" class="dp-table">
          <el-table-column prop="receiveDp" label="接收部门" align="center" width="150px"></el-table-column>
          <el-table-column prop="receivePerson" label="接收人" align="center"></el-table-column>
          <el-table-column prop="list" label="工作清单" align="center"></el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialog= false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/work/wel/add_assignment';
import commonUtils from "@/assets/util/commonUtil";
export default {
  data() {
    return{
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
            prop: "unit",
            value: "检查单位"
          },
          {
            prop: "time",
            value: "发布时间"
          },
          {
            prop: "person",
            value: "发布人"
          }
        ],
        tableData: [],
        total: 0
      },
      addDialog: false,
      add_assi_form: {
        name: '',//任务名称
        unit: '',//检查单位
        time: '',//发布时间
        person: '',//发布人
        instruction: '',//任务说明
        attachment: '',//附件
        dpTable: []
      },
      fileList: [],
      attachment: [],
      rules: {
        name: { required: true, message: '请输入任务名称', trigger: 'blur' },
        unit: { required: true, message: '请输入检查单位', trigger: 'blur' },
        time: { required: true, message: '请输入时间', trigger: 'blur' },
        person: { required: true, message: '请输入发布人', trigger: 'blur' },
        instruction: { required: true, message: '请输入任务说明', trigger: 'blur' },
      },
      props: { multiple: true, label: 'name', key: 'id', checkStrictly: true },
      options: [],//部门
      dpid:[],//获取接收人
      table: [],
      detailDialog: false,
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
      form: {
        page: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getDp();
    this.getAss({});
  },
  methods: {
    // 获取信息
    getAss(model) {
       request.getAss(JSON.stringify(model) == "{}" ? this.form : model)
      .then(res => {
        this.tableData.tableData = res.data.data;
        this.tableData.total = res.data.count;
      })
    },
    // 新增迎检任务
    addAss() {
      this.getUser();
      this.addDialog = true;
      var newDate = new Date()
      let date = newDate.toLocaleString('chinese', { hour12: false }).replace(/\//g,"-"); 
      this.add_assi_form.time = date
    },
    addSaveAss() {
      this.table.map((res) => {
        // 新增一个receiveName展示接收人名称
        // let receivePerson = [];
        // let receiveName = [];
        // res.receive.map((data) => {
        //   receivePerson.push(data.id);
        //   receiveName.push(data.name)
        // })
        this.add_assi_form.dpTable.push({
          receiveDp: res.receiveDp,
          receiveState: "未接收",
          receivePerson: res.receive.join(','),
          // receivePerson: receivePerson.join(','),
          // receiveName: receiveName.join(','),
          list: res.list,
          dpId: res.dpId.toString()
        }); 
      })
      this.add_assi_form.attachment = this.attachment.join(',');
      if(this.add_assi_form.dpTable.length == 0) {
        this.$commonUtils.setMessage("error", "请添加接收部门");
      } else {
        this.$refs.addForm.validate(pass => {
          if(pass) {
            console.log(this.add_assi_form);
            request.addSaveAss(this.add_assi_form).then(res => {
              this.addDialog = false;
              this.getAss({});
              this.$refs['addForm'].resetFields();
              this.$refs.upload.clearFiles();
              this.add_assi_form.dpTable = [];
            })
          } else {
            this.$commonUtils.setMessage("error", "请填完整信息");
          }
        })
      }
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
    // 详情
    addDetail(data) {
      console.log(data)
      this.assi_form.attachment = [];
      this.detailDialog = true;
      this.assi_form.id = data.id;
      this.assi_form.name = data.name;
      this.assi_form.unit = data.unit;
      this.assi_form.time = data.time;
      this.assi_form.person = data.person;
      this.assi_form.personId = data.personId;
      this.assi_form.instruction = data.instruction;
      this.assi_form.dpTable = data.dpTable;
      if(data.attachment !== '') {
        data.attachment.split(',').map((res) => {
          const index = res.replace(/\\/g,"/").lastIndexOf('\/');
          this.assi_form.attachment.push({
            name: res.substring(index+1, res.length),
            url: res
          }) 
        })
      }
    },
    // 增加接收部门
    addReceiveDp() {
      this.$refs['cascader'].getCheckedNodes().map((res) => {
        res.checked = false;
        request.person({ dpid : res.data.id }).then(data => {
          this.table.push({
            receiveDp: res.label,
            receive: [],
            person: data.data,
            list: '',
            dpId: res.data.id
          })
        })
      });
    },
    // 接收部门行删除
    deleteRow(index) {
      this.table.splice(index,1)
    },
    // 分页查询
    paginationChange(page,pageSize) {
      this.getAss({ page: page, pageSize: pageSize });
    },
    // 获取部门
    getDp() {
      request.department().then(res => {
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
          this.add_assi_form.person = res.split(":")[1]
        } else if(res.split(":")[0] == 'id') {
         this.add_assi_form.personId = res.split(":")[1]
        }
      })
    },
    //状态显示
    sellStyle({row,column,rowIndex,colIndex}){
      if(column.property === 'receiveState'){
        switch(row.receiveState) {
          case '未接收':
            return {
              background: '#f00',
              color: '#000'
            }
          break
          case '已接收':
            return {
              background: '#ff0',
              color: '#000'
            }
          break
          case '已准备':
            return {
              background: '#0f0',
              color: '#000'
            }
          break
        }
      }
    },
  }
}
</script>
<style>
#add-assi .assi-table{
  padding: 10px;
}
#add-assi .el-form-item{
  margin-bottom: 15px;
  width: 90%;
}
#add-assi .uplode-table th{
  background-color: #fff !important;
  padding: 0;
}
#add-assi .el-button--mini{
  margin-bottom: 15px;
}
#add-assi .el-upload__tip{
  padding-left: 20px;
}
</style>