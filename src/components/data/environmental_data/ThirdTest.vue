<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="监测记录" name="first">
        <test-monitoring @deal='deal'/>
      </el-tab-pane>
      <el-tab-pane label="处理" name="second">
        <test-handle/>
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
      handleClick() {
      },
      deal(data, dealData) {
        this.activeName = "second";
        this.$store.commit('environmentdata/signChange', 'deal')
        this.$store.commit('environmentdata/getModify', { data: data, item: dealData })
      },
    }

  }
</script>
<style>

</style>