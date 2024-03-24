<template>
  <div class="page-authentication">
    <!-- 自动登录页面 -->
  </div>
</template>

<script>
export default {
  name: "authentication",
  created() {
    this.login();
  },
  methods: {
    login() {
      this.$post("/login/index").then(this.loginSuccess).catch(this.loginFail);
    },
    loginSuccess({ data }) {
      this.$store.commit("setUserData", data);
      this.$router.replace({
        path: this.redirect,
      });
    },
    loginFail(error) {
      this.$message.error(error.message || "请登录");
      // console.log("<<", process.env.VUE_APP_BASE_API);
      window.location.href =
        process.env.VUE_APP_PORTAL_URL == "undefined"
          ? "http://192.168.0.98:11072"
          : process.env.VUE_APP_PORTAL_URL;
    },
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
  data() {
    return {
      redirect: this.$route.query.redirect,
      loading: true,
    };
  },
};
</script>
