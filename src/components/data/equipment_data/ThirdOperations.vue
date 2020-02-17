<template>
<!-- 第三方运维 -->
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="监测记录" name="first">
        <operations-monitoring @deal='deal'/>
      </el-tab-pane>
      <el-tab-pane label="处理" name="second">
        <operations-handle/>
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
        this.$store.commit('thirdoperations/getModify', data)
        this.$store.commit('thirdoperations/signChange', 'deal')
      }
    }

  }
</script>
<style>

</style>