<template>
  <div>
    <div>
      <el-row style="margin:20px">
        <el-button size="mini" type="primary" @click="addPlatform">新增</el-button>
        <el-button size="mini" type="warning" @click="editPlatform">修改</el-button>
        <el-button size="mini" type="success" @click="saveState">保存</el-button>
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
          <el-col :span="12">
            <el-form-item label="报表名称" prop="name">
              <el-input size="mini" v-model="formData.name" placeholder="报表名称" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报表简称" prop="abbreviation">
              <el-input
                size="mini"
                v-model="formData.abbreviation"
                placeholder="报表简称"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="12">
          <el-col :span="8">
            <el-form-item label="编号" prop="num">
              <el-input size="mini" v-model="formData.num" placeholder="编号" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分类" prop="classification">
              <el-input
                size="mini"
                v-model="formData.classification"
                placeholder="分类"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联报表" prop="relationid">
              <el-select
                :disabled="disabled"
                size="mini"
                v-model="formData.relationid"
                placeholder="关联报表"
              >
                <el-option
                  size="mini"
                  v-for="item in ReportList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="12">
          <el-col :span="8">
            <el-form-item label="创建人" prop="founder">
              <el-input
                size="mini"
                v-model="formData.founder"
                placeholder="创建人"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建日期" prop="creation">
              <el-date-picker
                :disabled="disabled"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                size="mini"
                v-model="formData.creation"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
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
const { mapGetters } = createNamespacedHelpers("state");
export default {
  mixins: [dictonary],
  data() {
    return {
      imageUrl: "",
      fileList: [],
      disabled: true,
      formData: {
        num: "",
        relation: "", // 关联报表
        classification: "", // 分类
        name: "", // 名称
        abbreviation: "", // 简称
        founder: "", // 创建人
        creation: "" //界面
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
  mounted() {
    this.selectReport(); //关联报表
  },
  watch: {
    disabled: function(val) {
      this.disabled = val;
    }
  },
  methods: {
    // 新增
    addPlatform() {
      this.formData.num = "";
      this.formData.abbreviation = "";
      this.formData.relationid = "";
      this.formData.founder = "";
      this.formData.classification = "";
      this.formData.creation = "";
      this.formData.name = "";

      this.disabled = false;
      this.add = 1;
      this.edit = 0;
      this.$store.commit("state/updisabled", true);
    },
    // 修改
    editPlatform() {
      this.edit = 1;
      this.add = 0;
      this.disabled = false;
      this.$store.commit("state/updisabled", false);
    },
    // 保存
    saveState() {
      // 添加
      if (this.add === 1) {
           let data = {}
          data.abbreviation = this.formData.abbreviation
          data.relation = this.formData.relationid
          data.founder = this.formData.founder
          data.classification = this.formData.classification
          data.creation = this.formData.creation
          data.name = this.formData.name
          data.num = this.formData.num
        this.$refs.platform.validate(valid => {
          if (valid) {
            this.$store
              .dispatch("state/addStatistical", data)
              .then(() => {
                this.disabled = true;
              });
          } else {
          }
        });
      } else {
          let data = {}
          data.abbreviation = this.formData.abbreviation
          data.relation = this.formData.relationid
          data.id = this.formData.id
          data.founder = this.formData.founder
          data.classification = this.formData.classification
          data.creation = this.formData.creation
          data.name = this.formData.name
          data.num = this.formData.num
        // 编辑
        this.$refs.platform.validate(valid => {
          if (valid) {
            this.$store
              .dispatch("state/editState", data)
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
