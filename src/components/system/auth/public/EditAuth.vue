<template>
  <div>
    <el-form :inline="true" :model="editModel" class="demo-form-inline" :rules="rules" ref="form">
      <el-form-item label="角色" prop="name">
        <el-input size="mini" v-model="editModel.name" placeholder="角色"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input size="mini" v-model="editModel.remarks" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <el-tree
      ref="editTree"
      :data="authTree"
      :default-checked-keys="editModel.groups"
      show-checkbox
      node-key="id"
    ></el-tree>
    <el-button size="mini" type="primary" @click="editAuthData">保存</el-button>
  </div>
</template>

<script>
import request from "@/api/system/auth";

export default {
  props: {
    editForm: Object,
    authTree: Array
  },
  data() {
    return {
      editModel: {},
      rules: {
        name: [{ required: true, message: "请填写角色", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 赋值
    init() {
      this.editModel = this.editForm;
    },
    editAuthData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let groups = this.$refs.editTree.getCheckedNodes().map(item => {
            return item.id;
          });
          // console.log(this.editForm.groups,'this.editForm.groups')
          request
            .updateAuth({
              id: this.editModel.id,
              name: this.editModel.name,
              remarks: this.editModel.remarks,
              groups: groups.join()
            })
            .then(res => {
               this.$commonUtils.setMessage("success", "修改成功");
              this.$emit("edit-auth");
            });
        } else {
          this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
        }
      });
    }
  }
};
</script>

<style>
</style>