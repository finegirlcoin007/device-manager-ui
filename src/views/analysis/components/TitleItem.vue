<template>
  <div class="title-item">
    {{ title }}
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      default: "",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.title-item {
  width: 436px;
  height: 48px;
  padding-left: 36px;
  padding-top: 10px;
  background: url("~@/assets/images/data/xb.png") no-repeat center;
  background-size: 100% 100%;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #ffffff;
}
</style>