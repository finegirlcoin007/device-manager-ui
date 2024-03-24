// 前端正则验证方法

export default {
  // 手机号码
  phone(rule, value, callback) {
    if (/^1[3456789][0-9]{9}$/.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的手机号码如 18800008888'));
    }
  },

  // 金额
  money(rule, value, callback) {
      if(!value) return callback();
      if (/^[0-9]+\.{0,1}[0-9]{0,2}$/.test(value)) {
          callback();
      } else {
          callback(new Error('请输入正确的金额如 100.23'));
      }
  },

  // 自然数
  integer(rule, value, callback) {
    if(!value) return callback();
    if (/^[0-9]+$/.test(value)) {
      callback();
    } else {
      callback(new Error('请输入一个整数如 5'));
    }
  },

  // 数字
  number(rule, value, callback) {
    if(!value) return callback();
    if (/^\d+(\.\d{1,2})?$/.test(value)) {
      callback();
    } else {
      callback(new Error('请输入一个数字'));
    }
  },

  // 经度
  longitude(rule, value, callback) {
    if (/^[\-\+]?(0?\d{1,2}\.\d{1,10}|1[0-7]?\d{1}\.\d{1,10}|180\.0{1,10})$/.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的经度如 103.012345'));
    }
  },

  // 纬度
  latitude(rule, value, callback) {
    if (/^[\-\+]?([0-8]?\d{1}\.\d{1,10}|90\.0{1,10})$/.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的纬度如 30.012345'));
    }
  },

  // 网址
  url(rule, value, callback) {
    if (/^https?:\/\/((.)+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?.(\?)?)*)*$/i.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的网址如 https://www.baidu.com'));
    }
  },

  // ip地址组
  ips(rule, value, callback) {
    if (!value) {
      // 允许不填写ip
      callback();
    }else if (!/^[0-9,\.]+$/.test(value)) {
      callback(new Error('含有非法字符'));
    }else {
      let ipVals = value.split(',');
      let noValiIps = [];
      if(ipVals.some(ip=>{
        let ipPattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if(ipPattern.test(ip)){
          return false;
        }
        noValiIps.push(ip || '空字符串');
        return true;
      })){
        callback(new Error('错误的ip地址: '+noValiIps.join(',')));
      }else{
        callback();
      }
    }
  },
}


