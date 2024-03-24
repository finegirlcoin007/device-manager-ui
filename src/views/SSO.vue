<template>
  <div class="sso">
    <h2>正在跳转...</h2>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  created() {
    this.getInfo();
  },
  mounted() {},
  methods: {
    ...mapMutations(["SET_sysName", "SET_sysLogo"]),
    // 获取token和站点信息
    async getInfo() {
      let { token, siteid, sysName, sysLogo } = this.$route.query;
      if (token) {
        window.sessionStorage.setItem("token", token);
        window.sessionStorage.setItem("siteid", siteid);
        this.SET_sysName(sysName);
        this.SET_sysLogo(sysLogo);
        this.$router.push("/index"); // 有token直接跳转首页
      } else {
        this.$message({
          message: "没有权限，正在跳转登录页面...",
          center: true,
        });
        setTimeout(function () {
          window.location.href =
            process.env.VUE_APP_PORTAL_URL == "undefined"
              ? "http://192.168.0.98:11072"
              : process.env.VUE_APP_PORTAL_URL;
          //this.$router.push('/login')
        }, 1000);
      }
    },
  },
};
</script>

<style>
.sso {
  width: 300px;
  height: 100px;
}
</style>