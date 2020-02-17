<template>
  <div style="padding:0 10px">
    <el-row>
      <el-col
        :span="6"
        v-for="(item, index) in $store.state.platform.tableData.tableData"
        :key="index"
        :offset="index%3 ==0 ? 0 : 2"
      >
        <el-card :body-style="{ padding: '0px'}" style="margin-bottom:20px" shadow="hover">
          <div slot="header" class="clearfix" style="height:10px">
            <span>{{item.name}}</span>
          </div>
          <img :src="item.boundary" class="image" @click="btnBlank(item)" />
          <div style="padding: 14px;">
            <div class="bottom clearfix">
              <!-- <el-button type="text" class="button">待上报</el-button> -->
              <el-button type="text" class="button" @click="edit(item)">平台编辑</el-button>
              <el-button type="text" class="button" @click="platformreport(item)">平台报表</el-button>
              <el-button type="text" class="button">上报记录</el-button>
              <el-button type="text" class="button" @click="deleteOne(item)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    };
  },
  mounted() {
    this.$store.dispatch("platform/getPlatformData");
  },
  methods: {
    // 跳转到外链
    btnBlank(data) {
      window.open(data.address,"_blank");
    },
    // 平台编辑
    edit(data) {
      this.$emit("edit");

      this.$store.commit("platform/getModifyPlatformData", data);
    },
    // 删除
    deleteOne(data) {
      this.$store.dispatch("platform/delData", data.id);
    },
    // 平台报表
    platformreport(data) {
      this.$store.commit("platformreport/getId", data.id);
      this.$store.dispatch("platformreport/getPlatformReportData", data.id);

      this.$emit("platformreport");
    }
  }
};
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  width: 21.5%;
  text-align: center;
}

.image {
  cursor: pointer;
  height: 200px;
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>