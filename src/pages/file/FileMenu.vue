<template>
  <div id="file">
    <div class="datamenu fl">
      <el-menu router class="el-submenu" :default-active="$route.path">
        <el-menu-item
          class="el-submenu__title"
          v-for="item in mymenu"
          :key="item.id"
          :index="'/file/'+item.to"
        >{{item.label}}</el-menu-item>
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
    request.secondMenuData(3).then(res => {
      this.mymenu = res.data.data;
    });
  }
};
</script>
<style>

</style>