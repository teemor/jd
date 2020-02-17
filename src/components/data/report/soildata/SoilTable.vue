<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="数据显示" name="first">
        <soil-data-table/>
      </el-tab-pane>
      <el-tab-pane label="历史数据" name="second">
        <soil-history-table/>
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
  }
</script>