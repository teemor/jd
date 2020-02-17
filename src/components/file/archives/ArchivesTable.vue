<template>
  <div id="archives">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="档案" name="first">
        <file-information @add="adds" @edit="edit" @scan="scan" />
      </el-tab-pane>
      <!-- <el-tab-pane label="扫描版内容" name="second">
        <file-pdf :url="url" />
      </el-tab-pane> -->
      <el-tab-pane label="档案编辑" name="third" >
        <file-edit-content/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      activeName: "first",
      add:0
    };
  },
  methods: {
    handleClick() {},
    adds() {
      this.activeName = "third";
    },
    scan(url) {
      // this.activeName = "second";
      this.url = url;
    },
    edit() {
      this.activeName = "third";
    }
  }
};
</script>

<style>
#archives .el-tabs__content {
  padding: 0 !important;
}
</style>