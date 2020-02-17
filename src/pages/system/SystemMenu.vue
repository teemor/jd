<template>
  <div id="system">
    <div class="datamenu fl">
      <el-menu router class="el-submenu" :default-active="$route.path">
        <el-menu-item class="el-submenu__title" v-for="item in mymenu" :key="item.id"  :index="'/system/'+item.to">{{item.label}}</el-menu-item>
      </el-menu>
    </div>
    <div class="box fl">
      <div class="contain">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/api/system/system";
export default {
  data() {
    return {
      mymenu: []
    };
  },
  mounted() {
    request.secondMenuData(8).then(res => {
      this.mymenu = res.data.data;
    });
  }
};
</script>
<style>
/* .el-dialog__body {
  padding: 30px 90px !important;
}
.el-dialog {
  width: 30%;
} */
/* .datamenu {
  width: 150px;
} */

</style>