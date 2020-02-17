<template>
<!-- 记录管理 -->
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="处理记录" name="first">
        <disposition-record @deal='deal'/>
      </el-tab-pane>
      <el-tab-pane label="处理" name="second">
        <handle/>
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
        this.activeName = "second";
        this.$store.commit('warnrecord/getModify', data)
        this.$store.dispatch('warnrecord/getUser', data)
      }
    }

  }
</script>
<style>

</style>