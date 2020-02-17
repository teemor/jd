<template>
  <div>
    <el-form :model="UserForm">
      <el-form-item label="部门" :label-width="formLabelWidth">
        <el-input v-model="UserForm.dpid" autocomplete="off" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="UserForm.uname" autocomplete="off" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input v-model="UserForm.fname" autocomplete="off" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="UserForm.pass" autocomplete="off" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="UserForm.phone" autocomplete="off" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-radio-group v-model="UserForm.state" size="mini">
          <el-radio label="启用">启用</el-radio>
          <el-radio label="停用">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限" :label-width="formLabelWidth">
        <el-input v-model="UserForm.power" autocomplete="off" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addDialog = false">取 消</el-button>
      <el-button type="primary" @click="saveUser">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>