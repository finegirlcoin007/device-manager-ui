import axios from 'axios';
import Qs from 'qs';
import cookie from './cookie';
import httpErrorHandler from './httpErrorHandler';

const isDev = process.env.NODE_ENV === 'development';
const queue = [];
const cancelToken = axios.CancelToken;
const token = (config) =>{
  return `${config.url}_${config.method}`
}
const instance = axios.create({
  baseURL: '/m',
  headers: {
    token: cookie.getItem('fe_t'),
    post: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'dataType': 'json',
    }
  }
});

const removeQueue = (config) => {
  for(let i=0, size = queue.length; i < size; i++){
    const task = queue[i];
    if(task.token === token(config)) {
      task.cancel();
      queue.splice(i, 1);
    }
  }
}

//添加请求拦截器
instance.interceptors.request.use(config=>{
  removeQueue(config); //在一个ajax发送前执行一下取消操作
  config.cancelToken = new cancelToken((c)=>{
    queue.push({ token: token(config), cancel: c });
});
  return config;
}, error => {
  return Promise.reject(error);
});

//添加响应拦截器
instance.interceptors.response.use(response=>{
  removeQueue(response.config);
  return response.data
}, httpErrorHandler);

/**
 * 封装后的ajax post方法
 *
 * @param {string} url 请求路径
 * @param {object} option 请求参数
 * @param {object} config 自定义配置
 * @returns
 */
export default (url, data, config = {}) => {
  return instance.post(url, data, config)
}
