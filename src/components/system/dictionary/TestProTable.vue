<template>
  <div>
    <div class="btn_contain">
      <el-button size="mini" type="primary" @click="addItems">新增</el-button>
      <el-button size="mini" type="primary" @click="deleteAllItems">批量删除</el-button>
    </div>
    <div style="float:left;width:100%">
      <general-table
        :body="tableData"
        :showPagination="true"
        :total="tableData.total"
        @paginationChange="paginationChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editItems(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="small"
              @click="deleteItems(scope.row)"
            >
              <template>删除</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <div>
      <!-- 添加 -->
      <el-dialog title="添加检测项目" :visible.sync="ItemsDialog">
        <el-form
          autocomplete="off"
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          :rules="rules"
          ref="items"
        >
          <el-form-item label="项目编号" prop="projectNumber">
            <el-input size="mini" v-model="formInline.projectNumber" placeholder="项目编号"></el-input>
          </el-form-item>
          <el-form-item label="数据仓编号" prop="dataNumber">
            <el-input size="mini" v-model="formInline.dataNumber" placeholder="数据仓编号"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input size="mini" v-model="formInline.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="是否在线" prop="line">
            <el-select v-model="formInline.line" placeholder="请选择" size="mini" @change="lineChange">
              <el-option
                size="mini"
                v-for="item in lineData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="标准值"
            prop="standard"
            :rules="[{ type: 'number', message: '标准值必须为数字值'},{required: true, validator: standvalue, trigger: 'blur' }]"
          >
            <el-input
              size="mini"
              type="number"
              v-model.number="formInline.standard"
              placeholder="标准值"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="company">
            <el-input size="mini" v-model="formInline.company" placeholder="单位"></el-input>
          </el-form-item>
        </el-form>
        <el-button size="mini" type="primary" @click="addItemsData">保存</el-button>
      </el-dialog>
    </div>
    <div>
      <!-- 修改 -->
      <el-dialog title="修改检测项目" :visible.sync="ItemsEditDialog">
        <el-form
          :inline="true"
          :model="editForm"
          class="demo-form-inline"
          :rules="rules"
          ref="items"
        >
          <el-form-item label="项目编号" prop="projectNumber">
            <el-input size="mini" v-model="editForm.projectNumber" placeholder="项目编号"></el-input>
          </el-form-item>
          <el-form-item label="数据仓编号" prop="dataNumber">
            <el-input size="mini" v-model="editForm.dataNumber" placeholder="数据仓编号"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input size="mini" v-model="editForm.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="是否在线" prop="line">
            <el-select v-model="editForm.line" placeholder="请选择" size="mini" @change="lineChange">
              <el-option
                size="mini"
                v-for="item in lineData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="标准值"
            prop="standard"
            :rules="{required: true, validator: standvalue, trigger: 'blur' }"
          >
            <el-input
              size="mini"
              type="number"
              v-model.number="editForm.standard"
              placeholder="标准值"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="company">
            <el-input size="mini" v-model="editForm.company" placeholder="单位"></el-input>
          </el-form-item>
        </el-form>
        <el-button size="mini" type="primary" @click="editItemsData">保存</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import commonUtils from "@/assets/util/commonUtil";
import request from "@/api/system/items";
import validate from "@/mixins/validate";
import dictonary from "@/mixins/dictonary";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("system");
export default {
  mixins: [validate, dictonary],
  computed: {
    ...mapGetters(["menuData"])
  },
  data() {
    return {
      rules: {},
      ItemsEditDialog: false,
      formInline: {
        line: "", //是否在线
        projectNumber: "",
        dataNumber: "",
        name: "",
        standard: "",
        company: ""
      },
      editForm: {
        line: "", //是否在线
        projectNumber: "",
        dataNumber: "",
        name: "",
        standard: "",
        company: ""
      },
      ItemsTree: [],
      ItemsData: [],
      ItemsDialog: false,
      form: {
        page: 1,
        pageSize: 10
      },
      idBatch: "",
      tableData: {
        header: [
          {
            prop: "projectNumber",
            value: "项目编号"
          },
          {
            prop: "dataNumber",
            value: "数据仓编号"
          },
          {
            prop: "name",
            value: "名称"
          },
          {
            prop: "standard",
            value: "标准值"
          },
          {
            prop: "company",
            value: "单位"
          }
        ],
        tableData: [],
        total: 0
      }
    };
  },
  created() {
    this.selectItems({});
    this.selectTree();
    // this.selectAddItems();
  },
  methods: {
    // 多选操作
    handleSelectionChange(val) {
      this.idBatch = val.map(item => {
        return item.id;
      });
    },
    // 批量删除
    deleteAllItems() {
      if (this.idBatch == "") {
        this.$message({
          type: "warning",
          message: "请选择删除的项目!"
        });
      } else {
        this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request
              .deleteAllItems({ idBatch: this.idBatch.join() })
              .then(res => {
                if (res.data === "deleteBatch!!") {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.selectItems({});
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
    deleteItems(data) {
      let id = data.id;
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request.deleteItems({ id: id }).then(res => {
            if (res.data === "delete") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.selectItems({});
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
      this.selectItems({ page: page, pageSize: pageSize });
    },
    // 添加
    addItems() {
      this.ItemsDialog = true;
      this.$refs.items.resetFields();
      // this.formInline.classification = ""; // 分类
      // this.formInline.line = "";
      // this.formInline.projectNumber = "";
      // this.formInline.dataNumber = "";
      // this.formInline.name = "";
      // this.formInline.standard = "";
      // this.formInline.company = "";
    },
    addItemsData() {
      console.log(this.formInline, "表单提交");
      this.$refs.items.validate(valid => {
        if (valid) {
          request.addItems(this.formInline).then(res => {
            if (res.data === "insert") {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.ItemsDialog = false;
              this.selectItems({});
            } else if (res.data === "repeat") {
              this.$message({
                type: "info",
                message: "重复字段"
              });
            }
            console.log(res, "res");
          });
        } else {
          this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
        }
      });
    },
    // 查询
    // selectAddItems(tab, event) {
    //   menu.secondMenuData(2).then(res => {
    //     this.ItemsTree = res.data.data;
    //   });
    // },
    // 编辑
    editItems(data) {
      this.ItemsEditDialog = true;
      this.editForm.projectNumber = data.projectNumber
      this.editForm.dataNumber = data.dataNumber
      this.editForm.name = data.name
      this.editForm.standard = data.standard
      this.editForm.company = data.company
      this.editForm.line= data.line
      console.log(data, "ata");
    },
    editItemsData() {
      request
        .updateItems({
          projectNumber: this.editForm.projectNumber,
          dataNumber: this.editForm.dataNumber,
          standard: this.editForm.standard,
          company: this.editForm.company,
          name: this.editForm.name,
          id: this.editForm.id,
          line: this.editForm.line
        })
        .then(res => {
          if (res.data === "update") {
            this.$commonUtils.setMessage("success", "修改成功");
            this.ItemsEditDialog = false;
            this.selectItems({});
          } else {
            this.$commonUtils.setMessage("error", "修改失败");
          }
          this.selectItems();
        });
    },
    Data() {
      this.ItemsDialog = true;
    },

    selectItems(model) {
      request
        .selectItems(JSON.stringify(model) == "{}" ? this.form : model)
        .then(res => {
          if (res.data.tableData.length === 0 && res.data.totalItem !== 0) {
            this.selectItems({ page: 1, pageSize: 10 });
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