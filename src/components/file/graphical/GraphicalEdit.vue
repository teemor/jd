<template>
  <div>
    <div>
      <el-row style="margin:20px">
        <el-button size="mini" type="primary" @click="addPlatform">新增</el-button>
        <el-button size="mini" type="warning" @click="editPlatform">修改</el-button>
        <el-button size="mini" type="success" @click="savePlatform">保存</el-button>
      </el-row>
    </div>
    <div style="padding:0 100px 30px 0;margin-top:30px">
      <el-form
        :rules="rules_file_edit"
        ref="platform"
        :model="JSON.stringify(modifyModel)==='{}'?formData:formData=modifyModel"
        label-width="150px"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="图形名称" prop="name">
              <el-input size="mini" v-model="formData.name" placeholder="图形名称" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="12">
          <el-col :span="12">
            <el-form-item label="编号" prop="address">
              <el-input
                size="mini"
                v-model="formData.address"
                placeholder="编号"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="person">
              <el-input size="mini" v-model="formData.person" placeholder="备注" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="12">
          <el-col :span="12">
            <el-form-item label="创建人" prop="person">
              <el-input
                size="mini"
                v-model="formData.person"
                placeholder="创建人"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图形关联" prop="boundary">
              <el-select
                :disabled="disabled"
                size="mini"
                v-model="formData.platformid"
                placeholder="关联平台"
              >
                <el-option
                  size="mini"
                  v-for="item in platformList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="boundary">

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import dict from "@/api/system/dictionary";
import dictonary from "@/mixins/dictonary";
import request from "@/api/file/file";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("platform");
export default {
  mixins: [dictonary],
  data() {
    return {
      imageUrl: "",
      fileList: [],
      disabled: true,
      formData: {
        address: "", // 地址
        name: "", // 名称
        abbreviation: "", // 简称
        person: "", // 负责人
        boundary: "" //界面
      }
    };
  },
  computed: {
    ...mapGetters({
      modifyModel: "modifyModel",
      uploadData: "uploadData",
      updisabled: "updisabled"
    })
  },
  mounted() {},
  watch: {
    disabled: function(val) {
      this.disabled = val;
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(file);
      this.formData.boundary = "http://yz.c.ic.ci/" + file.response;
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl);
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg";

      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG,PNG,GIF,JPEG 格式!");
      }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      return isJPG;
    },

    // 新增
    addPlatform() {
      this.imageUrl = "";
      this.formData.name = "";
      this.formData.abbreviation = "";
      this.formData.boundary = "";
      this.formData.person = "";
      this.formData.address = "";

      this.disabled = false;
      this.add = 1;
      this.edit = 0;
      this.$store.commit("platform/updisabled", true);
    },
    // 修改
    editPlatform() {
      this.edit = 1;
      this.add = 0;
      this.disabled = false;
      this.$store.commit("platform/updisabled", false);
    },

    
    // 保存
    savePlatform() {
      // 添加
      if (this.add === 1) {
        this.$refs.platform.validate(valid => {
          if (valid) {
            this.$store
              .dispatch("platform/addPlatformData", this.formData)
              .then(() => {
                this.disabled = true;
              });
          } else {
          }
        });
      } else {
        // 编辑
        this.$refs.platform.validate(valid => {
          if (valid) {
            this.$store
              .dispatch("platform/EditPlatform", this.formData)
              .then(() => {
                this.disabled = true;
              });
          } else {
          }
        });
      }
    },
    // 删除
    delPlatform() {},
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
