<template>
  <div class="page page-not-login">
    <h1>没有访问权限，或是账号过期。</h1>
    <div>
      <el-button>重新登录</el-button>
      <el-button @click='goHome'>回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.replace('/')
    }
  },
}
</script>

<style lang="less">
.page-not-login{
  h1{
    font-size: 20px;
    margin-bottom: 30px;
  }
}
</style>

