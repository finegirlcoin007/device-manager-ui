import axios from "axios";
import Qs from "qs";
const JSONbig = require("json-bigint")({ storeAsString: true });
import cookie from "./cookie";
import httpErrorHandler from "./httpErrorHandler";

const instance = axios.create({
  baseURL: "/m",
  //baseURL: process.env.VUE_APP_BASE_API,
  headers: {
    post: {
      "Content-Type": "application/json;charset=UTF-8",
      dataType: "json",
    },
  },
  transformResponse: [
    (data) => {
      try {
        JSON.parse(data);
        return JSONbig.parse(data);
      } catch (error) {
        return data;
      }
    },
  ],
});

instance.interceptors.request.use(
  (config) => {
    //config.data = Qs.stringify(config.data, {arrayFormat: 'repeat', allowDots: true});
    //config.data = Qs.stringify(config.data, {arrayFormat: 'indices', allowDots: true});
    //brackets
    // 也可以在这里给请求添加token之类的字段
    // config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // config.headers.timestamp = Math.floor(new Date().getTime() / 1000)
    // console.log("sessionStorage",window.sessionStorage)
    config.headers.Authorization = window.sessionStorage.getItem("token") || "";
    //console.log("request config and session",config,window.sessionStorage);
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use((response) => {
  return response.data;
}, httpErrorHandler);

/**
 * 封装后的axios post方法
 *
 * @param {string} url 请求路径
 * @param {object} option 请求参数
 * @param {object} [config] 特殊配置项（选填）
 * @returns
 */
export function post(url, option, config = {}) {
  const data = Object.assign({}, option, {
    // __mortals_token__: cookie.getItem('__mortals_token__'),
  });
  return instance.post(url, data, config);
}

/**
 * 封装后的axios get方法
 *
 * @param {string} url 请求路径
 * @param {object} option 请求参数
 * @param {object} [config] 特殊配置项（选填）
 * @returns
 */
export function get(url, option, config = {}) {
  const data = Object.assign({}, option, {
    //__mortals_token__: cookie.getItem('__mortals_token__'),
  });
  return instance.get(url, { params: data }, config);
}

// 文件上传
const uploadInstance = axios.create({
  baseURL: "/m",
  headers: {
    post: {
      "Content-Type": "multipart/form-data",
    },
  },
});

uploadInstance.interceptors.response.use((response) => {
  return response.data;
}, httpErrorHandler);

/**
 * 封装后的axios upload方法
 *
 * @param {string} url 请求路径
 * @param {object} option 请求参数
 * @param {object} [config] 特殊配置项（选填）
 * @returns
 */
export function upload(url, option, config = {}) {
  let formdata = new FormData();
  Object.keys(option).forEach((key) => {
    formdata.append(key, option[key]);
  });
  return uploadInstance.post(url, formdata, config);
}
