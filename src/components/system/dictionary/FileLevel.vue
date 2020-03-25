<template>
  <!-- 档案级别 -->
  <div id="filelevel">
    <!-- 档案级别树形展示 -->
    <div class="fl treebg">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="mini" class="tree-filter"></el-input>
      <el-tree
        :highlight-current="true"
        @node-click="handleNodeClick"
        :data="fileData"
        :props="defaultProps"
        default-expand-all
        class="file-tree"
        :filter-node-method="filterNode"
        ref="file"
      ></el-tree>
    </div>
    <div class="fl" style="padding-left:30px">
      <div style="padding: 40px;">
        <el-button size="mini" type="primary" @click="addFile">新增档案级别</el-button>
        <el-button size="mini" type="primary" @click="editFile">修改档案级别</el-button>
        <el-button size="mini" type="primary" @click="delFile">删除档案级别</el-button>
      </div>
      <!-- 新增档案级别 -->
      <div v-if="add" class="file-form">
        <el-form
          :model="add_file_form"
          label-width="150px"
          ref="addForm"
          :rules="rules"
          :disabled="disabled"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="add_file_form.name" placeholder="名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上级档案" prop="spid">
            <el-cascader
              :options="options"
              :props="{ checkStrictly: true, emitPath: true, label: 'name', value: 'id', key: 'id' }"
              size="mini"
              ref="cascader"
              placeholder="默认一级档案"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="级别" prop="level">
            <el-select v-model="add_file_form.level" placeholder="请选择级别" size="mini">
              <el-option label="一级" value="1"></el-option>
              <el-option label="二级" value="2"></el-option>
              <el-option label="三级" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编号" prop="num">
            <el-input v-model="add_file_form.num" placeholder="编号" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="add_file_form.state" size="mini">
              <el-radio value="1" label="启用">启用</el-radio>
              <el-radio value="0" label="停用">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="add = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="addSaveFile('addForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 修改档案级别 -->
      <div v-if="edit" class="file-form">
        <el-form :model="edit_file_form" label-width="150px" ref="editForm" :rules="rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="edit_file_form.name" placeholder="名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上级档案" prop="spid">
            <el-cascader
              v-model="editfile"
              :options="options"
              :props="{ checkStrictly: true, emitPath: true, label: 'name', value: 'id', key: 'id' }"
              size="mini"
              ref="cascader"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="级别" prop="level">
            <el-select v-model="edit_file_form.level" placeholder="请选择级别" size="mini">
              <el-option label="一级" value="1"></el-option>
              <el-option label="二级" value="2"></el-option>
              <el-option label="三级" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编号" prop="num">
            <el-input v-model="edit_file_form.num" placeholder="编号" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="edit_file_form.state" size="mini">
              <el-radio value="1" label="启用">启用</el-radio>
              <el-radio value="0" label="停用">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="edit = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="editSaveFile('editForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import commonUtils from "@/assets/util/commonUtil";
import request from "@/api/system/file";
export default {
  data() {
    return {
      fileData: [],
      disabled: true,
      add: true,
      defaultProps: {
        children: "children",
        label: "name"
      },
      add_file_form: {
        name: '',
        level: '',
        num: '',
        spid: '',
        state: '启用'
      },
      options: [], //部门
      edit: false,
      edit_file_form: {
        name: "",
        level: "",
        num: "",
        spid: "",
        state: ""
      },
      rules: {
        name: [{ required: true, message: "请输入档案名称", trigger: "blur" }],
        num: [{ required: true, message: "请输入档案编号", trigger: "blur" }],
        level: [{ required: true, message: "请选择级别", trigger: "blur" }],
      },
      filterText: ""
    };
  },
  watch: {
    filterText(val) {
      this.$refs.file.filter(val);
    }
  },
  mounted() {
    this.selectAll();
  },
  methods: {
    // 树状展示
    selectAll() {
      request.selectAll().then(res => {
        this.fileData = res.data.data;
        Object.values(res.data).map(data => {
          data.map(res1 => {
            this.options = data;
            if (res1.children.length == 0) {
              res1.children = undefined;
            } else {
              res1.children.map(res2 => {
                if (res2.children.length == 0) {
                  res2.children = undefined;
                }
              });
            }
          });
        });
      });
    },
    handleNodeClick(data) {
      this.edit_file_form.name = data.name;
      this.edit_file_form.level = data.level;
      this.edit_file_form.num = data.num;
      this.edit_file_form.state = data.state;
      this.edit_file_form.id = data.id;
      this.edit_file_form.spid = data.spid;
      this.editfile = data.spid;
    },
    // 新增档案级别
    addFile() {
      this.disabled = false;
      this.add = true;
      this.edit = false;
      this.add_file_form = { spid: 0, state: '启用' }
    },
    addSaveFile(formName) {
      this.$refs['cascader'].getCheckedNodes().map((res) => {
        this.add_file_form.spid = res.data.id;
      });
      this.$refs[formName].validate(pass => {
        if (pass) {
          request.addSaveFile(this.add_file_form).then(res => {
            this.selectAll();
            this.add_file_form = { spid: 0, state: "启用" };
            this.add = false;
            this.$commonUtils.setMessage("success", "保存成功");
          });
        } else {
          this.$commonUtils.setMessage("error", "请正确填写信息");
        }
      });
    },
    // 修改档案级别
    editFile() {
      if (this.edit_file_form.name == "") {
        this.$commonUtils.setMessage("info", "请选择修改的档案级别");
      } else {
        this.edit = true;
        this.add = false;
      }
    },
    editSaveFile(formName) {
      this.$refs['cascader'].getCheckedNodes().map((res) => {
        this.edit_file_form.spid = res.data.id;
      })
      if(this.edit_file_form.id === this.edit_file_form.spid) {
        this.$commonUtils.setMessage("warning", "自身不可选为上级");
      } else {
        this.$refs[formName].validate((pass) => {
          if(pass){
            request.editSaveFile(this.edit_file_form).then(res => {
              this.selectAll();
              this.edit = false;
              this.$commonUtils.setMessage("success", "修改成功");
            });
          } else {
            this.$commonUtils.setMessage("error", "修改失败");
          }
        });
      }
      
    },
    // 删除档案级别
    delFile() {
      if (this.edit_file_form.name == "") {
        this.$commonUtils.setMessage("info", "请选择删除的档案级别");
      } else {
        request.jugdeFile({ id: this.edit_file_form.id }).then(res => {
          if (res.data === 1) {
            this.$confirm(
              "此操作将删除该档案级别及其下级档案, 是否继续?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                request.deleteFile(this.edit_file_form).then(res => {
                  this.selectAll();
                  this.$message({ type: "success", message: "删除成功!" });
                  this.edit_file_form = { name: '' };
                });
              })
              .catch(() => {
                this.$message({ type: "info", message: "已取消删除" });
              });
          } else {
            this.$confirm(
              "此操作将删除该档案级别, 是否继续", '提示', {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            ).then(() => {
              request.deleteFile(this.edit_file_form).then(res => {
                this.selectAll();
                this.$message({ type: "success", message: "删除成功!" });
                this.edit_file_form = { name: '' };
              });
            }).catch(() => {
              this.$message({ type: "info", message: "已取消删除" });
            })
          }
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
};
</script>
<style>
#filelevel .treebg {
  border-right: 1px solid #e8e8e8;
  padding: 40px;
  height: 600px;
  background: #f4f4f5;
}
#filelevel .el-tree-node__label{ 
  width: auto !important;
}
#filelevel .file-tree {
  /* position: absolute; */
  padding-left: 20px;
  margin-top: 20px;
}
#filelevel .file-form {
  width: 30%;
  position: absolute;
}
#filelevel .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>