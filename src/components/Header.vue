// 管理后台通用头部导航

<template>
  <div class="layout-header">
    <div class="layout-menu-wrapper flex">
      <div class="layout-menu flex flex-1">
        <!-- logo -->
        <div class="layout-logo flex">
          <!-- <i class="el-icon-menu" @click="showMobileMenu = !showMobileMenu">
          </i> -->
          <img
            class="logo"
            :src="sysLogo ? sysLogo : require('../assets/images/logo2.png')"
          />
          <h1 class="title">
            {{ sysName ? sysName : systemName }}
          </h1>
        </div>
        <!-- 站点选择 -->
        <div>
          <HeaderSite></HeaderSite>
        </div>
        <!-- 一级菜单 -->
        <ul class="menu-list flex">
          <li v-for="item in menu" :key="item.id">
            <router-link
              :to="item.path"
              :active="submenu.path === item.path"
              :title="item.name"
            >
              <i :class="item.icon"></i>
              <span>
                {{ item.name }}
              </span>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="layout-profile">
        <!-- <span class="el-dropdown-link">
             {{userData.currUserName}}
             <i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->

        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link" style="color: white">
            {{ userData.currUserName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="update">修改密码</el-dropdown-item>
            <!-- <el-dropdown-item command="logout">退出登录</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 一级菜单 -->
    <ul class="mobile-menu-list flex flex-pack-justify" v-if="showMobileMenu">
      <li v-for="item in menu" :key="item.id">
        <router-link
          :to="item.path"
          :active="submenu.path === item.path"
          :title="item.name"
        >
          <i :class="item.icon"></i>
          {{ item.name }}
        </router-link>
      </li>
    </ul>

    <!-- 二级菜单 -->
    <div
      class="layout-submenu-wrapper flex"
      v-if="submenu.children && submenu.children.length"
    >
      <div class="layout-submenu">
        <ul class="submenu-list flex">
          <li v-for="item in submenu.children" :key="item.id">
            <a :href="item.path" target="blank" v-if="item.isOut">{{
              item.name
            }}</a>
            <router-link :to="item.path" :active="group === item.path" v-else>{{
              item.name
            }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderSite from "./HeaderSite.vue";
import { mapState } from "vuex";
export default {
  name: "Header",
  components: {
    HeaderSite,
  },
  data() {
    return {
      systemName: process.env.VUE_APP_sysName,
      showMobileMenu: false,
    };
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
  beforeDestroy() {},
  mounted() {},
  computed: {
    ...mapState(["sysName", "sysLogo"]),
    activeMenu() {
      return this.$route.path;
    },
    group() {
      const relativeGroup = this.$store.state.group;
      if (relativeGroup) {
        return relativeGroup;
      }
      let groupArray = this.$route.path.split("/");
      let group = this.$route.path;
      let type = groupArray.pop();
      if (
        ["add", "edit", "view", "new", "importView", "resetPwdView"].indexOf(
          type
        ) > -1
      ) {
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
};
</script>

<style lang="less">
.layout-header {
  .mobile-menu-list {
    display: none;
  }
  .title {
    font-size: 18px;
    max-width: 200px;
    color: #fff;
    line-height: normal;
  }
  .layout-menu-wrapper {
    height: 64px;
    line-height: 64px;
    font-size: 14px;
    color: #eee;
    background: linear-gradient(90deg, #1845c6 0%, #2999ff 100%);
    .layout-menu {
      align-items: center;
    }
    .layout-logo {
      height: 50px;
      padding-left: 23px;
      align-items: center;

      .el-icon-menu {
        display: none;
      }
      a {
        margin: auto;
      }
      .logo {
        height: 32px;
        margin-right: 10px;
      }
    }

    .menu-list {
      li {
        a {
          display: block;
          padding: 0 12px;
          height: 100%;
          color: #c7e1ff;
          &.router-link-active,
          &[active] {
            //background: #1890ff;
            color: #fff;
            list-style-type: none;
            // border-bottom: 3px solid #fff;
            padding-bottom: 2px;
            background-color: #1890ff;
          }
        }
      }
    }
    .layout-profile {
      padding-right: 30px;
    }
  }

  .layout-submenu-wrapper {
    padding-left: 20px;
    background: #fff;
    height: 42px;
    border-bottom: 1px solid #ededed;
    .layout-title {
      font-size: 18px;
      height: 40px;
      line-height: 40px;
      color: #333;
    }
    .layout-submenu {
      margin-left: 15px;
      white-space: nowrap;
      overflow: auto;
      li {
        a {
          display: block;
          padding: 0 15px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          color: #666;
          &.router-link-active,
          &[active] {
            color: #1890ff;
            font-weight: 600;
            border-bottom: 2px solid #1890ff;
          }
        }
      }
    }
  }
  .el-dropdown-link {
    cursor: pointer;
  }
}

@media screen and (max-width: 800px) {
  .layout-header {
    .mobile-menu-list {
      display: flex;
      background: #222333;
      padding: 0 10px;
      li {
        padding: 8px 5px;
        a {
          width: 1em;
          display: block;
          color: #eee;
          font-size: 14px;
          word-break: break-all;
          &.router-link-active,
          &[active] {
            color: #1890ff;
          }
        }
      }
    }
    .layout-submenu-wrapper {
      padding-left: 0;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    .layout-menu-wrapper {
      width: 100%;
      .layout-logo {
        width: 40px;
        height: 66px;
        .el-icon-menu {
          margin: auto;
          display: inline-block;
        }
        a {
          display: none;
        }
      }
      .menu-list {
        display: none;
      }
      li {
        width: 100%;
      }
    }
  }
}
</style>
