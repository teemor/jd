<template>
  <div>
    <div>
      <el-button size="mini" type="primary" @click="addBook">新增</el-button>
      <el-button size="mini" type="warning" @click="editBook">修改</el-button>
      <el-button size="mini" type="danger" @click="delBook">删除</el-button>
      <el-button size="mini" type="success" @click="saveBook">存档</el-button>
      <!-- <el-button size="mini" type="info" @click="cancel">取消</el-button> -->
    </div>
    <div>
      <el-row>
        <el-form ref="file" :model="searchData" label-width="80px">
          <el-col :span="5">
            <el-form-item label="时间" prop="abbreviation">
              <el-input size="mini" v-model="searchData.abbreviation" placeholder="时间"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="排污号" prop="sewage">
              <el-input size="mini" v-model="searchData.sewage" placeholder="排污号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="设备号" prop="device">
              <el-input size="mini" v-model="searchData.device" placeholder="设备号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="编号" prop="number">
              <el-input size="mini" v-model="searchData.number" placeholder="编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="位置" prop="position">
              <el-input size="mini" v-model="searchData.position" placeholder="位置"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-top:7px;margin-left:50px">
            <el-button size="mini" type="primary" @click="searchBook">查询</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchData: {
        abbreviation: "",
        sewage: "",
        device: "",
        number: "",
        position: ""
      }
    };
  },
  methods: {
    // 新增
    addBook() {},
    // 修改
    editBook() {},
    // 删除
    delBook() {},
    // 存档
    saveBook() {},
    // 查询
    searchBook() {}
  }
};
</script>

<style>
</style>