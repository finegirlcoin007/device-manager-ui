<template>
  <div>
    <div class="profile" :class="{ close: isOpen }">
      <p class="menu-switch">
        <i @click="toogle" :class="`el-icon-s-${isOpen ? 'unfold' : 'fold'}`" />
      </p>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ currentUserName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="update">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="sidebar" :class="{ close: isOpen }">
      <div class="logo">
        <router-link to="/">
          <img src="../assets/images/logo.png" height="20" alt />
          {{ isOpen ? "" : "xxx系统" }}
        </router-link>
      </div>
      <el-menu
        :default-active="defaultActive"
        background-color="#222333"
        text-color="#fff"
        active-text-color="#409eff"
        :collapse="isOpen"
        :collapse-transition="false"
        router
        unique-opened
      >
        <el-menu-item index="/index" key="home">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </el-menu-item>

        <el-submenu v-for="item in menu" :key="item.id" :index="item.name">
          <template slot="title">
            <i :class="`el-icon-${item.icon}`"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="val in item.children"
            :index="val.path"
            :key="val.id"
          >
            <i :class="`el-icon-${val.icon}`"></i>
            <span>{{ val.name }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleCommand(key) {
      if (key === "update") {
        this.$router.push("/login/updatePwd");
      }
      if (key === "logout") {
        this.logout();
      }
    },
    toogle() {
      this.$emit("toggle");
    },
    // 退出登录
    logout() {
      this.$post("/login/logout")
        .then((data) => {})
        .catch((error) => {})
        .then(() => {
          this.$message.success("已退出登录");
          this.$store.commit("logout");
          this.$router.replace("/login");
        });
    },
  },
  computed: {
    currentUserName() {
      const { currUserName } = this.$store.state.userData;
      return currUserName;
    },
    group() {
      const relativeGroup = this.$store.state.group;
      if (relativeGroup) {
        return relativeGroup;
      }
      let groupArray = this.$route.path.split("/");
      let group = this.$route.path;
      let type = groupArray.pop();
      if (["add", "edit", "view", "new"].indexOf(type) > -1) {
        groupArray.push("list");
        group = groupArray.join("/");
      }
      return group;
    },
    relativeGroup() {
      return this.$store.state.group;
    },
    flat() {
      return this.userData.flat;
    },
    menu() {
      if (!this.userData.barList) return [];
      return this.userData.barList.map((item) => {
        const url = item.url
          ? item.url
          : item.childList[0]
          ? item.childList[0].url || ""
          : "";
        return {
          name: item.name,
          path: url,
          id: item.id,
          icon: item.imgPath,
          children: item.childList.map((sub) => {
            return {
              name: sub.name,
              path: sub.url
                ? sub.url
                : sub.childList[0]
                ? sub.childList[0].url || 0
                : "",
              id: sub.id,
              parentId: sub.parentId,
              icon: sub.imgPath,
              isOut: /^https?\:\/\//.test(sub.url),
            };
          }),
        };
      });
    },
    defaultActive() {
      this.search = "";
      // this.$route.path;
      return this.group;
    },
    submenu() {
      if (!this.menu.length) return {};
      let matchMenu = {};
      this.menu.forEach((item) => {
        const menu = item;
        item.children.forEach((item) => {
          if (item.path === this.group) {
            matchMenu = menu;
            return;
          }
        });
      });
      return matchMenu;
    },
    userData() {
      return this.$store.state.userData;
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less">
.profile {
  height: 50px;
  background-color: #222333;
  text-align: right;
  position: fixed;
  right: 0;
  width: calc(100% - 200px);
  z-index: 999;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.close {
    width: calc(100% - 64px);
  }
  .menu-switch {
    cursor: pointer;
    i {
      font-size: 20px;
      color: #999;
      font-weight: normal;
    }
  }
}

.sidebar {
  width: 200px;
  height: 100%;
  background-color: #222333;
  position: fixed;
  top: 0;
  z-index: 1000;
  .el-menu {
    border-right: 0 none;
    height: calc(100% - 50px);
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 17px;
      height: 17px;
      background-color: transparent;
      border-radius: 9px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #40425a;
      border-radius: 9px;
      background-clip: content-box;
      border: 5px solid transparent;
    }
    i {
      &.el-icon-folder {
        font-size: 18px;
        margin-right: 3px;
      }
      &.el-icon-tickets {
        font-size: 16px;
        margin-right: 0;
      }
    }
  }
  &.close {
    width: 64px;
    .logo {
      img {
        margin-right: 0;
      }
      a {
        padding: 0;
      }
    }
  }
  .logo {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #222333;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-menu {
      display: none;
    }
    a {
      margin: auto;
      color: #fff;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding-left: 20px;
    }
    img {
      margin-right: 5px;
    }
  }
}
</style>