<template>
  <div>
    <div class="btn_contain">
      <el-button size="mini" type="primary" @click="addUser">新增员工</el-button>
      <el-button size="mini" type="primary" @click="deleteAllUser">批量删除</el-button>
    </div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input size="mini" v-model="formInline.user" placeholder="员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input size="mini" v-model="formInline.department" placeholder="所属部门"></el-input>
          <!-- <el-cascader
            v-model="formInline.department"
            :options="fileDpOptions"
            size="mini"
            change-on-select
            clearable
            :props="optionProps"
            ref="cascader"
          ></el-cascader>-->
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchUser">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <general-table
        @state="statusUser"
        :showcheck="showcheck"
        :body="tableData"
        :showPagination="true"
        :total="tableData.total"
        @paginationChange="paginationChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editUser(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="small"
              @click="deleteUser(scope.row)"
            >
              <template>删除</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <el-dialog title="新增用户" :visible.sync="addDialog">
      <el-form :model="UserForm" label-width="70px" ref="user">
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-cascader
            v-model="UserForm.dpid"
            :options="fileDpOptions"
            size="mini"
            change-on-select
            :props="optionProps"
            ref="cascader"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="uname"
          :rules="[{ required: true, message:'请输入用户名', trigger: 'blur' }]"
        >
          <el-input v-model="UserForm.uname" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item
          label="姓名"
          :label-width="formLabelWidth"
          prop="fname"
          :rules="[{ required: true, message:'请输入姓名', trigger: 'blur' }]"
        >
          <el-input v-model="UserForm.fname" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="pass"
          :rules="[{ required: true, message:'请输入密码', trigger: 'blur' }]"
        >
          <el-input type="password" v-model="UserForm.pass" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
          prop="phone"
          :rules="[{ required: true, validator: telephone, trigger: 'blur' }]"
        >
          <el-input v-model="UserForm.phone" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio-group v-model="UserForm.state" size="mini">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-select v-model="UserForm.power" placeholder="请选择" size="mini">
            <el-option
              v-for="item in authData"
              :key="parseInt(item.id)"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialog">
      <el-form :model="editForm" ref="user">
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-cascader
            v-model="editForm.dpid"
            :options="fileDpOptions"
            size="mini"
            change-on-select
            :props="optionProps"
            ref="cascader"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="uname"
          :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.uname" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item
          label="姓名"
          :label-width="formLabelWidth"
          prop="fname"
          :rules="[{ required: true, message:'请输入姓名', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.fname" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="pass"
          :rules="[{ required: true, message:'请输入密码', trigger: 'blur' }]"
        >
          <el-input type="password" v-model="editForm.pass" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
          prop="phone"
          :rules="[{ required: true, validator: telephone, trigger: 'blur' }]"
        >
          <el-input v-model="editForm.phone" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.state" size="mini">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-select v-model="editForm.powerid" placeholder="请选择" size="mini">
            <el-option v-for="item in authData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSaveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/api/system/system";
import auth from "@/api/system/auth";
import validate from "@/mixins/validate";
import dictonary from "@/mixins/dictonary";
export default {
  mixins: [validate, dictonary],
  data() {
    return {
      model: {},
      showcheck: true, //多选删除
      authData: [],
      UserForm: {
        dpid: "",
        uname: "",
        fname: "",
        pass: "",
        phone: "",
        state: "启用",
        power: ""
      },
      fisrt: "",
      second: "",
      third: "",
      editForm: {
        dpid: "",
        uname: "",
        fname: "",
        pass: "",
        phone: "",
        state: "启用",
        powerid: ""
      },
      formLabelWidth: "80px",
      addDialog: false,
      editDialog: false,
      stateModel: {
        state: "",
        id: ""
      },
      statusDialog: false,
      form: {
        page: 1,
        pageSize: 10
      },
      formInline: {
        user: "",
        department: ""
      },
      idBatch: "",
      tableData: {
        header: [
          {
            prop: "dp",
            value: "部门"
          },
          {
            prop: "fname",
            value: "姓名"
          },
          {
            prop: "phone",
            value: "用户手机号"
          },
          {
            prop: "state",
            value: "状态"
          },
          {
            prop: "uname",
            value: "用户名"
          }
        ],
        tableData: [],
        total: 0
      }
    };
  },
  mounted() {
    this.selectDpTree(); //运维部门
    this.selectUser({});
    this.authSelect();
  },
  methods: {
    // 删除
    deleteUser(data) {
      let id = data.id;
      this.$confirm("此操作将永久删除该用户 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request.deleteUser({ id: id }).then(res => {
            if (res.data === "delete") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.selectUser({});
            }
          });
        })
        .catch(() => {
          this.$commonUtils.setMessage("info", "已取消删除");
        });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.idBatch = val.map(item => {
        return item.id;
      });
    },
    // 批量删除
    deleteAllUser() {
      if (this.idBatch == "") {
        this.$message({
          type: "warning",
          message: "请选择删除的用户!"
        });
      } else {
        this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request
              .deleteAllUser({ idBatch: this.idBatch.join() })
              .then(res => {
                if (res.data === "deleteBatch!!") {
                  this.$commonUtils.setMessage("success", "删除成功");
                  this.selectUser({});
                }
              });
          })
          .catch(() => {
            this.$commonUtils.setMessage("info", "已取消删除");
          });
      }
    },
    // 角色字典表
    authSelect() {
      auth.selectAll().then(res => {
        console.log(res, "res");
        this.authData = res.data.tableData;
      });
    },
    // 查询
    searchUser() {
      // this.$refs["cascader"].getCheckedNodes().map(res => {
      //   this.formInline.department = res.data.id;
      // });
      this.formInline.page = this.form.page;
      this.formInline.pageSize = this.form.pageSize;
      if (this.formInline.user == "" && this.formInline.department == "") {
        this.selectUser({});
      } else {
        request.selectUserModel(this.formInline).then(res => {
          this.tableData.tableData = res.data.tableData;
          this.tableData.total = res.data.totalItem;
          // this.authData = res.data.tableData;
        });
      }
    },
    // 添加用户
    addUser: function() {
      this.addDialog = true;
      this.UserForm.dpid = "";
      this.UserForm.uname = "";
      this.UserForm.fname = "";
      this.UserForm.pass = "";
      this.UserForm.phone = "";
      this.UserForm.state = "启用";
      this.UserForm.power = "";
    },
    // 添加用户
    saveUser() {
      this.$refs["cascader"].getCheckedNodes().map(res => {
        this.UserForm.dpid = res.data.id;
      });
      this.$refs.user.validate(valid => {
        if (valid) {
          request.addUser(this.UserForm).then(res => {
            if (res.data === "insert") {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.addDialog = false;
              this.selectUser({});
            } else if (res.data === "repeat") {
              this.$commonUtils.setMessage("info", "重复字段");
            }
          });
        } else {
          this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
        }
      });
    },
    // 启停用户

    statusUser(data) {
      request.statusUser({ id: data.id }).then(res => {
        this.$message({
          type: "success",
          message: `${data.state == "停用" ? "启用" : "停用"}成功!`
        });
        this.selectUser({});
      });
    },
    // 修改用户表
    editUser(data) {
      this.editForm.id = data.id;
      this.editForm.dpid = data.dpid;
      this.editForm.uname = data.uname;
      this.editForm.fname = data.fname;
      this.editForm.pass = data.pass;
      this.editForm.phone = data.phone;
      this.editForm.state = data.state;
      this.editForm.powerid = data.powerid;
      this.editDialog = true;
    },
    editSaveUser() {
      // 修改用户
      this.model.id = this.editForm.id;
      this.model.dpid = this.editForm.dpid;
      this.model.uname = this.editForm.uname;
      this.model.fname = this.editForm.fname;
      this.model.pass = this.editForm.pass;
      this.model.phone = this.editForm.phone;
      this.model.state = this.editForm.state;
      this.model.power = this.editForm.powerid;
      this.$refs["cascader"].getCheckedNodes().map(res => {
        this.model.dpid = res.data.id;
      });
      this.$refs.user.validate(valid => {
        if (valid) {
          request.updateUser(this.model).then(res => {
            if (res.data === "update") {
              this.$commonUtils.setMessage("success", "修改成功");
              // commit('updisabled', false)
              this.selectUser({});
            } else {
              commonUtils.setMessage("warnning", "修改失败");
            }
            this.editDialog = false;
          });
        } else {
          this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
        }
      });
    },
    // 分页查询
    paginationChange(page, pageSize) {
      this.form.page = page;
      this.form.pageSize = pageSize;
      this.selectUser(this.form);
    },
    // 查询用户表格
    selectUser(model) {
      request
        .selectUser(JSON.stringify(model) == "{}" ? this.form : model)
        .then(res => {
          if (res.data.tableData.length === 0 && res.data.totalItem !== 0) {
            this.selectUser({ page: 1, pageSize: 10 });
          }
          this.tableData.tableData = res.data.tableData;
          this.tableData.total = res.data.totalItem;
        });
    },
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>

<style>
</style>
