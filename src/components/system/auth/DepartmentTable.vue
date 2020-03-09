<template>
  <div id="department">
    <div class="fl treebg" style="width:230px;margin-right:20px">
      <el-input placeholder="输入关键字进行过滤" size="mini" v-model="filterText"></el-input>
      <el-tree
        @node-click="handleNodeClick"
        class="filter-tree"
        :data="DepartData"
        default-expand-all
        :filter-node-method="filterNode"
        :props="defaultProps"
        ref="tree2"
      ></el-tree>
    </div>
    <div class="fl" style="padding-left:30px">
      <div style="padding:30px">
        <el-button size="mini" type="primary" @click="addDepart">新增部门</el-button>
        <el-button size="mini" type="primary" @click="editDepart">修改部门</el-button>
        <el-button size="mini" type="primary" @click="delDepart">删除</el-button>
      </div>
      <div v-if="add==true" style="padding-left:30px">
        <el-form :model="formInline" ref="dep" :rules="rules" class="form-line">
          <el-form-item label="部门名称" prop="name">
            <el-input
              size="mini"
              v-model="formInline.name"
              maxlength="25"
              show-word-limit
              placeholder="部门名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="上级部门" prop="spid">
            <el-cascader
              v-model="formInline.spid"
              :options="fileDpOptions"
              size="mini"
              change-on-select
              clearable
              :props="optionProps"
              ref="cascader"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="部门编码" prop="code">
            <el-input size="mini" v-model="formInline.code" placeholder="部门编码"></el-input>
          </el-form-item>
          <el-form-item label="排序码" prop="level">
            <el-input size="mini" v-model.number="formInline.level" placeholder="排序码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="fr" size="mini" type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="fl" v-if="edit==1" style="padding-left:30px">
        <el-form :model="editInline" ref="dep" :rules="rules" class="form-line">
          <el-form-item label="部门名称" prop="name">
            <el-input size="mini" v-model="editInline.name" placeholder="员工姓名"></el-input>
          </el-form-item>
          <el-form-item label="上级部门" prop="spid">
            <el-cascader
              v-model="editInline.spid"
              :options="fileDpOptions"
              size="mini"
              change-on-select
              clearable
              :props="optionProps"
              ref="cascader"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="部门编码" prop="code">
            <el-input size="mini" v-model="editInline.code" placeholder="部门编码"></el-input>
          </el-form-item>
          <el-form-item label="排序码" prop="level">
            <el-input size="mini" v-model="editInline.level" placeholder="部门编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="fr" size="mini" type="primary" @click="editDep">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import commonUtils from "@/assets/util/commonUtil";
import dictonary from "@/mixins/dictonary";
import request from "@/api/system/department";
export default {
  mixins: [dictonary],
  data() {
    return {
      Sdp: 0,
      first: "",
      second: "",
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入部门编码", trigger: "blur" }],
        level: [
          {
            required: true,
            message: "请输入排序码",
            trigger: "blur"
          },
          {
            type: "number",
            message: "排序码用数字",
            trigger: "blur"
          }
        ]
      },
      add: 0,
      edit: 0,
      formInline: {
        name: "",
        spid: 0,
        code: "",
        level: ""
      },
      editInline: {
        name: "",
        spid: 0,
        code: "",
        level: 0
      },
      filterText: ""
    };
  },

  mounted() {
    this.selectDpTree();
    this.selectDep();
    this.selectDepId(0);
    // this.selectAddAuth();
  },
  methods: {
    // 编辑部门维护
    showSp() {
      this.Sdp = 1;
      console.log(this.Sdp, "this.sdp");
    },
    // 删除部门
    delDepart() {
      if (this.editInline.name == "") {
        this.$commonUtils.setMessage("info", "请选择删除的部门");
      } else {
        request.deleteAll({ id: this.editInline.id }).then(res => {
          if (res.data === "can") {
            this.$confirm("部门下面有子部门， 是否全部删除?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                request.deletedp({ id: this.editInline.id }).then(res => {
                  if (res.data === "delete") {
                    this.$commonUtils.setMessage("success", "删除成功");
                    this.selectDep({});
                    this.selectDepId(0);
                    this.selectDpTree();
                  }
                });
              })
              .catch(() => {
                this.$commonUtils.setMessage("info", "已取消删除");
              });
          } else {
            this.$confirm("确认删除部门？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                request.deletedp({ id: this.editInline.id }).then(res => {
                  if (res.data === "delete") {
                    this.$commonUtils.setMessage("success", "删除成功");
                    this.selectDep({});
                    this.selectDepId(0);
                    this.selectDpTree();
                  }
                });
              })
              .catch(() => {
                this.$commonUtils.setMessage("info", "已取消删除");
              });
          }
        });
      }
    },
    handleNodeClick(data) {
      console.log(data, "dat");
      // 无上级
      // if (data.name == "") {
      //   this.formInline.name = "";
      //   this.formInline.spid = 0;
      // } else if (data.name != "") {
      this.editInline.name = data.name;
      this.editInline.level = data.level;
      this.editInline.code = data.code;
      this.editInline.spname = data.spname;
      this.editInline.spid = data.spid;
      this.editInline.id = data.id;
      // }
      console.log(data, "data");
      this.add = 0;
      this.edit = 0;
    },
    addDepart() {
      this.edit = 0;
      this.add = 1;
    },
    editDepart() {
      if (this.editInline.name == "") {
        this.$commonUtils.setMessage("info", "请选择修改的部门");
      } else {
        this.Sdp = 0;
        this.edit = 1;
        this.add = 0;
      }
    },
    /**
     * 修改部门
     */
    editDep() {
      console.log(this.first, "this.first");
      console.log(this.second, "this.second");
      console.log(this.editInline, "??");
      this.$refs.dep.validate(valid => {
        this.$refs["cascader"].getCheckedNodes().map(res => {
          this.editInline.spid = res.data.id;
        });
        if (valid) {
          request.updatedp(this.editInline).then(res => {
            this.selectDep({});
            this.selectDepId(0);
            this.selectDpTree();
            this.edit = 0;
            if (res.data === "repeat") {
              this.$commonUtils.setMessage("error", "重复字段");
            } else {
              this.$commonUtils.setMessage("success", "修改成功");
            }
          });
        } else {
          this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
        }
      });
    },
    onSubmit() {
      /**
       * 新增部门
       */
      this.$refs.dep.validate(valid => {
        if (valid) {
          this.$refs["cascader"].getCheckedNodes().map(res => {
            this.formInline.spid = res.data.id;
          });
          if (this.formInline.spid.length == 0) {
            this.formInline.spid = 0;
          }
          this.adddep(this.formInline);
        } else {
          this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
        }
      });
    },
    adddep(data) {
      request.adddp(data).then(res => {
        if (res.data === "insert") {
          this.$commonUtils.setMessage("success", "添加成功");
          this.formInline.name = "";
          this.formInline.spid = 0;
          this.formInline.first = 0;
          this.formInline.second = 0;
          this.formInline.code = "";
          this.formInline.level = "";
          this.add = 0;
          this.selectDpTree();
          this.selectDep({});
          this.selectDepId(0);
        } else if (res.data === "repeat") {
          this.$commonUtils.setMessage("error", "重复数据");
        }
      });
    },
    paginationChange() {}
  }
};
</script>

<style>
#department .treebg {
  width: 200px;
  border-right: 1px solid #e8e8e8;
  padding: 40px;
  height: 600px;
  background: #f4f4f5;
}
#department .form-line .el-input {
  margin-left: 80px;
}
.form-line {
  width: 700px;
}
#department .el-form-item .el-button {
  margin-right: -80px;
  margin-top: 30px;
}
</style>