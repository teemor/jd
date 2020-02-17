<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="数据显示" name="first">
        <data-show/>
      </el-tab-pane>
      <el-tab-pane label="历史数据" name="second">
        <mainhistory-table/>
      </el-tab-pane>
      <el-tab-pane label="预警曲线" name="third">
      <main-curve-table/>
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
    handleClick() {}
  }
};
</script>

<style>
.el-tabs__item.is-active,.el-tabs__item:hover,.el-select-dropdown__item.selected,.el-menu-item.is-active,.el-pager li.active{
  color: #6eaaab;
}
.el-input__inner:focus,.el-select .el-input.is-focus .el-input__inner,.el-select .el-input__inner:focus,.el-textarea__inner:focus{
  border-color:  #6eaaab;
}
.el-menu-item:focus, .el-menu-item:hover{
  background-color: rgba(224,236,236,0.5);
}
</style>