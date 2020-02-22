<template>
  <div id="app">
    <div style=" height:90px;background-image: linear-gradient(#9a9a9a, #c9c9c9);">
      <div class="logo_img">
        <img src="../assets/img/logo.png" />
      </div>
      <div
        class="fl"
        style="margin-left:40px;font-weight:bold;font-size:35px;color:#333333;height:90px;line-height:90px"
      >金隅冀东水泥环保管理系统</div>

      <div class="exit_img fr">
        <div class="fl">欢迎您，{{uname}}</div>
        <div class="fl exit" @click="exitUser" >
          <img src="../assets/img/exit.png" />退出登录
        </div>
      </div>
    </div>
    <div class="menu">
      <div v-for="item in menuData" :key="item.label">
        <router-link :to="{path:'/'+item.to}" @click.native="refreshView">
          <div>{{item.label}}</div>
        </router-link>
      </div>
    </div>
    <div>
      <router-view v-if="showView" />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("system");
import commonUtils from "@/assets/util/commonUtil";
import router from "@/router";
export default {
  name: "App",
  data() {
    return {
      showView: true,
      uname: ""
    };
  },
  mounted() {
    this.$store.dispatch("system/menuData");
    this.showName();
  },
  computed: {
    ...mapGetters(["menuData"])
  },
  methods: {
    // 获取用户名
    showName() {
      let userInfo = JSON.parse(commonUtils.getCookie("id"));
      this.uname = userInfo.uname;
    },
    exitUser() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          commonUtils.setCookie("code", "", -1);
          commonUtils.setCookie("id", "", -1);
          router.push({ path: "/login" });
          this.$message({
            type: "success",
            message: "退出成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取操作"
          });
        });
    },
    refreshView() {
      this.showView = false;
      this.$nextTick(() => {
        this.showView = true;
      });
    }
  }
};
</script>

<style>
.logo_img {
  padding-left: 50px;
}
.logo_img img {
  width: 50px;
  /* height: 50px; */
  float: left;
  padding-top: 20px;
}
.exit_img {
  color: white;
   margin-right: 30px;
  margin-top: 60px;
}
.exit{
  cursor:pointer;
}
.exit_img img {
  margin-top:-4px;
  margin-left:30px;
  margin-right:5px;
  width: 20px;
  height: 18px;
 
}
#app {
  /* min-width: 1800px; */
  font-family: "Avenir", Helvetica, Adrial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
