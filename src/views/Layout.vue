<template>
  <div :style="menuPageCss" class="pages page-layout">
    <LayoutHeader v-if="menuPage !== 'left'"></LayoutHeader>
    <LayoutHeaderLeft
      @toggle="toggle"
      :isOpen="isOpen"
      v-if="menuPage === 'left'"
    />

    <router-view :class="{ active: !isOpen }" />
  </div>
</template>
<script>
import LayoutHeader from "../components/Header";
import LayoutHeaderLeft from "../components/HeaderLeft";
const isPC = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);
//菜单位置：取值： left :菜单在左面， top :菜单在上面
const MenuPage = "top";
import { mapState } from "vuex";
export default {
  components: {
    LayoutHeader,
    LayoutHeaderLeft,
  },
  data() {
    return {
      isOpen: isPC,
      menuPage: MenuPage,
      systemName: process.env.VUE_APP_sysName,
    };
  },
  computed: {
    ...mapState(["sysName", "sysLogo"]),
    menuPageCss() {
      //左面和顶面菜单切换时，动态计划相关css参数
      return {
        "--padding-top": this.menuPage === "left" ? "60px" : "0px",
        "--margin-left": this.menuPage === "left" ? "200px" : "0px",
      };
    },
  },
  created() {
    document.title = this.sysName ? this.sysName : this.systemName; // 设置项目标题
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="less">
.page {
  min-height: calc(100vh - 100px);
  width: 100%;

  position: relative;
  background: #fff;
  padding: var(--padding-top) 5px 5px 5px;
  margin-left: 60px;
  &.active {
    margin-left: var(--margin-left);
  }
}
.page-layout {
  background: #eee;
}
</style>


