import axios from 'axios';

const instance = axios.create({
  baseURL: '/m',
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'dataType': 'json',
    }
  },
});
instance.interceptors.request.use(config => {
  // 也可以在这里给请求添加token之类的字段
  config.data = Qs.stringify(config.data, {arrayFormat: 'repeat', allowDots: true});
  return config;
}, err => {
  return Promise.reject(err);
});

// class DataScreenApi {
//   request
// }