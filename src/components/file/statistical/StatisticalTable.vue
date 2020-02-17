<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="显示列表" name="first">
        <state-show-list />
      </el-tab-pane>
      <el-tab-pane label="总列表" name="second">
        <state-total-list @add="add" @edit="edit" />
      </el-tab-pane>
      <el-tab-pane label="报表编辑" name="Third">
        <state-report-edit />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  methods: {
    add() {
      this.activeName = "Third";
    },
    edit() {
      this.activeName = "Third";
    },
    handleClick() {}
  }
};
</script>
<style>
</style>