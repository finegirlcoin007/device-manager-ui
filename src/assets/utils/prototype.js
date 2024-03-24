import cookie from './cookie';
import * as utils from './index';


const Prototype = function() {};

Prototype.install = (Vue, options) => {
  Vue.prototype.$queue = utils.queueCall; // {function} post请求队列
  Vue.prototype.$getType = utils.type; // {function} 获取js对象类型
  Vue.prototype.$getQuery = utils.query; // {function} 获取url的query参数
  Vue.prototype.$post = utils.normalCallPost; // {function} ajax post
  Vue.prototype.$get = utils.normalCallGet; // {function} ajax get
  Vue.prototype.$upload = utils.normalCallUpload; // {function} ajax get
  Vue.prototype.$isLogin = utils.getLoginStatus; // {function} 登录状态
  Vue.prototype.$cookie = cookie; // {object} cookie操作
  Vue.prototype.$handleTree = utils.handleTree; // {function} 获取js对象类型
  Vue.prototype.$download = utils.download; // {function} ajax download
}

export default Prototype;
