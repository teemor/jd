<template>
<!-- 巡检工作 -->
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="时间">
          <el-date-picker
            v-model="formInline.time"
            type="datetime"
            placeholder="时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="科室">
          <el-cascader
            :options="options"
            :props="{ emitPath: true, checkStrictly: true, label: 'name', key: 'id' }"
            size="mini"
            ref="searchcascader"
            placeholder="请选择科室"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="奖惩">
          <el-select v-model="formInline.sign" placeholder="请选择" size="mini">
            <el-option label="仅有奖励" value="1"></el-option>
            <el-option label="仅有惩罚" value="2"></el-option>
            <el-option label="无奖励无惩罚" value="3"></el-option>
            <el-option label="有奖励有惩罚" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchIns">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询巡检任务 -->
    <el-button size="mini" type="primary" @click="addIns">新增</el-button>
    <div id="inspection-work">
      <div>
        <general-table 
          :body="tableData" 
          :showPagination="true" 
          :total="tableData.total" 
          :showcheck="false"
          @paginationChange="paginationChange"
        >
          <el-table-column label="总览" width="150px" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-view" size="small" @click="insDetail(scope.row)">
                <template>查看</template>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span v-if='scope.row.stu == "未发布"'>
                <el-button type="text" icon="el-icon-edit" size="small" @click="editIns(scope.row)">
                  <template>编辑</template>
                </el-button>
              </span>
              <span v-else>
                <el-button type="text" icon="el-icon-edit" size="small" disabled>
                  <template>编辑</template>
                </el-button>
              </span>
              <el-button type="text" icon="el-icon-delete" size="small" @click="delIns(scope.row)">
                <template>删除</template>
              </el-button>
            </template>
          </el-table-column>
        </general-table>
      </div>
      <!-- 新增巡检工作 -->
      <el-dialog :visible.sync="addDialog" title="新增巡检工作">
        <el-form :model="addForm" label-width="120px" ref="addForm" :rules="rules">
          <el-form-item label="任务名称" prop="name">
            <el-input size="mini" v-model="addForm.name" placeholder="任务名称"></el-input>
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-date-picker
              v-model="addForm.time"
              type="datetime"
              placeholder="时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发布人" prop="person">
            <el-input size="mini" v-model="addForm.person" placeholder="发布人"></el-input>
          </el-form-item>
          <el-form-item label="巡检内容" prop="insContent">
            <el-input type="textarea" size="mini" v-model="addForm.insContent" placeholder="巡检内容"></el-input>
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
          <el-form-item label="被检查部门">
            <el-cascader
              :options="options"
              :props="{ multiple: true, emitPath: true, checkStrictly: true, label: 'name', key: 'id', value: 'id' }"
              size="mini"
              ref="cascader"
              placeholder="请选择部门"
              v-model="selectDp"
            ></el-cascader>
            <el-button size="mini" type="primary" @click="addInsDp('add')">增加</el-button>
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" size="mini" v-model="dp" placeholder="检查部门" disabled></el-input>
          </el-form-item>
          <el-form-item label="不合格部门">
            <el-select v-model="failDp" size="mini" multiple placeholder="请选择不合格部门"  @change="failChange">
              <el-option
                v-for="item in dpOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="奖励部门">
            <el-select v-model="rewardDp" size="mini" multiple placeholder="请选择奖励部门" @change="rewardChange">
              <el-option
                v-for="item in dpOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-table :data="failData">
            <el-table-column prop="reformDp" label="整改部门" align="center" width="150px"></el-table-column>
            <el-table-column prop="reformPerson" label="接收人" align="center">
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.receive">
                  <el-checkbox v-for="item in scope.row.person" :label="item.id" :key="item.id" >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column prop="reformContent" label="不合格内容" align="center">
              <template slot-scope="scope">
                <el-input type="textarea" v-model="scope.row.reformContent" placeholder="请输入工作清单" autosize size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="figure" label="金额" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.figure" placeholder="请输入金额" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="reformTime" label="整改时效" align="center">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.reformTime"
                  type="datetime"
                  placeholder="时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  size="mini">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="删除" align="center" width="80px">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.$index,'areform')"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="rewardData">
            <el-table-column prop="rewardDp" label="奖励部门" align="center" width="150px"></el-table-column>
            <el-table-column prop="rewardPerson" label="接收人" align="center">
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.receive">
                  <el-checkbox v-for="item in scope.row.person" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column prop="rewardFigure" label="金额" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.rewardFigure" placeholder="请输入金额" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="删除" align="center" width="80px">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.$index,'areward')"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addSaveIns">保 存</el-button>
          <el-button type="primary" @click="commitIns">发 布</el-button>
        </div>
      </el-dialog>
      <!-- 编辑巡检工作 -->
      <el-dialog :visible.sync="editDialog" title="编辑巡检工作">
        <el-form :model="editForm" label-width="120px"  ref="editForm" :rules="rules">
          <el-form-item label="任务名称" prop="name">
            <el-input size="mini" v-model="editForm.name" placeholder="任务名称"></el-input>
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-date-picker
              v-model="editForm.time"
              type="datetime"
              placeholder="时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发布人" prop="person">
            <el-input size="mini" v-model="editForm.person" placeholder="发布人"></el-input>
          </el-form-item>
          <el-form-item label="巡检内容" prop="insContent">
            <el-input type="textarea" size="mini" v-model="editForm.insContent" placeholder="巡检内容"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload 
              action="http://yz.c.ic.ci/jdem/jdTesting/inspectiontask/import" 
              ref="upload"
              :file-list="editFileList"
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
          <el-form-item label="被检查部门">
            <el-cascader
              :options="options"
              :props="{ multiple: true, emitPath: true, checkStrictly: true, label: 'name', key: 'id', value: 'id' }"
              size="mini"
              ref="cascader"
              placeholder="请选择部门"
              v-model="selectDp"
              collapse-tags
            ></el-cascader>
            <el-button size="mini" type="primary" @click="addInsDp('edit')">增加</el-button>
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" size="mini" v-model="editdp" placeholder="检查部门" disabled></el-input>
          </el-form-item>
          <el-form-item label="不合格部门">
            <el-select v-model="editFailDp" size="mini" multiple placeholder="请选择不合格部门" @visible-change="editFail">
              <el-option
                v-for="item in editOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="奖励部门">
            <el-select v-model="editRewardDp" size="mini" multiple placeholder="请选择奖励部门" @visible-change="editReward">
              <el-option
                v-for="item in editOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-table :data="editFailData">
            <el-table-column prop="reformDp" label="整改部门" align="center" width="150px"></el-table-column>
            <el-table-column prop="reformPerson" label="接收人" align="center">
              <template slot-scope="scope">
                <div v-for="item in scope.row.person" :label="item.id" :key="item.id">
                  <el-checkbox v-model="item.isChecked">{{ item.name }}</el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="reformContent" label="不合格内容" align="center">
              <template slot-scope="scope">
                <el-input type="textarea" v-model="scope.row.reformContent" placeholder="请输入工作清单" autosize size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="figure" label="金额" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.figure" placeholder="请输入金额" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="reformTime" label="整改时效" align="center">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.reformTime"
                  type="datetime"
                  placeholder="时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  size="mini">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="删除" align="center" width="80px">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.$index,'ereform')"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="editRewardData">
            <el-table-column prop="rewardDp" label="奖励部门" align="center" width="150px"></el-table-column>
            <el-table-column prop="rewardPerson" label="接收人" align="center">
              <template slot-scope="scope">
                <div v-for="item in scope.row.person" :label="item.id" :key="item.id">
                  <el-checkbox v-model="item.isChecked">{{ item.name }}</el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="rewardFigure" label="金额" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.rewardFigure" placeholder="请输入金额" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="删除" align="center" width="80px">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.$index,'ereward')"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editSaveIns">保 存</el-button>
          <el-button type="primary" @click="editCommitIns">保存并发布</el-button>
        </div>
      </el-dialog>
      <!-- 任务总览 -->
      <el-dialog :visible.sync="showDialog">
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
                  <el-button type="text" icon="el-icon-download" size="small" @click="download(scope.row)" >
                    <template>下载</template>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="检查部门">
            <el-input type="textarea" size="mini" v-model="showdp" placeholder="检查部门" disabled></el-input>
          </el-form-item>
          <el-table :data="insForm.failTable">
            <el-table-column prop="reformDp" label="整改部门" align="center" width="150px"></el-table-column>
            <el-table-column prop="reformPerson" label="接收人" align="center"></el-table-column>
            <el-table-column prop="reformContent" label="不合格内容" align="center"></el-table-column>
            <el-table-column prop="figure" label="金额" align="center"></el-table-column>
            <el-table-column prop="reformTime" label="整改时效" align="center"></el-table-column>
          </el-table>
          <el-table :data="insForm.rewardTable">
            <el-table-column prop="rewardDp" label="奖励部门" align="center" width="150px"></el-table-column>
            <el-table-column prop="rewardPerson" label="接收人" align="center"></el-table-column>
            <el-table-column prop="rewardFigure" label="金额" align="center"></el-table-column>
          </el-table>
        </el-form>
        <!-- -------------------------------------------- -->
        <el-table :data="auditData" class="audittable" v-if="insForm.stu == '任务结束'">
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
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showDialog=false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
    
  </div>
</template>

<script>
import dp from '@/api/work/wel/add_assignment';
import request from '@/api/work/route/inspection_work'

export default {
  data() {
    return {
      options: [],
      formInline: {
        time: "",
        dp: "",
        sign: ""
      },
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
            prop: 'person',
            value: '发布人'
          },
          {
            prop: 'punishDp',
            value: '惩罚部门'
          },
          {
            prop: 'rewardDp',
            value: '奖励部门'
          },
        ],
        tableData: [],
        total: 0
      },
      addDialog: false,
      addForm: {
        taskId: '',
        name: '',
        time: '',
        person: '',
        insContent: '',
        attachment: '',
        insDp: [],
        failTable: [],
        rewardTable: [],
        sign: ''
      },
      attachment: [],
      fileList: [],
      dpOptions: [],
      failDp: [],
      failData: [],
      rewardDp: [],
      rewardData: [],
      dp: '',
      editDialog: false,
      editForm: {
        name: '',
        time: '',
        person: '',
        insContent: '',
        attachment: '',
        insDp: [],
        failTable: [],
        rewardTable: [],
        taskId: '',
        sign: ''
      },
      editFileList: [],
      editOptions: [],
      editFailDp: [],
      editFailData: [],
      editRewardDp: [],
      editRewardData: [],
      editdp: '',
      selectDp: [],
      showDialog: false,
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
      auditData: [],
      showdp: '',
      rules: {
        name: { required: true, message: '请输入任务名称', trigger: 'blur' },
        time: { required: true, message: '请输入时间', trigger: 'blur' },
        person: { required: true, message: '请输入发布人', trigger: 'blur' },
        insContent: { required: true, message: '请输入巡检内容', trigger: 'blur' },
      },
      form: {
        page: 1,
        pageSize: 10
      },
      url: ''
    }
  },
  mounted() {
    this.getDp({});
    this.getUser();
    this.getIns({});
  },
  methods: {
    // 查询巡检工作
    getIns(model) {
      request.getIns(JSON.stringify(model) == "{}" ? this.form : model)
      .then(res => {
        this.tableData.tableData = res.data.data;
        this.tableData.total = res.data.count;
      })
    },
    // 搜索巡检任务
    searchIns() {
      this.$refs['searchcascader'].getCheckedNodes().map((res) => {
        this.formInline.dp = res.data.name;
      })
      request.searchIns(this.formInline).then(res => {
         this.tableData.tableData = res.data.data;
      })
    },
    // 新增巡检任务
    addIns() {
      this.addDialog = true;
      this.dp = '';
      if(this.addForm.taskId !== '') {
        this.$refs['addForm'].resetFields();
      }
      var newDate = new Date()
      let date = newDate.toLocaleString('chinese', { hour12: false }).replace(/\//g,"-"); 
      this.addForm.time = date
    },
    // 将*Data数据放进*Table
    setTable() {
      this.failData.map((res) => {
        this.addForm.failTable.push({
          reformPerson: res.receive.join(','),
          reformDp: res.reformDp,
          reformContent: res.reformContent,
          figure: res.figure,
          reformTime: res.reformTime,
          dpId: res.dpId
        })
      })
      this.rewardData.map((res) => {
        this.addForm.rewardTable.push({
          rewardDp: res.rewardDp,
          rewardPerson: res.receive.join(','),
          rewardFigure: res.rewardFigure,
          dpId: res.dpId
        })
      })
    },
    addSaveIns() {
      this.addForm.attachment = this.attachment.join(',');
      this.setTable();
      console.log(this.addForm)
      request.addSaveIns(this.addForm).then(res => {
        this.$commonUtils.setMessage("success", "巡检任务保存成功！");
        this.getIns({});
        this.addForm.taskId = res.data;
      })
    },
    // 发布
    commitIns() {
      this.addForm.attachment = this.attachment.join(',');
      this.setTable();
      if(this.addForm.insDp.length == 0) {
        this.$commonUtils.setMessage("error", "请添加检查部门");
      } else {
        this.$refs.addForm.validate(pass => {
          if(pass) {
            if(this.addForm.failTable.length == 0 && this.addForm.rewardTable.length > 0){
              this.addForm.sign = "1"
            } else if(this.addForm.failTable.length > 0 && this.addForm.rewardTable.length == 0) {
              this.addForm.sign = "2"
            } else if(this.addForm.failTable.length == 0 && this.addForm.rewardTable.length == 0) {
              this.addForm.sign = "3"
            } else {
              this.addForm.sign = "4"
            }
            request.commitIns(this.addForm).then(res => {
              this.addDialog = false;
              this.getIns({});
              this.$refs['addForm'].resetFields();
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
    // 选择检查部门
    addInsDp(form) {
      let check = [];
      this.dpOptions = [];
      this.editOptions = [];
      this.addForm.insDp = [];
      this.editForm.insDp = [];
      this.$refs['cascader'].getCheckedNodes().map((res) => {
        check.push(res.label)
        if(form == 'add') {
          this.dp = check.join(',');
          this.addForm.insDp.push({
            label: res.label,
            value: res.value
          })
          this.dpOptions.push({
            value: res.data.id.toString(),
            label: res.label
          }) 
        } else {
          this.editdp = check.join(',');
          this.editForm.insDp.push({
            label: res.label,
            value: res.value
          });
          this.editOptions.push({
            value: res.data.id.toString(),
            label: res.label
          }) 
        }
      })
      this.selectDp = []
    },
    // 选择不合格部门
    failChange(items) {
      this.failData = [];
      items.map((res) => {
        dp.person({ dpid : res.value }).then(data => {
          this.failData.push({
            reformDp: res.label,
            person: data.data,
            receive: [],
            reformContent: '',
            figure: '',
            reformTime: '',
            dpId: res.value
          })
        })
      })
    },
    // 选择奖励部门
    rewardChange(items) {
      this.rewardData = [];
      items.map((res) => {
        dp.person({ dpid : res.value }).then(data => {
          this.rewardData.push({
            rewardDp: res.label,
            person: data.data,
            receive: [],
            rewardFigure: '',
            dpId: res.value
          })
        })
      })
    },
    // 部门行删除
    deleteRow(index,table) {
      if(table == 'areform') {
        this.failData.splice(index,1);
      } else if(table == 'areward') {
        this.rewardData.splice(index,1);
      } else if(table == 'ereform') {
        this.editFailData.splice(index,1);
      } else {
        this.editRewardData.splice(index,1);
      }
    },
    // 编辑巡检工作
    editIns(data) {
      this.editFileList = [];
      this.editDialog = true;
      this.editFailData = [];
      this.editRewardData = [];
      this.editFailDp = [];
      this.editRewardDp = [];
      this.attachment = [];
      this.editdp = '';
      this.editForm = data;
      // 处理文件链接
      if(data.attachment.length !== 0) {
        let a = data.attachment.split(',');  
        if(a.length > 0) {
          a.forEach(item => {
            var obj = {} 
            let index = item.replace(/\\/g,"/").lastIndexOf('\/');
            let fileName  = item.substring(index + 1, item.length); //最后的文件名截取出来
            this.$set(obj,'name', fileName);
            this.$set(obj,'url', item);  //修改fileList里面的结构（name,url）
            this.editFileList.push(obj);
          })
        }
        this.attachment.push(data.attachment.split(','))
      }
      this.editOptions = data.insDp;
      let check = [];
      data.insDp.map((res) => {
        check.push(res.label);
      })
      this.editdp = check.join(',')
      data.failTable.map((res) => {
        this.editFailDp.push(res.reformDp)
        // 接收人选中项
        dp.person({ dpid : res.dpId }).then(data => {
          let per = [];
          data.data.map((personItem) => {
            per.push({
              ...personItem,
              isChecked: false
            })
          })
          per.map((item) => {
            res.reformPerson.split(',').map((item1) => {
              if(item.id == item1) {
                item.isChecked = true;
              }
            })
          })
          this.editFailData.push({
            ...res,
            person: per,
          })
        })
      })
      data.rewardTable.map((res) => {
        this.editRewardDp.push(res.rewardDp)
        // 接收人选中项
        dp.person({ dpid : res.dpId }).then(data => {
          let per = [];
          data.data.map((personItem) => {
            per.push({
              ...personItem,
              isChecked: false
            })
          })
          per.map((item) => {
            res.rewardPerson.split(',').map((item1) => {
              if(item.id == item1) {
                item.isChecked = true;
              }
            })
          })
          this.editRewardData.push({
            ...res,
            person: per,
          })
        })
      })
    },
    setEditTable() {
      this.editForm.failTable = [];
      this.editForm.rewardTable = [];
      this.editFailData.map((res) => {
        let changeperson = [];
        res.person.map((item) => {
          if(item.isChecked == true) {
            changeperson.push(item.id);
          }
        })
        this.editForm.failTable.push({
          reformPerson: changeperson.join(','),
          reformDp: res.reformDp,
          reformContent: res.reformContent,
          figure: res.figure,
          reformTime: res.reformTime,
          dpId: res.dpId.toString()
        })
      })
      this.editRewardData.map((res) => {
        let changeperson = [];
        res.person.map((item) => {
          if(item.isChecked == true) {
            changeperson.push(item.id);
          }
        })
        this.editForm.rewardTable.push({
          rewardDp: res.rewardDp,
          rewardPerson: changeperson.join(','),
          rewardFigure: res.rewardFigure,
          dpId: res.dpId.toString()
        })
      })
    },
    editSaveIns() {
      this.editForm.attachment = this.attachment.join(',');
      this.setEditTable();
      request.editSaveIns(this.editForm).then(res => {
        this.editDialog = false;
        this.getIns({});
        this.$commonUtils.setMessage("success", "修改成功");
      })
    },
    // 编辑发布
    editCommitIns() {
      this.editForm.attachment = this.attachment.join(',');
      this.setEditTable();
      if(this.editForm.insDp.length == 0) {
        this.$commonUtils.setMessage("error", "请添加检查部门");
      } else {
        this.$refs.editForm.validate(pass => {
          if(pass) {
            if(this.editForm.failTable.length == 0 && this.editForm.rewardTable.length > 0){
              this.editForm.sign = "1"
            } else if(this.editForm.failTable.length > 0 && this.editForm.rewardTable.length == 0) {
              this.editForm.sign = "2"
            } else if(this.editForm.failTable.length == 0 && this.editForm.rewardTable.length == 0) {
              this.editForm.sign = "3"
            } else {
              this.editForm.sign = "4"
            }
            request.commitIns(this.editForm).then(res => {
              this.editDialog = false;
              this.getIns({});
              this.$commonUtils.setMessage("success", "发布成功");
            })
          } else {
            this.$commonUtils.setMessage("error", "请填完整信息");
          }
        })
      }
    },
    // 选择不合格部门
    editFail(change) {
      if(change == false) {
        this.editFailDp.map((res) => {
          dp.person({ dpid : res.value }).then(data => {
            this.editFailData.push({
              reformDp: res.label,
              person: data.data,
              receive: [],
              reformContent: '',
              figure: '',
              reformTime: '',
              dpId: res.value
            })
          })
        })
      } else {
        this.editFailDp = [];
      }
    },
    // 选择奖励部门
    editReward(change) {
      if(change == false) {
        this.editRewardDp.map((res) => {
          dp.person({ dpid : res.value }).then(data => {
            this.editRewardData.push({
              rewardDp: res.label,
              person: data.data,
              receive: [],
              rewardFigure: '',
              dpId: res.value
            })
          })
        })
      } else {
        this.editRewardDp = [];
      }
    },
    // 总览
    insDetail(data) {
      this.showDialog = true;
      console.log(data, 'data')
      this.insForm.name = data.name;
      this.insForm.time = data.time;
      this.insForm.person = data.person;
      this.insForm.insContent = data.insContent;
      this.insForm.failTable = data.failTable;
      this.insForm.rewardTable = data.rewardTable;
      this.insForm.stu = data.stu;
      this.insForm.attachment = [];
      this.auditData = [];
      if(data.attachment !== '') {
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
      this.showdp = insdp.join(",");
      this.auditData = data.failTable;
      //处理文件链接
      this.auditData.map((res) => {
        if(res.disAttachment !== '' && res.disAttachment !== null) {
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
    // 删除巡检工作
    delIns(data) {
      request.delIns({ taskId: data.taskId }).then(res => {
        console.log(res)
        if(res.data == '无法删除') {
          this.$commonUtils.setMessage("warning", "已经发布，无法删除");
        } else {
          this.getIns({});
          this.$commonUtils.setMessage("success", "删除成功");
        }
      })
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
    // 分页查询
    paginationChange(page,pageSize) {
      this.getIns({ page: page, pageSize: pageSize });
    },
  }
}
</script>

<style>
#inspection-work .el-upload__tip{
  padding-left: 20px;
}
#inspection-work .el-form-item{
  margin-bottom: 15px;
  width: 90%;
}
</style>