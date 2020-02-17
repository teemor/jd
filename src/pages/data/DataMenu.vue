<template>
  <div class>
    <div class="datamenu fl">
      <el-menu router :default-active="$route.path">
        <el-submenu v-for="(items,index) in mymenu" :key="index" :index="index.toString()">
          <template slot="title">
            <span>{{items.label}}</span>  
          </template>
          <el-menu-item :index="'/'+menu.to" v-for="menu in items.children" :key="menu.id">{{menu.label}}</el-menu-item>
        </el-submenu>
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
      mymenu:[]
    };
  },
  mounted() {
    request.secondMenuData(2).then(res => {
      this.mymenu = res.data.data;
    });
  }
};
</script>
<style>

</style>