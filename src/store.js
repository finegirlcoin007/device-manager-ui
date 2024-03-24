import Vue from "vue";
import Vuex from "vuex";
import { normalCallPost } from "./assets/utils";

Vue.use(Vuex);

let userData = {};

try {
  userData = JSON.parse(window.sessionStorage.userData || "{}");
} catch (error) {
  console.log("未从session中获取到userData");
}

function convertTreeToList(root, array) {
  if (!root || !root.length) return array;
  root.forEach((item) => {
    let data = JSON.parse(JSON.stringify(item));
    const url = data.url
      ? data.url
      : item.childList[0]
      ? item.childList[0].url || ""
      : "";
    delete data.childList;
    array.push({
      name: data.name,
      path: data.url,
      id: data.id,
      parentId: data.parentId,
      icon: data.imgPath,
    });
    if (item.childList) {
      convertTreeToList(item.childList, array);
    }
  });
  return array;
}

function isPc() {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array(
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod"
  );
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

export default new Vuex.Store({
  state: {
    isLogin: false,
    isMobile: !isPc(),
    userData,
    group: "",
    sysName: "", // 系统名称
    sysLogo: "", // 系统logo
  },
  mutations: {
    setUserData(state, data) {
      data.flat = convertTreeToList(data.barList, []);
      state.userData = Object.assign({}, state.userData, data);
      state.isLogin = true;
      window.sessionStorage.userData = JSON.stringify(data);
      window.sessionStorage.token = data.token;
    },
    logout(state) {
      state.userData = {};
      state.isLogin = false;
      window.sessionStorage.userData = "";
      window.sessionStorage.token = "";
    },
    setGroup(state, data) {
      state.group = data;
    },
    SET_sysName(state, sysName) {
      state.sysName = sysName;
    },
    SET_sysLogo(state, sysLogo) {
      state.sysLogo = sysLogo;
    },
  },
  actions: {
    login({ commit }) {
      normalCallPost("/login/index")
        .then(({ data }) => {
          commit("setUserData", data);
        })
        .catch((error) => {});
    },
    logout({ commit }) {
      normalCallPost("/login/logout")
        .then((data) => {})
        .catch((error) => {})
        .then(() => {
          commit("logout");
        });
    },
  },
});
