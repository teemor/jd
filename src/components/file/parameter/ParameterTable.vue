<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="总表" name="first">
        <total-book @add="add" @viewSub="viewSub" @skimContent="skimContent" @edit="edit" />
      </el-tab-pane>
      <el-tab-pane label="分表" name="second">
        <sub-book @add="add" @editSub="editSub" @skimContent="skimContent" />
      </el-tab-pane>
      <el-tab-pane label="内容" name="Third" >
        <content-table :exceldata="exceldata"/>
      </el-tab-pane>
      <!-- <el-tab-pane label="总表历史" name="fourth">
        <total-history-book />
      </el-tab-pane>
      <el-tab-pane label="分表历史" name="fifth">
        <sub-history-book />
      </el-tab-pane>-->
      <el-tab-pane label="创建" name="sixth">
        <book-edit-content />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dictonary from "@/mixins/dictonary";
import request from "@/api/file/ledger";
export default {
  mixins: [dictonary],
  data() {
    return {
      exceldata:{},
      activeName: "first"
    };
  },
  methods: {
    // 浏览
    skimContent(data) {
      this.activeName = "Third";
      request.findById(data.reportid).then(res=>{
        this.exceldata=res.data
        console.log(res,'内容')
      })
    },
    // 查看分表
    viewSub(data) {
      this.activeName = "second";
      this.$store.commit("subbook/getId", data.id);
      this.$store.dispatch("subbook/getbookData", data.id);
    },
    editSub(data) {
      this.activeName = "sixth";
      this.$store.commit("subbook/getModifyBookData", data);
      this.$store.commit("book/getModifyBookData", {});
    },
    edit(data) {
      this.activeName = "sixth";
      this.selectBook();
      data.levelid = 0;
      this.$store.commit("book/getModifyBookData", data);
      this.$store.commit("subbook/getModifyBookData", {});
    },
    add() {
      this.activeName = "sixth";
    },
    handleClick(tab, event) {
      if (tab.name === "sixth") {
        this.selectBook();
      }
    }
  }
};
</script>
<style>
</style>