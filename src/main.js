import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/less/base.less";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Prototype from "./assets/utils/prototype";
import Filter from "./assets/utils/filter.js";
import GlobalComponents from "./assets/utils/globalComponents.js";
import Global from "./assets/utils/global.js";
import VueClipboard from "vue-clipboard2";
import VueAMap from "vue-amap";
import * as echarts from "echarts";
import "@/assets/less/common.less";
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Prototype);
Vue.use(Filter);
Vue.use(GlobalComponents); // 全局组件
Vue.use(VueClipboard);
Vue.use(VueAMap);
// 引入iconfont
import "./assets/fonts/iconfont.css";
// moment 时间处理
import moment from "moment";
Vue.prototype.$moment = moment;
// dataV
// 将自动注册所有组件为全局组件
import dataV from "@jiaminghi/data-view";
Vue.use(dataV);
// 滚动插件
import scroll from "vue-seamless-scroll";
Vue.use(scroll);
VueAMap.initAMapApiLoader({
  key: "f45cca59553214543a5a77e50a7e04df",
  plugin: [
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.PlaceSearch",
    "AMap.Geolocation",
    "AMap.Geocoder",
  ],
  v: "1.4.4",
  uiVersion: "1.0",
});
Vue.prototype.Global = Global;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
