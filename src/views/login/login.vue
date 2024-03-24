<!-- 登录页面 -->

<template>
  <div class="page page-login flex flex-v">
    <div class="form-wrap flex flex-1">
      <el-form
        @submit.prevent="onSubmit"
        ref="form"
        :model="form"
        label-width="80px"
        size="small"
      >
        <h1>{{ sysName ? sysName : systemName }}</h1>
        <el-form-item label="用户名">
          <el-input v-model="form.loginName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button
            type="primary"
            class="addclass"
            native-type="submit"
            :loading="loading"
            @click="onSubmit"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="footer">
      <!-- 登陆 &copy; <a href="">信宏翔网络科技有限公司</a> 出品 -->
    </div>
  </div>
</template>

<script>
// import { createSocket } from "@/assets/utils/websocket";
import { mapMutations, mapState } from "vuex";
export default {
  name: "login",
  data() {
    return {
      systemName: process.env.VUE_APP_sysName,
      originData: [],
      loading: false,
      form: {
        loginName: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapState(["sysName"]),
  },
  created() {
    this.getInfo();
  },
  methods: {
    ...mapMutations(["SET_sysName", "SET_sysLogo"]),
    // 获取token和站点信息
    getInfo() {
      let { sysName, sysLogo, siteid } = this.$route.query;
      if (siteid && sysName && sysLogo) {
        sessionStorage.setItem("siteid", siteid);
        this.SET_sysName(sysName);
        this.SET_sysLogo(sysLogo);
      }
    },
    login() {
      this.loading = true;
      this.$post("/login/login", this.form)
        .then(this.loginSuccess)
        .catch(this.loginFail);
    },
    loginSuccess({ data }) {
      this.$store.commit("setUserData", data);
      let { token } = data;
      sessionStorage.setItem("token", token);
      this.$router.push("/index");
      //成功 创建websocket连接 process.env.VUE_WEBSOCKET_BASE_API +
      // createSocket("ws://"+process.env.VUE_APP_BASE_API +"/ws?accessToken="+data.id)
    },
    loginFail(error) {
      this.loading = false;
      //this.refreshCode();
      this.$message.error(error.message);
    },
    // refreshCode() {
    //   this.form.securityCode = '';
    //   this.securityCodeUrl = securityCodeUrl + Math.random();
    // },
    onSubmit(e) {
      e.preventDefault();

      if (!this.form.loginName.length) {
        return this.$message.warning("请输入用户名");
      }
      if (!this.form.password.length) {
        return this.$message.warning("请输入密码");
      }

      this.login();
    },
  },
};
</script>

<style lang="less">
.el-divider--horizontal {
  margin: 5px 0;
  background: 0 0;
  border-top: 2px solid #e8eaec;
}
.page-login {
  background-image: linear-gradient(45deg, #333, #111);
  background-size: 40px 40px;
  margin: 0;
  height: 100%;
  .el-form {
    margin: auto;
    width: 400px;
    padding: 25px 25px 0 0;
    background: #fff;
    h1 {
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 20px;
    }
    button {
      margin-top: 10px;
      width: 240px;
    }
    .el-input-group__append {
      padding: 0;
      font-size: 0;
    }
  }
  .footer {
    height: 80px;
    font-size: 12px;
    color: #999;
    text-align: center;
    line-height: 80px;
    a {
      color: #999;
    }
  }
}
</style>

