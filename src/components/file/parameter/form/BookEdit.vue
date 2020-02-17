<template>
  <div>
    <span class="title_span">修改</span>
    <div style="padding:0 100px 30px 0;margin-top:30px;">
      <el-form
        :rules="rules_book_edit"
        ref="file"
        :model="JSON.stringify($store.state.subbook.modifyModel)==='{}'&&JSON.stringify($store.state.book.modifyModel)==='{}'?formData:formData=JSON.stringify($store.state.book.modifyModel)==='{}'?$store.state.subbook.modifyModel:$store.state.book.modifyModel"
        label-width="150px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="台账名称" prop="name">
              <el-input
                size="mini"
                v-model="formData.name"
                @input="myValue.property = $event.target.value"
                placeholder="台账名称"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="台账简称" prop="abbreviation">
              <el-input
                @input="myValue.property = $event.target.value"
                size="mini"
                v-model="formData.abbreviation"
                placeholder="台账简称"
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
                v-model.number="formData.number"
                placeholder="编号"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本号" prop="edition">
              <el-input
                size="mini"
                v-model="formData.edition"
                placeholder="版本号"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="位置" prop="position">
              <el-input
                size="mini"
                v-model="formData.position"
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
                v-model="formData.person"
                placeholder="负责人"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类别" prop="category">
              <el-input
                size="mini"
                v-model="formData.category"
                placeholder="类别"
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
          <el-col :span="8">
            <el-form-item label="上级台账" prop="levelid">
              <el-select
                v-model="formData.levelid"
                placeholder="请选择"
                size="mini"
                :disabled="disabled"
              >
                <el-option
                  size="mini"
                  v-for="item in $store.state.book.bookLevel==[]?bookLevel:$store.state.book.bookLevel"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否审批" prop="approval">
              <el-select
                v-model="formData.approval"
                placeholder="请选择"
                size="mini"
                :disabled="disabled"
              >
                <el-option
                  size="mini"
                  v-for="item in approvalData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计算周期" prop="calculation">
              <el-input
                size="mini"
                v-model.number="formData.calculation"
                placeholder="计算周期"
                :disabled="disabled"
              >
                <!-- <span slot="suffix">天</span> -->
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报警预期" prop="police">
              <el-input
                size="mini"
                v-model="formData.police"
                placeholder="报警预期"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联报表" prop="report">
              <el-select
                v-model="formData.reportid"
                placeholder="关联报表"
                size="mini"
                :disabled="disabled"
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
          <el-col :span="8">
            <el-form-item label="关联档案" prop="archives">
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" :offset="22">
            <el-button size="mini" type="success" @click="clear">清空</el-button>
            <el-button size="mini" type="success" @click="saveBook">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import dictonary from "@/mixins/dictonary";
export default {
  mixins: [dictonary],
  data() {
    return {
      model:{},
      add: 0,
      edit: 0,
      bookLevel: [{ id: 0, name: "无" }],
      approvalData: [{ name: "是", id: 1 }, { name: "否", id: 0 }],
      fileList: [],
      disabled: false,
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
  mounted() {
    this.selectBook(); // 台账字典表
    this.selectFile(); // 关联档案
    this.selectReport(); // 报表
  },
  methods: {
    clear() {
      this.formData.name = "";
      this.formData.abbreviation = "";
      this.formData.number = "";
      this.formData.edition = "";
      this.formData.position = "";
      this.formData.person = "";
      this.formData.category = "";
      this.formData.creation = "";
      this.formData.levelid = "";
      this.formData.approval = "";
      this.formData.calculation = "";
      this.formData.police = "";
      this.formData.report = "";
      this.formData.archives = "";
    },
    // 保存
    saveBook() {
      this.$refs["cascader"].getCheckedNodes().map(res => {
        this.formData.archivesid = res.data.id;
      });

      // 编辑
      //总表分表
      this.$refs.file.validate(valid => {
        if (valid) {
          this.$store.dispatch("book/EditBook", this.formData).then(() => {});
        } else {
        }
      });
    }
  }
};
</script>

<style>
</style>