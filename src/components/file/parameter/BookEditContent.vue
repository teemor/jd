<template>
  <div>
    <div>
      <el-row style="margin:20px">
        <el-button size="mini" type="primary" @click="addBook">新增</el-button>
        <!-- <el-button size="mini" type="warning" @click="editFile">修改</el-button> -->
        <!-- <el-button size="mini" type="danger" @click="delFile">删除</el-button> -->
        <!-- <el-button size="mini" type="info" @click="cancel">取消</el-button> -->
      </el-row>
    </div>
    <div>
      <book-add v-if="$store.state.book.addState" />
      <book-edit v-else />
    </div>
  </div>
</template>

<script>
import dict from "@/api/system/dictionary";
import request from "@/api/file/file";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("book");
export default {
  data() {
    return {
      add: 0,
      edit: 0,
      bookLevel: [{ id: 0, name: "无" }],
      approvalData: [{ name: "是", id: 1 }, { name: "否", id: 0 }],
      fileList: [],
      disabled: true,
      formData: {
        name: "", //名称
        abbreviation: "", //简称
        number: "", //编号
        edition: "", //版本号
        position: "", //位置
        person: "", //负责人
        category: "", //类别
        creation: "", //创建时间
        levelid: "", //上级台账
        approval: "", // 是否审批
        calculation: "", // 计算周期
        police: "", //报警预期
        reportid: "", //关联报表
        archivesid: "" //关联档案
      }
    };
  },
  computed: {
    ...mapGetters({
      modifyModel: "modifyModel",
      uploadData: "uploadData",
      updisabled: "updisabled",
      spid: "spid"
    })
  },

  watch: {
    disabled: function(val) {
      this.disabled = val;
    }
  },
  methods: {
    // 新增
    addBook() {
      this.$store.commit("book/addState", { state: true });
      this.$store.commit("file/updisabled", true);
    },
    // 修改
    editFile() {
      this.disabled = false;
      this.$store.commit("file/updisabled", false);
    },

    // 删除
    delFile() {},
    // 取消
    cancel() {},
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleSuccess() {
      this.$commonUtils.setMessage("success", "上传成功");
      this.$store.dispatch("file/selectArchives", { spid: this.formData.spid });
    },
    handleError() {
      this.$commonUtils.setMessage("error", "上传失败");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file, "handlePreview");
    }
  }
};
</script>

<style>
</style>
