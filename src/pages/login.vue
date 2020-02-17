<template>
  <div id="login">
    <div class="login-title">
      <img src="../assets/img/logo.png" class="login-logo" />
      <span style="font-weight:bold;font-size:55px;color:#333333">金隅冀东水泥环保管理系统</span>
    </div>
    <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
      <div class="login_box">
        <div class="form_box">
          <div class="login_text">用户登录</div>
          <el-form-item prop="name">
            <el-input type="text" placeholder="账号" v-model="loginForm.uname" id="phone"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input
              type="password"
              placeholder="密码"
              v-model="loginForm.pass"
              id="pwd"
              @keyup.enter.native="login('loginForm')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item class="btn">
            <el-button @click="login('loginForm')" :loading="loginBtn">登录</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("login");
import commonUtils from "@/assets/util/commonUtil";

export default {
  data() {
    return {
      loginBtn: false,
      checked: false,
      rules: {
        uname: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        pass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["loginForm"])
  },
  methods: {
    login(model) {
      this.loginBtn = true;
      commonUtils.setCookie("code", "1", 1);
      console.log(this.checked, "checked");
      if (this.checked == true) {
        this.setCookie(this.loginForm.uname, this.loginForm.pass, 7);
      } else {
        this.clearCookie();
      }
      this.$refs[model].validate(valid => {
        if (valid) {
          this.$store.dispatch("login/login", model).then(() => {
            // this.loginForm.password = "";
          });
        } else {
          return false;
        }
      });
      console.log("submit!");
    },
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    //读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "userName") {
            this.loginForm.uname = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == "userPwd") {
            this.loginForm.pass = arr2[1];
          }
        }
      }
    },
    //清除cookie
    clearCookie: function() {
      this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    }
  }
};
</script>
<style scoped>
</style>