<template>
  <div>
    <div class="btn_contain">
      <el-button size="mini" type="primary" @click="addDevice">新增</el-button>
      <el-button size="mini" type="primary" @click="deleteAllDevice">批量删除</el-button>
    </div>
      <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="工艺段">
          <el-input size="mini" v-model="formInline.user" placeholder="工艺段"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input size="mini" v-model="formInline.department" placeholder="名称"></el-input>
        </el-form-item>
          <el-form-item label="编号">
          <el-input size="mini" v-model="formInline.department" placeholder="编号"></el-input>
        </el-form-item>
          <el-form-item label="部门">
          <el-input size="mini" v-model="formInline.department" placeholder="所属部门"></el-input>
        </el-form-item>
          <el-form-item label="启用">
          <el-input size="mini" v-model="formInline.department" placeholder="启用"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchUser">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="float:left;width:100%">
      <general-table
        :body="tableData"
        :showPagination="true"
        :total="tableData.total"
        @paginationChange="paginationChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editDevice(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-button type="text" icon="el-icon-edit" size="small" @click="copyDevice(scope.row)">
              <template>复制</template>
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="small"
              @click="deleteDevice(scope.row)"
            >
              <template>删除</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <div>
      <!-- 添加 -->
      <el-dialog title="添加设备" :visible.sync="DeviceDialog">
        <el-form
          :inline="true"
          ref="equip"
          :model="formInline"
          class="demo-form-inline"
          :rules="dic_rules"
        >
          <el-form-item label="名称" prop="name">
            <el-input size="mini" v-model="formInline.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="classification">
            <el-input size="mini" v-model="formInline.classification" placeholder="分类"></el-input>
          </el-form-item>
          <el-form-item label="是否在线" prop="line">
            <el-select v-model="formInline.line" placeholder="请选择" size="mini">
              <el-option
                size="mini"
                v-for="item in lineData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备编号" prop="deviceId">
            <el-input size="mini" v-model="formInline.deviceId" placeholder="设备编号"></el-input>
          </el-form-item>
          <el-form-item label="数据仓编号" prop="warehouse">
            <el-input size="mini" v-model="formInline.warehouse" placeholder="数据仓编号"></el-input>
          </el-form-item>
          <el-form-item label="检测项目" prop="correlationId">
            <el-select v-model="formInline.correlationId" multiple placeholder="检测项目" size="mini">
              <el-option
                size="mini"
                v-for="item in correlationId"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营模块" prop="functional">
            <el-select size="mini" v-model="formInline.functional" placeholder="请选择">
              <el-option
                size="mini"
                v-for="item in opModule"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运维部门" prop="department">
            <el-cascader
              v-model="formInline.department"
              :options="fileDpOptions"
              size="mini"
              change-on-select
              :props="optionProps"
              ref="cascader"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="工艺段" prop="process">
            <el-select size="mini" v-model="formInline.process" placeholder="请选择">
              <el-option
                size="mini"
                v-for="item in process"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运行状态" prop="state">
            <el-select v-model="formInline.state" placeholder="请选择" size="mini" @change="firstDep">
              <el-option
                size="mini"
                v-for="item in RunningState"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监测单位" prop="company">
            <el-select size="mini" v-model="formInline.company" placeholder="请选择">
              <el-option
                size="mini"
                v-for="item in company"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监测周期" prop="project">
            <el-input size="mini" v-model.number="formInline.project" placeholder="监测周期">
              <span slot="suffix">天</span>
            </el-input>
          </el-form-item>
          <el-form-item label="末次检测时间" prop="cycle">
            <el-date-picker
              size="mini"
              v-model="formInline.cycle"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="检测状态" prop="lastCycle">
            <el-select
              v-model="formInline.lastCycle"
              placeholder="请选择"
              size="mini"
              @change="firstDep"
            >
              <el-option
                size="mini"
                v-for="item in TestState"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预警天数" prop="earlyWarning">
            <el-input size="mini" v-model.number="formInline.earlyWarning" placeholder="预警天数">
              <span slot="suffix">天</span>
            </el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="specifications">
            <el-input size="mini" v-model="formInline.specifications" placeholder="规格型号"></el-input>
          </el-form-item>
          <el-form-item label="建档人" prop="archivingPerson">
            <el-input size="mini" v-model="formInline.archivingPerson" placeholder="建档人"></el-input>
          </el-form-item>
          <el-form-item label="建档时间" prop="filingTime">
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
              size="mini"
              v-model="formInline.filingTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="关联排污口" prop="associatedDrain">
            <el-select v-model="formInline.associatedDrain" placeholder="请选择" size="mini">
              <el-option
                size="mini"
                v-for="item in associatedDrain"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button size="mini" type="primary" @click="addDeviceData">保存</el-button>
      </el-dialog>
    </div>
    <div>
      <!-- 修改 -->
      <el-dialog :title="copy===1?'添加设备':'修改设备'" :visible.sync="DeviceEditDialog">
        <el-form
          ref="equip"
          :inline="true"
          :model="editForm"
          class="demo-form-inline"
          :rules="dic_rules"
        >
          <el-form-item label="名称" prop="name">
            <el-input size="mini" v-model="editForm.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="classification">
            <el-input size="mini" v-model="editForm.classification" placeholder="分类"></el-input>
          </el-form-item>
          <el-form-item label="是否在线" prop="line">
            <el-select v-model="editForm.line" placeholder="请选择" size="mini">
              <el-option
                size="mini"
                v-for="item in lineData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备编号" prop="deviceId">
            <el-input size="mini" v-model="editForm.deviceId" placeholder="设备编号"></el-input>
          </el-form-item>
          <el-form-item label="数据仓编号" prop="warehouse">
            <el-input size="mini" v-model="editForm.warehouse" placeholder="数据仓编号"></el-input>
          </el-form-item>
          <el-form-item label="检测项目" prop="correlationId">
            <el-select v-model="editForm.correlationId" multiple placeholder="请选择" size="mini">
              <el-option
                size="mini"
                v-for="item in correlationId"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营模块" prop="functional">
            <el-select size="mini" v-model="editForm.functional" placeholder="请选择">
              <el-option
                size="mini"
                v-for="item in opModule"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运维部门" prop="department">
            <el-cascader
              v-model="editForm.department"
              :options="fileDpOptions"
              size="mini"
              change-on-select
              :props="optionProps"
              ref="cascader"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="工艺段" prop="process">
            <el-select size="mini" v-model="editForm.process" placeholder="请选择">
              <el-option
                size="mini"
                v-for="item in process"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="运行状态" prop="state">
            <el-select v-model="editForm.state" placeholder="请选择" size="mini" @change="firstDep">
              <el-option
                size="mini"
                v-for="item in RunningState"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检测单位" prop="company">
            <el-select size="mini" v-model="editForm.company" placeholder="请选择">
              <el-option
                size="mini"
                v-for="item in company"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监测周期" prop="project">
            <el-input size="mini" v-model.number="editForm.project" placeholder="监测周期">
              <span slot="suffix">天</span>
            </el-input>
          </el-form-item>
          <el-form-item label="末次检测时间" prop="cycle">
            <el-date-picker
              size="mini"
              v-model="editForm.cycle"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="检测状态" prop="lastCycle">
            <el-select
              v-model="editForm.lastCycle"
              placeholder="请选择"
              size="mini"
              @change="firstDep"
            >
              <el-option
                size="mini"
                v-for="item in TestState"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预警天数" prop="earlyWarning">
            <el-input size="mini" v-model.number="editForm.earlyWarning" placeholder="预警天数">
              <span slot="suffix">天</span>
            </el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="specifications">
            <el-input size="mini" v-model="editForm.specifications" placeholder="规格型号"></el-input>
          </el-form-item>
          <el-form-item label="建档人" prop="specifications">
            <el-input size="mini" v-model="editForm.archivingPerson" placeholder="建档人"></el-input>
          </el-form-item>
          <el-form-item label="建档时间" prop="filingTime">
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
              size="mini"
              v-model="editForm.filingTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="关联排污口" prop="associatedDrain">
            <el-select v-model="editForm.associatedDrain" placeholder="请选择" size="mini">
              <el-option
                size="mini"
                v-for="item in associatedDrain"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button size="mini" type="primary" @click="editDeviceData">保存</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import commonUtils from "@/assets/util/commonUtil";
import request from "@/api/system/equipment";
import dict from "@/api/system/dictionary";
import dictonary from "@/mixins/dictonary";
export default {
  mixins: [dictonary],
  data() {
    return {
      model: {},
      opModule: [
        { id: 0, name: "生产设备" },
        { id: 1, name: "治污设备" }
      ],
      first: "",
      second: "",
      third: "",
      copy: 1,
      DeviceEditDialog: false,
      formInline: {
        functional: "",
        name: "", //名称
        classification: "", // 分类
        line: "", //是否在线
        deviceId: "", // 设备编号
        warehouse: "", // 数据仓编号
        correlationId: [], // 检测项目
        department: "", //运维部门
        process: "", //工艺段
        state: "", //运行状态
        company: "", // 检测单位
        project: "", //监测周期
        cycle: "", //末次检测时间
        lastCycle: "", // 检测状态
        earlyWarning: "", //预警天数
        specifications: "", //规格型号
        archivingPerson: "", // 建档人
        filingTime: "", //建档时间
        associatedDrain: "" // 关联排污口
      },
      editForm: {
        functional: "",
        id: "",
        name: "", //名称
        classification: "", // 分类
        line: "", //是否在线
        deviceId: "", // 设备编号
        warehouse: "", // 数据仓编号
        correlationId: [], // 检测项目
        department: "", //运维部门
        process: "", //工艺段
        state: "", //运行状态
        company: "", // 检测单位
        project: "", //监测周期
        cycle: "", //末次检测时间
        lastCycle: "", // 检测状态
        earlyWarning: "", //预警天数
        specifications: "", //规格型号
        archivingPerson: "", // 建档人
        filingTime: "", //建档时间
        associatedDrain: "" // 关联排污口
      },
      DeviceTree: [],
      DeviceData: [],
      DeviceDialog: false,
      form: {
        page: 1,
        pageSize: 10
      },
      idBatch: "",
      tableData: {
        header: [
          {
            prop: "name",
            value: "名称"
          },
          {
            prop: "deviceId",
            value: "设备编号"
          },
          {
            prop: "processname",
            value: "工艺段"
          },
          {
            prop: "departmentname",
            value: "运维部门"
          }
        ],
        tableData: [],
        total: 0
      }
    };
  },
  mounted() {
    this.selectDpTree(); //运维部门
    this.selectDevice({});
    this.selectTech();
    this.selectUnit();
    this.selectAsso();
    this.selectItems();
  },
  methods: {
    // 字典表
    // 多选操作
    handleSelectionChange(val) {
      this.idBatch = val.map(item => {
        return item.id;
      });
    },
    // 批量删除
    deleteAllDevice() {
      if (this.idBatch == "") {
        this.$message({
          type: "warning",
          message: "请选择删除的角色!"
        });
      } else {
        this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request
              .deleteAllDevice({ idBatch: this.idBatch.join() })
              .then(res => {
                if (res.data === "deleteBatch!!") {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.selectDevice({});
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    // 删除
    deleteDevice(data) {
      let id = data.id;
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request.deleteDevice({ id: id }).then(res => {
            if (res.data === "delete") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.selectDevice({});
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分页
    paginationChange(page, pageSize) {
      this.form.page = page;
      this.form.pageSize = pageSize;
      this.selectDevice({ page: page, pageSize: pageSize });
    },
    sysChange() {},
    // 添加
    addDevice() {
      this.DeviceDialog = true;
      this.$refs.equip.resetFields();
    },
    addDeviceData() {
      this.$refs["cascader"].getCheckedNodes().map(res => {
        this.formInline.department = res.data.id;
      });
      let data = this.formInline;
      data.correlationId = this.formInline.correlationId.join();
      this.$refs.equip.validate(valid => {
        if (valid) {
          request.addDevice(data).then(res => {
            if (res.data === "insert") {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.DeviceDialog = false;
              this.selectDevice({});
            } else if (res.data === "repeat") {
              this.formInline.correlationId = this.formInline.correlationId
                .split(",")
                .map(Number);
              this.$message({
                type: "info",
                message: "重复字段"
              });
            }
          });
        } else {
          this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
        }
      });
    },
    // 查询
    // selectAddDevice(tab, event) {
    //   menu.secondMenuData(2).then(res => {
    //     this.DeviceTree = res.data.data;
    //   });
    // },
    // 编辑
    editDevice(data) {
      this.DeviceEditDialog = true;
      this.editForm.id = data.id;
      this.editForm.name = data.name; //名称
      this.editForm.functional = data.functional;
      this.editForm.classification = data.classification; // 分类
      this.editForm.line = data.line; //是否在线
      this.editForm.deviceId = data.deviceId; // 设备编号
      this.editForm.warehouse = data.warehouse; // 数据仓编号
      this.editForm.department = data.departmentid; //运维部门
      this.editForm.process = data.processid; //工艺段
      this.editForm.state = data.stateid; //运行状态
      this.editForm.company = data.companyid; // 检测单位
      this.editForm.project = data.project; //监测周期
      this.editForm.cycle = data.cycle; //末次检测时间
      this.editForm.lastCycle = data.lastCycleid; // 检测状态
      this.editForm.earlyWarning = data.earlyWarning; //预警天数
      this.editForm.specifications = data.specifications; //规格型号
      this.editForm.archivingPerson = data.archivingPerson; // 建档人
      this.editForm.filingTime = data.filingTime; //建档时间
      this.editForm.associatedDrain = data.associatedDrainid
        ? data.associatedDrainid
        : ""; // 关联排污口
      let correlationId = data.correlation.map(item => {
        return item.id;
      });
      this.editForm.correlationId = correlationId;
      console.log(this.editForm, "data");
      this.copy = 0;
    },
    editDeviceData() {
      if (this.copy === 1) {
        let data = this.editForm;
        data.correlationId = this.editForm.correlationId.join();
        this.$refs["cascader"].getCheckedNodes().map(res => {
          data.department = res.data.id;
        });

        request.addDevice(data).then(res => {
          if (res.data === "insert") {
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.DeviceEditDialog = false;
            this.selectDevice({});
          } else if (res.data === "repeat") {
            this.editForm.correlationId = this.editForm.correlationId
              .split(",")
              .map(Number);
            this.$message({
              type: "info",
              message: "重复字段"
            });
          }
        });
      } else {
        this.model.id = this.editForm.id;
        this.model.name = this.editForm.name; //名称
        this.model.classification = this.editForm.classification; // 分类
        this.model.line = this.editForm.line; //是否在线
        this.model.deviceId = this.editForm.deviceId; // 设备编号
        this.model.warehouse = this.editForm.warehouse; // 数据仓编号
        this.$refs["cascader"].getCheckedNodes().map(res => {
          this.model.department = res.data.id;
        });
        this.model.functional = this.editForm.functional;
        this.model.process = this.editForm.process; //工艺段
        this.model.state = this.editForm.state; //运行状态
        this.model.company = this.editForm.company; // 检测单位
        this.model.project = this.editForm.project; //监测周期
        this.model.cycle = this.editForm.cycle; //末次检测时间
        this.model.lastCycle = this.editForm.lastCycle; // 检测状态
        this.model.earlyWarning = this.editForm.earlyWarning; //预警天数
        this.model.specifications = this.editForm.specifications; //规格型号
        this.model.archivingPerson = this.editForm.archivingPerson; // 建档人
        this.model.filingTime = this.editForm.filingTime; //建档时间
        this.model.associatedDrain = this.editForm.associatedDrain; // 关联排污口
        this.model.correlationId = this.editForm.correlationId.join(); // 关联排污口
        request.updateDevice(this.model).then(res => {
          if (res.data === "update") {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.DeviceEditDialog = false;
            this.selectDevice({});
          } else if (res.data === "repeat") {
            this.editForm.correlationId = this.editForm.correlationId
              .split(",")
              .map(Number);
            this.$message({
              type: "info",
              message: "重复字段"
            });
          }
        });
      }
    },
    // 复制
    copyDevice(data) {
      this.DeviceEditDialog = true;
      this.editForm.id = data.id;
      this.editForm.name = data.name; //名称
      this.editForm.classification = data.classification; // 分类
      this.editForm.line = data.line; //是否在线
      this.editForm.deviceId = data.deviceId; // 设备编号
      this.editForm.warehouse = data.warehouse; // 数据仓编号
      this.editForm.department = data.departmentid; //运维部门
      this.editForm.process = data.processid; //工艺段
      this.editForm.state = data.stateid; //运行状态
      this.editForm.company = data.companyid; // 检测单位
      this.editForm.project = data.project; //监测周期
      this.editForm.cycle = data.cycle; //末次检测时间
      this.editForm.lastCycle = data.lastCycleid; // 检测状态
      this.editForm.earlyWarning = data.earlyWarning; //预警天数
      this.editForm.specifications = data.specifications; //规格型号
      this.editForm.archivingPerson = data.archivingPerson; // 建档人
      this.editForm.filingTime = data.filingTime; //建档时间
      this.editForm.functional = data.functional; // 运营模块
      this.editForm.associatedDrain = data.associatedDrainid
        ? data.associatedDrainid
        : ""; // 关联排污口
      let correlationId = data.correlation.map(item => {
        return item.id;
      });
      this.editForm.correlationId = correlationId;
      console.log(this.editForm, "editform");
      this.copy = 1;
    },
    Data() {
      this.DeviceDialog = true;
    },

    selectDevice(model) {
      request
        .selectDevice(JSON.stringify(model) == "{}" ? this.form : model)
        .then(res => {
          if (res.data.tableData.length === 0 && res.data.totalItem !== 0) {
            this.selectDevice({ page: 1, pageSize: 10 });
          }
          this.tableData.tableData = res.data.tableData;
          this.tableData.total = res.data.totalItem;
        });
    }
  }
};
</script>

<style>
</style>