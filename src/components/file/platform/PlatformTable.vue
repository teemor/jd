<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="平台" name="first">
        <platform-info @edit="editPlatform" @platformreport="platformreport" />
      </el-tab-pane>
      <el-tab-pane label="平台报表" name="second">
        <platform-report @edit="editReprot" @skimContent="skimContent" @add="addreport" />
      </el-tab-pane>
      <el-tab-pane label="报表内容" name="Third">
        <platform-content :exceldata="exceldata" />
      </el-tab-pane>
      <el-tab-pane label="上报记录" name="fourth">
        <platform-history />
      </el-tab-pane>
      <el-tab-pane label="平台编辑" name="fifth">
        <platform-edit />
      </el-tab-pane>
      <el-tab-pane label="报表编辑" name="sixth">
        <platform-report-edit />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from "@/api/file/ledger";

export default {
  data() {
    return {
      exceldata: {},
      activeName: "first"
    };
  },
  methods: {
    handleClick() {},
    addreport() {
      this.activeName = "sixth";
    },
    editPlatform() {
      this.activeName = "fifth";
    },
    editReprot() {
      this.activeName = "sixth";
    },
    platformreport() {
      this.activeName = "second";
    },
    // 浏览
    skimContent(data) {
      this.activeName = "Third";
      request.findById(data.reportid).then(res => {
        this.exceldata = res.data;
        console.log(res, "内容");
      });
    }
  }
};
</script>
<style>
</style>