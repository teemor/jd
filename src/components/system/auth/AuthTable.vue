<template>
  <div>
    <div class="btn_contain">
      <el-button size="mini" type="primary" @click="addAuth">新增权限</el-button>
      <el-button size="mini" type="primary" @click="deleteAllAuth">批量删除</el-button>
    </div>
    <div style="float:left;width:100%">
      <general-table
        :body="tableData"
        :showPagination="true"
        :total="tableData.total"
        @paginationChange="paginationChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editAuth(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-popconfirm
              confirmButtonText="好的"
              @onConfirm="deleteAuth(scope.row)"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              title="确定删除吗？"
            >
              <el-button type="text" icon="el-icon-delete" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <div>
      <!-- 添加 -->
      <el-dialog title="添加权限" :visible.sync="authDialog">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          :rules="rules"
          ref="forms"
        >
          <el-form-item label="角色" prop="name">
            <el-input size="mini" v-model="formInline.name" placeholder="角色"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input size="mini" v-model="formInline.remarks" placeholder="备注"></el-input>
          </el-form-item>
          <el-tree ref="tree" :data="authTree" show-checkbox node-key="id"></el-tree>
          <el-button size="mini" type="primary" @click="addAuthData()">保存</el-button>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <!-- 修改 -->
      <grace-dialog
        :editForm="editForm"
        :authTree="authTree"
        dialog:title="修改权限"
        @edit-auth="editAuthData"
        :dialog:visible.sync="authEditDialog"
        dialog:is="edit-auth"
      ></grace-dialog>
    </div>
  </div>
</template>

<script>
import request from "@/api/system/auth";
import menu from "@/api/system/system";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("system");
export default {
  computed: {
    ...mapGetters(["menuData"])
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请填写角色", trigger: "blur" }]
      },
      authEditDialog: false,
      formInline: {
        name: "",
        remarks: ""
      },
      editForm: {
        name: "",
        remarks: "",
        groups: ""
      },
      authTree: [],
      authData: [],
      authDialog: false,
      form: {
        page: 1,
        pageSize: 10
      },
      idBatch: "",
      tableData: {
        header: [
          {
            prop: "name",
            value: "角色"
          },
          {
            prop: "remarks",
            value: "备注"
          }
        ],
        tableData: [],
        total: 0
      }
    };
  },
  mounted() {
    this.selectAuth({});
    this.selectTree();
  },
  methods: {
    // 多选操作
    handleSelectionChange(val) {
      this.idBatch = val.map(item => {
        return item.id;
      });
    },
    // 批量删除
    deleteAllAuth() {
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
              .deleteAllAuth({ idBatch: this.idBatch.join() })
              .then(res => {
                if (res.data === "deleteBatch!!") {
                  this.$commonUtils.setMessage("success", "删除成功");
                  this.selectAuth({});
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
    deleteAuth(data) {
      let id = data.id;
      request.deleteAuth({ id: id }).then(res => {
        if (res.data === "delete") {
          this.$commonUtils.setMessage("success", "删除成功");
          this.selectAuth({
            page: this.form.page,
            pageSize: this.form.pageSize
          });
        }
      });
    },
    // 分页
    paginationChange(page, pageSize) {
      this.form.page = page;
      this.form.pageSize = pageSize;
      this.selectAuth({ page: page, pageSize: pageSize });
    },
    // 添加
    addAuth() {
      this.authDialog = true;
      this.formInline.name = "";
      this.formInline.remarks = "";
    },
    addAuthData() {
      this.$refs.forms.validate(valid => {
        if (valid) {
          let groups = this.$refs.tree.getCheckedNodes().map(item => {
            return item.id;
          });
          this.formInline.groups = groups.join();
          request.addAuth(this.formInline).then(res => {
            if (res.data === "insert") {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.authDialog = false;
              this.selectAuth({});
            } else if (res.data === "repeat") {
              this.$commonUtils.setMessage("info", "重复字段");
            }
          });
        } else {
          this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
        }
      });
    },
    // 编辑
    editAuth(data) {
      this.authEditDialog = true;
      this.editForm = data;
      // this.editForm.groups = data.groups.length > 1 ? data.groups.split(",") : data.groups[0];
      // console.log( data.groups.split(","),'??')
      this.editForm.groups = data.groups.split(",");
    },
    editAuthData() {
      this.selectAuth({});
      this.authEditDialog = false;
    },
    Data() {
      this.authDialog = true;
    },
    selectTree() {
      request.wholeTree().then(res => {
        this.authTree = res.data.data;
      });
    },
    selectAuth(model) {
      request
        .selectAuth(JSON.stringify(model) == "{}" ? this.form : model)
        .then(res => {
          if (res.data.tableData.length === 0 && res.data.totalItem !== 0) {
            this.selectAuth({ page: 1, pageSize: 10 });
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