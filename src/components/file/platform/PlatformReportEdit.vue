<template>
  <div>
    <div>
      <el-row style="margin:20px">
        <el-button size="mini" type="primary" @click="addPlatformReport">新增</el-button>
        <el-button size="mini" type="warning" @click="editPlatformReport">修改</el-button>
        <el-button size="mini" type="success" @click="savePlatformReport">保存</el-button>
      </el-row>
    </div>
    <div style="padding:0 100px 30px 0;margin-top:30px">
      <el-form
        :rules="rules_platform_report_edit"
        ref="platform"
        :model="JSON.stringify(modifyModel)==='{}'?formData:formData=modifyModel"
        label-width="150px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="关联报表" prop="reportid">
              <el-select
                :disabled="disabled"
                size="mini"
                v-model="formData.reportid"
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
          <el-col :span="12">
            <el-form-item label="关联平台" prop="platformid">
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
        <el-row :span="12">
          <el-col :span="12">
            <el-form-item label="关联档案" prop="archivesid">
              <el-cascader
                :disabled="disabled"
                v-model="formData.archivesid"
                :options="fileDataOptions"
                size="mini"
                change-on-select
                :props="optionProps"
                ref="cascader"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报周期" prop="cycle">
              <el-input
                size="mini"
                v-model.number="formData.cycle"
                placeholder="上报周期"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="12">
          <el-col :span="8">
            <el-form-item label="报警预期" prop="expect">
              <el-input
                size="mini"
                v-model.number="formData.expect"
                placeholder="报警预期"
                :disabled="disabled"
              >
                <span slot="suffix">天</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人" prop="person">
              <el-input
                size="mini"
                v-model="formData.person"
                placeholder="负责人"
                :disabled="disabled"
              ></el-input>
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
const { mapGetters } = createNamespacedHelpers("platformreport");
export default {
  mixins: [dictonary],
  data() {
    return {
      imageUrl: "",
      fileList: [],
      disabled: true,
      formData: {
        platformid: "",
        reportid: "", // 地址
        archivesid: "", // 名称
        cycle: "", // 简称
        person: "", // 负责人
        expect: "" //界面
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
    this.selectPlatform(); //关联平台
    this.selectFile(); //关联档案
  },
  watch: {
    disabled: function(val) {
      this.disabled = val;
    }
  },
  methods: {
    // 新增
    addPlatformReport() {
      this.formData.platformid = "";
      this.formData.reportid = "";
      this.formData.archivesid = "";
      this.formData.person = "";
      this.formData.cycle = "";
      this.formData.expect = "";

      this.disabled = false;
      this.add = 1;
      this.edit = 0;
      this.$store.commit("platformreport/updisabled", true);
    },
    // 修改
    editPlatformReport() {
      this.edit = 1;
      this.add = 0;
      this.disabled = false;
      this.$store.commit("platform/updisabled", false);
    },
    // 保存
    savePlatformReport() {
      // this.formData.boundary = this.boundary;
      this.$refs["cascader"].getCheckedNodes().map(res => {
        this.formData.archivesid = res.data.id;
      });
      // 添加
      if (this.add === 1) {
        this.$refs.platform.validate(valid => {
          if (valid) {
            this.$store
              .dispatch("platformreport/addPlatformReportData", this.formData)
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
              .dispatch("platformreport/EditPlatformReport", this.formData)
              .then(() => {
                this.disabled = true;
              });
          } else {
          }
        });
      }
    },
    // 删除
    delPlatformReport() {},
    // 取消
    cancel() {},
    submitUpload() {
      this.$refs.upload.submit();
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
  width: 308px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 308px;
  height: 178px;
  display: block;
}
</style>
