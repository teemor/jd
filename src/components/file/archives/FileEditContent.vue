<template>
  <div>
    <div>
      <el-row style="margin:20px">
        <el-button size="mini" type="primary" @click="addFile">新增</el-button>
        <!-- <el-button size="mini" type="warning" @click="editFile">修改</el-button>
        <el-button size="mini" type="success" @click="saveFile">保存</el-button>-->
      </el-row>
    </div>
    <div style="padding:0 100px 30px 0;margin-top:30px;border-bottom:1px solid #c9c9c9">
      <file-add v-if="$store.state.file.addState"/>
      <file-edit v-else />
    </div>
    <div style="margin:20px">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="url"
        :on-preview="handlePreview"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :on-error="handleError"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :data="uploadData"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary" :disabled="updisabled">选取文件</el-button>
        <el-button
          :disabled="updisabled"
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传word/pdf文件，且不超过2m</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import dictonary from "@/mixins/dictonary";
import dict from "@/api/system/dictionary";
import request from "@/api/file/file";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("file");
export default {
  mixins: [dictonary],
  data() {
    return {
      formData:{},
      add: 0,
      edit: 0,
      fileList: []
    };
  },
  computed: {
    ...mapGetters({
      modifyModel: "modifyModel",
      uploadData: "uploadData",
      updisabled: "updisabled",
      spid: "spid",
      url:'url'
    })
  },
  mounted() {
    this.selectFile();
    this.selectAsso();
    this.selectAllEquip();
  },
  watch: {
    disabled: function(val) {
      this.disabled = val;
    }
  },
  methods: {
    // 上传校验
    beforeUpload(file) {
      const isJPG =
        file.type === "application/msword" || file.type === "application/pdf";

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传文件只能是 doc,pdf格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG;
    },
    // 新增
    addFile() {
      this.$emit("add");
      this.$store.commit("file/addState", { state: true });
      this.$store.commit("file/updisabled", true);
    },
    // 修改
    editFile() {
      this.$store.commit("file/editdisabled", false);
      this.disabled = false;
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
      this.$store.dispatch("file/getListData", { spid: this.formData.spid });
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
