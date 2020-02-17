<template>
  <div>
    <div class="btn_contain">
      <el-button size="mini" type="primary" @click="addeRepdia">新增报表</el-button>
      <el-button size="mini" type="primary" @click="deleteAllReport">批量删除</el-button>
    </div>
    <el-dialog title="添加报表" :visible.sync="addDialog" @close="close">
      <div style="width:600px;padding:10px;margin-top:30px">
        <div style="width: 500px;">
          <el-steps :active="active" finish-status="success">
            <el-step title="选择报表名称"></el-step>
            <el-step title="上传报表"></el-step>
          </el-steps>
        </div>
        <div style="height:90px;width:300px;margin-top:30px">
          <div v-if="active===0">
            <el-form class="demo-form-inline" label-width="150px" :model="dataform" ref="report">
              <el-form-item
                label="报表名称"
                prop="name"
                :rules="[{ required: true, message:'请输入报表名称', trigger: 'blur' }]"
              >
                <el-input size="mini" v-model="dataform.name" placeholder="报表名称"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-else-if="active===1">
            <el-upload
              class="upload-demo"
              action="http://yz.c.ic.ci/jdem/jdTesting/report/import"
              :data="uploadData"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <el-button
          style="margin-top: 12px;"
          @click="next"
          :disabled="disabled"
        >{{active==2?'完成':'下一步'}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改报表" :visible.sync="modifyDialog" @close="close">
      <div style="width:600px;padding:10px;margin-top:30px">
        <div style="width: 500px;">
          <el-steps :active="active" finish-status="success">
            <el-step title="选择报表名称"></el-step>
            <el-step title="上传报表"></el-step>
          </el-steps>
        </div>
        <div style="height:90px;width:300px;margin-top:30px">
          <div v-if="active===0">
            <el-form class="demo-form-inline" label-width="150px" :model="editform" ref="report">
              <el-form-item
                label="报表名称"
                prop="name"
                :rules="[{ required: true, message:'请输入报表名称', trigger: 'blur' }]"
              >
                <el-input size="mini" v-model="editform.name" placeholder="报表名称"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-else-if="active===1">
            <el-upload
              class="upload-demo"
              action="http://yz.c.ic.ci/jdem/jdTesting/report/import"
              :data="uploadData"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <el-button
          style="margin-top: 12px;"
          @click="edit"
          :disabled="disabled"
        >{{active==2?'完成':'下一步'}}</el-button>
      </div>
    </el-dialog>

    <div>
      <general-table
        :body="tableData"
        :showPagination="true"
        :total="tableData.total"
        @paginationChange="paginationChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editReport(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-popconfirm
              confirmButtonText="好的"
              @onConfirm="delReport(scope.row)"
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
  </div>
</template>

<script>
import request from "@/api/system/report";
import commonUtils from "@/assets/util/commonUtil";

export default {
  data() {
    return {
      up: false,
      idBatch: [],
      addDialog: false,
      modifyDialog: false,
      uploadData: {},
      active: 0,
      disabled: false,
      dataform: {
        name: ""
      },
      editform: {
        name: "",
        storage: ""
      },
      form: {
        page: 1,
        pageSize: 10
      },
      tableData: {
        header: [
          {
            prop: "name",
            value: "姓名"
          },
          {
            prop: "storage",
            value: "文件"
          }
        ],
        tableData: [],
        total: 0
      }
    };
  },
  mounted() {
    this.selectReport({});
  },
  methods: {
    upStep() {
      this.active = this.active - 1;
    },
    close() {
      this.active = 0;
    },
    // 编辑
    editReport(data) {
      this.modifyDialog = true;
      this.up = false;
      this.editform = data;
      console.log(this.editform);
    },
    edit() {
      if (this.active === 0) {
        this.$refs.report.validate(valid => {
          if (valid) {
            this.uploadData = { id: this.editform.id };
            request
              .updateReport({
                id: this.editform.id,
                name: this.editform.name
              })
              .then(() => {
                this.selectReport({});
              });
            this.active = 1;
            this.up = true;
          } else {
            this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
          }
        });
      } else if (this.active == 1) {
        this.active = 0;
        this.selectReport({});

        this.modifyDialog = false;
      }
    },
    // 多选操作
    handleSelectionChange(val) {
      this.idBatch = val.map(item => {
        return item.id;
      });
    },
    // 批量删除
    deleteAllReport() {
      if (this.idBatch == "") {
        this.$message({
          type: "warning",
          message: "请选择删除的报表!"
        });
      } else {
        this.$confirm("此操作将永久删除该报表, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request
              .deleteAllReport({ idBatch: this.idBatch.join() })
              .then(res => {
                if (res.data === "deleteBatch!!") {
                  this.$commonUtils.setMessage("success", "删除成功");
                  this.selectReport({});
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
    delReport(data) {
      let id = data.id;
      request.deleteReport({ id: id }).then(res => {
        if (res.data === "delete") {
          this.$commonUtils.setMessage("success", "删除成功");
          this.selectReport({});
        }
      });
    },
    // 查询
    selectReport(model) {
      request
        .selectReport(JSON.stringify(model) == "{}" ? this.form : model)
        .then(res => {
          if (res.data.tableData.length === 0 && res.data.totalItem !== 0) {
            this.selectReport({ page: 1, pageSize: 10 });
          }
          this.tableData.tableData = res.data.tableData;
          this.tableData.total = res.data.totalItem;
        });
    },
    addeRepdia() {
      this.addDialog = true;
    },
    // 下一步
    next() {
      // if (this.active++ > 1) this.active = 0;
      if (this.active === 0) {
        this.$refs.report.validate(valid => {
          if (valid) {
            request.addReport(this.dataform).then(res => {
              this.uploadData = { id: res.data.id };
              if (res.data.code == "insert") {
                this.active = 1;
                this.up = true;
                this.selectReport({});
              } else if (res.data.code == "repeat") {
                this.$commonUtils.setMessage("info", "重复字段");
              }
            });
          }
        });
      } else if (this.active == 1) {
        this.active = 0;
        this.form.name = "";
        this.addDialog = false;
      }
    },
    // 分页
    paginationChange(page, pageSize) {
      this.form.page = page;
      this.form.pageSize = pageSize;
      this.selectReport({ page: page, pageSize: pageSize });
    }
  }
};
</script>

<style>
</style>