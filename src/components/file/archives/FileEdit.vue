<template>
  <div>
    <span style="margin-left:20px;height:30px;line-height:30px;color:#c9c9c9">修改档案</span>
    <el-form :rules="rules_file_edit" ref="file" :model="modifyModel" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="档案名称" prop="name">
            <el-input
              size="mini"
              v-model.lazy="modifyModel.name"
              placeholder="档案名称"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="档案简称" prop="abbreviation">
            <el-input
              size="mini"
              v-model="modifyModel.abbreviation"
              placeholder="档案简称"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="12">
        <el-col :span="8">
          <el-form-item label="编号" prop="number">
            <el-input
              size="mini"
              v-model="modifyModel.number"
              placeholder="编号"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="版本号" prop="edition">
            <el-input
              size="mini"
              v-model="modifyModel.edition"
              placeholder="版本号"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="位置" prop="position">
            <el-input
              size="mini"
              v-model="modifyModel.position"
              placeholder="位置"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="12">
        <el-col :span="8">
          <el-form-item label="负责人" prop="person">
            <el-input
              size="mini"
              v-model="modifyModel.person"
              placeholder="负责人"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="档案类别" prop="spid">
            <el-cascader
              :disabled="disabled"
              v-model="modifyModel.spid"
              :options="fileDataOptions"
              size="mini"
              change-on-select
              :props="optionProps"
              ref="cascader"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关联设备" prop="device">
            <el-select
              v-model="modifyModel.device"
              placeholder="请选择"
              size="mini"
              :disabled="disabled"
            >
              <el-option
                size="mini"
                v-for="item in equipmentDrain"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关联排污口" prop="sewage">
            <el-select
              v-model="modifyModel.sewage"
              placeholder="请选择"
              size="mini"
              :disabled="disabled"
            >
              <el-option
                size="mini"
                v-for="item in associatedDrain"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经手人" prop="experienced">
            <el-input
              size="mini"
              v-model="modifyModel.experienced"
              placeholder="经手人"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建日期" prop="establish">
            <el-date-picker
              :disabled="disabled"
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
              size="mini"
              v-model="modifyModel.establish"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="修改日期" prop="modify">
            <el-date-picker
              :disabled="disabled"
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
              size="mini"
              v-model="modifyModel.modify"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8" :offset="22">
          <el-button size="mini" type="success" @submit="saveFile">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import dictonary from "@/mixins/dictonary";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState } = createNamespacedHelpers("file");
export default {
  mixins: [dictonary],
  data() {
    return {
      disabled: false,
      formData: {
        spid: "", // 档案级别id
        name: "", // 档案名称
        abbreviation: "", // 档案简称
        number: "", // 编号
        edition: "", // 版本号
        position: "", // 位置
        person: "", // 负责人
        device: "", // 关联设备id
        sewage: "", // 关联排污口id
        experienced: "", // 经手人
        establish: "", // 创建时间
        modify: "" // 修改时间
        // word: "", // word路径
        // pdf: "" // pdf路径
      }
    };
  },
  mounted() {
    this.selectFile();
    this.selectAsso();
    this.selectAllEquip();
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
            modifyModel: "modifyModel",

      // disabled: "editdisabled",
      uploadData: "uploadData",
      updisabled: "updisabled",
      spid: "spid"
    })
  },
  methods: {
    saveFile() {
      this.$refs["cascader"].getCheckedNodes().map(res => {
        this.modifyModel.spid = res.data.id;
        this.$store.commit("file/spid", { spid: res.data.id });
      });
      // 编辑
      this.$refs.file.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("file/EditFile", this.modifyModel)
            .then(() => {});
        } else {
        }
      });
    }
  }
};
</script>

<style>
</style>