<template>
<!-- 自行维护 -->
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="监测记录" name="first">
        <self-monitoring @deal='deal'/>
      </el-tab-pane>
      <el-tab-pane label="处理" name="second">
        <self-handle/>
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
      handleClick() {},
      deal(data) {
        this.activeName = 'second'
        this.$store.commit('selfmonitor/getModify', data)
        this.$store.commit('selfmonitor/signChange', 'deal')
      }
    }

  }
</script>
<style>

</style>