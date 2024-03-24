import Vue from "vue";
import Router from "vue-router";
import Store from "./store";
import Layout from "./views/Layout.vue";
import fileNotFound from "./views/errors/fileNotFound.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false });

Vue.use(Router);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const router = new Router({
  routes: [
    builder("/authentication", "login/authentication"),
    builder("/login", "login/login"),
    builder("/go", "codeGen/index"),
    builder("/sso", "SSO"),
    builder("/analysis", "analysis/Analysis"), //数据分析

    {
      path: "/",
      name: "layout",
      component: Layout,
      meta: {
        requiresAuth: true,
      },
      children: [
        ...restBuilder("oper/log", "system/log"), // 系统管理-操作日志
        ...restBuilder("validcode", "system/validcode"), // 接入管理-接入信息
        ...restBuilder("menu", "system/menu"), // 系统管理--菜单管理
        ...restBuilder("resource", "system/resource"), // 系统管理--资源管理
        ...restBuilder("role", "system/role"), // 系统管理--角色管理
        ...restBuilder("user", "system/user"), // 用户管理 -- 管理用户
        ...restBuilder("param", "system/param"), // 系统管理--参数管理
        ...restBuilder("task", "system/task"), // 系统管理--任务管理
        // builder('site/list', 'system/site/index'),//站点
        ...restBuilder("sitestat", "sitestat"), //站点设备管理
        builder("sitestat/maplist", "sitestat/maplist"), //地图站点
        builder("sitestat/mapDetail", "sitestat/mapDetail"), //地图设备
        ...restBuilder("platform", "platform"), //平台
        ...restBuilder("product", "product"), //产品
        ...restBuilder("device", "device"), //设备
        ...restBuilder("device/alarm/info", "device/alarm/info"), //设备告警信息
        ...restBuilder("device/module", "device/module"), //设备模块使用率
        ...restBuilder("device/module/use", "device/module/use"), //设备模块使用率
        ...restBuilder("device/module/distribute", "device/module/distribute"), //设备前端模块部署
        ...restBuilder("device/log", "device/log"),
        ...restBuilder("firm", "firm"), //
        ...restBuilder("alarm/config", "alarm/config"), //设备告警配置
        ...restBuilder("alarm/sms/send", "alarm/sms/send"), //设备告警短信
        ...restBuilder("product/version", "product/version"), //产品版本

        ...restBuilder("app/publish", "app/publish"), //产品

        ...restBuilder("site", "site"), // 站点管理

        //以下为基础路由配置
        builder("", "Home"),
        builder("index", "Home"),
        builder("login/updatePwd", "login/updatePwd"),
        builder("403", "errors/403"),
        builder("*", "errors/404"),
      ],
    },
  ],
});

/**
 * rest路由生成器
 *
 * @param {string} path 路径
 * @param {string} [component=path] 文件地址
 * @returns {array} [] reset路由数组，包含list/edit/add/view
 */
function restBuilder(path, component = path) {
  let arr = [];
  arr.push(builder(`${path}/list`, `${component}/list`));
  arr.push(builder(`${path}/edit`, `${component}/show`));
  arr.push(builder(`${path}/add`, `${component}/show`));
  arr.push(builder(`${path}/view`, `${component}/show`));
  return arr;
}

/**
 * 路由生成器
 *
 * @param {string} path 路径
 * @param {string} [component=path] 文件地址
 * @param {boolean} [requiresAuth=false] 是否登录后才能访问
 * @returns {any} {} 路由对象
 */
function builder(path, component = path, requiresAuth = false) {
  return {
    path: path,
    name: path || "homepage",
    component: getComponent(component),
    meta: {
      requiresAuth: requiresAuth,
    },
  };
}

function getComponent(fileName) {
  try {
    return require("./views/" + fileName).default;
  } catch (error) {
    return fileNotFound;
  }
}
//检查是否跳转到sso地址
function ssoCheck(to, from, next) {
  console.log("to", to);
  console.log("from", from);
  console.log("next", next);
  let redirect = to.path === "/login/updatePwd" ? "/#/updatePwd" : "";
  redirect =
    redirect === "" && to.path === "/login"
      ? location.protocol + "//" + location.host + "/#" + from.fullPath
      : redirect;
  if (redirect != "") {
    next(false);
    window.location.href =
      "//" +
      location.host +
      "/m/login/logout?redirect=" +
      encodeURIComponent(redirect);
    return true;
  }
  return false;
}

router.afterEach(() => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  NProgress.done();
});

// 路由鉴权
router.beforeEach((to, from, next) => {
  // if (ssoCheck(to, from, next)) { //sso鉴权检查
  //   return
  // }
  NProgress.start();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (Store.state.isLogin) {
      next();
    } else {
      next({
        path: "/authentication",
        query: {
          redirect: to.fullPath,
        },
      });
    }
  } else {
    next();
  }
});

export default router;
