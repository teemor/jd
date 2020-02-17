<template>
  <div>
    <div class="datamenu fl">
          <el-menu router>
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
      mymenu: []
    };
  },
  mounted() {
    request.secondMenuData(4).then(res => {
      this.mymenu = res.data.data;
    });
  }
};
</script>
<style>

.el-submenu__title {
  color: #fff;
  font-size: 16px;
}
.el-submenu__title:hover {
  background: #9b9b9b;
}
.is-opened {
  background: #9b9b9b !important;
}
.el-submenu .el-menu-item {
  /* min-width: 150px !important; */
}
.el-menu-item.is-active {
  color: #fff !important;
  background: #9b9b9b !important;
}
</style>