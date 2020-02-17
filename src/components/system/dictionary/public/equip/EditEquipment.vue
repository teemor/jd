<template>
  <div>
    <el-form ref="equip" :inline="true" :model="editForm" class="demo-form-inline" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input size="mini" v-model="editForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="classification">
        <el-input size="mini" v-model="editForm.classification" placeholder="分类"></el-input>
      </el-form-item>
      <el-form-item label="是否在线" prop="line">
        <el-select v-model="editForm.line" placeholder="请选择" size="mini">
          <el-option
            size="mini"
            v-for="item in lineData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备编号" prop="deviceId">
        <el-input size="mini" v-model="editForm.deviceId" placeholder="设备编号"></el-input>
      </el-form-item>
      <el-form-item label="数据仓编号" prop="warehouse">
        <el-input size="mini" v-model="editForm.warehouse" placeholder="数据仓编号"></el-input>
      </el-form-item>
      <el-form-item label="检测项目" prop="correlationId">
        <el-select v-model="editForm.correlationId" placeholder="请选择" size="mini">
          <el-option
            size="mini"
            v-for="item in correlationId"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运维部门" prop="department">
        <el-input size="mini" v-model="editForm.department" placeholder="运维部门"></el-input>
      </el-form-item>
      <el-form-item label="工艺段" prop="process">
        <el-select size="mini" v-model="editForm.process" placeholder="请选择">
          <el-option
            size="mini"
            v-for="item in process"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="运行状态" prop="state">
        <el-input size="mini" v-model.number="editForm.state" placeholder="运行状态"></el-input>
      </el-form-item>
      <el-form-item label="检测单位" prop="company">
        <el-select size="mini" v-model="editForm.company" placeholder="请选择">
          <el-option
            size="mini"
            v-for="item in company"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监测周期" prop="project">
        <el-input size="mini" v-model.number="editForm.project" placeholder="监测周期"></el-input>
      </el-form-item>
      <el-form-item label="末次检测时间" prop="cycle">
        <el-date-picker
          size="mini"
          v-model="editForm.cycle"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="检测状态" prop="lastCycle">
        <el-input size="mini" v-model.number="editForm.lastCycle" placeholder="检测状态"></el-input>
      </el-form-item>
      <el-form-item label="预警天数" prop="earlyWarning">
        <el-input size="mini" v-model.number="editForm.earlyWarning" placeholder="预警天数"></el-input>
      </el-form-item>
      <el-form-item label="规格型号" prop="specifications">
        <el-input size="mini" v-model="editForm.specifications" placeholder="规格型号"></el-input>
      </el-form-item>
      <el-form-item label="建档人" prop="specifications">
        <el-input size="mini" v-model="editForm.archivingPerson" placeholder="建档人"></el-input>
      </el-form-item>
      <el-form-item label="建档时间" prop="filingTime">
        <el-date-picker
          value-format="yyyy-MM-dd"
          format="yyyy 年 MM 月 dd 日"
          size="mini"
          v-model="editForm.filingTime"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="关联排污口" prop="associatedDrain">
        <el-select v-model="editForm.associatedDrain" placeholder="请选择" size="mini">
          <el-option
            size="mini"
            v-for="item in associatedDrain"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>