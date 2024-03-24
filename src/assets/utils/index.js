import Qs from 'qs';
import { post, get, upload } from './ajax';
import queue from './queue';
import axios from 'axios';
import cookie from './cookie';
import httpErrorHandler from './httpErrorHandler';

/**
 * 获取参数的类型
 *
 * @param {any} data
 * @returns {string} 参数类型
 */
export const type = (data) => {
  return Object.prototype.toString.call(data).replace(/(\[object |\])/g, '')
};

/**
 * 获取登录状态
 * 
 * @returns 
 */
export const getLoginStatus = () => {
  return window.sessionStorage.isLogin;
}

/**
 * 解析url参数
 *
 * @returns {object} localtion的query对象
 */
export const query = () => {
  return Qs.parse(window.location.href.split('?')[1])
}


/**
 * 编码url参数 
 *
 * @param {object} data 参数对象
 * @returns string
 */
export const encodeURI = (data) => {
  return Qs.stringify(data, { arrayFormat: 'repeat', allowDots: true });
}

/**
 * formatterDate
 *
 * @param {*} time 需要处理的时间
 * @returns {string} val 解析后的结果
 */
export function formatterDate(time) {
  if (!time) return '';
  let date = new Date(Number(time));
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = panLeft(date.getDate()) + ' ';
  let h = panLeft(date.getHours()) + ':';
  let m = panLeft(date.getMinutes()) + ':';
  let s = panLeft(date.getSeconds());
  return Y + M + D + h + m + s;
};
/**
 * formatterDate
 *
 * @param {*} time 需要处理的时间串
 * @returns {string} val 解析后的结果 yyyy-MM-dd
 */
export function formatterDateDay(datetime) {
  if (!datetime) return "";
  if (datetime instanceof Date) {
    let Y = datetime.getFullYear() + "-";
    let M =
      (datetime.getMonth() + 1 < 10
        ? "0" + (datetime.getMonth() + 1)
        : datetime.getMonth() + 1) + "-";
    let D = panLeft(datetime.getDate());
    return Y + M + D;
  } else {
    let transformDate = new Date(Number(datetime));
    let Y = transformDate.getFullYear() + "-";
    let M =
      (transformDate.getMonth() + 1 < 10
        ? "0" + (transformDate.getMonth() + 1)
        : transformDate.getMonth() + 1) + "-";
    let D = panLeft(transformDate.getDate());
    return Y + M + D;
  }
  return datetime;
};
/**
 * 当前日期加天数后得到的相应日期
 * @param {*} day 
 */
export function getAddDay(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds);
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear + "" + tMonth + "" + tDate;
}

function doHandleMonth(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
}

function panLeft(num) {
  return num < 10 ? '0' + num : num;
}


/**
 * call方法
 *
 * @param {Function} callMethod 调用的http包装方法
 * @param {String} url 调用接口
 * @param {Object} formData 需要发送参数
 * @param {Object} [config] 配置
 * @returns {Promise} axios请求
 */
const call = (callMethod, url, formData, config = {}) => {
  return new Promise((resolve, reject) => {
    callMethod(url, formData, config).then(res => {
      const { code, msg, data } = res;
      if (code !== 1) {
        reject({
          message: msg || ''
        });
        return;
      }
      resolve(res);
    })
      .catch(error => {
        if (error.status === 403) {
          window.location.href = '/#/login'
        }
        reject(error);
      })
  })
};

/**
 * 普通的ajax post请求
 *
 * @param {Object} formData  需要发送参数
 * @param {String} url 调用接口
 * @param {Object} [config] 配置
 * @returns 科里化后的call方法
 */
export const normalCallPost = (url, formData, config = {}) => {
  return call(post, url, formData, config);
};

/**
 * 普通的ajax get请求
 *
 * @param {Object} formData  需要发送参数
 * @param {String} url 调用接口
 * @param {Object} [config] 配置
 * @returns 科里化后的call方法
 */
export const normalCallGet = (url, formData, config = {}) => {
  return call(get, url, formData, config);
};

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
  doc: 'application/msword'
}

/**
 * 普通的ajax download请求
 *
 * @param {Object} formData  需要发送参数
 * @param {String} url 调用接口
 * @param {Object} [config] 配置
 * @returns {Promise<blob>}
 */
export const download = (url, formData, config = {}) => {
  return new Promise(async (resolve, reject) => {
    const option = Object.assign({}, config, {
      responseType: 'blob'
    })
    try {
      const data = await post(url, formData, option)
      const link = document.createElement('a')
      let blob
      let extName
      if (option.type == "zip") {
        blob = new Blob([data], { type: mimeMap.zip })
        extName = "zip"
      } else if (option.type == "excel") {
        blob = new Blob([data], { type: mimeMap.xlsx })
        extName = "xlsx"
      } else if (option.type == "doc") {
        blob = new Blob([data], { type: mimeMap.doc })
        extName = "doc"
      } else {
        extName = "xlsx"
      }

      let fileName = "导出"
      if (option.fileName) {
        fileName = option.fileName
      }

      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', `${fileName}.${extName}`) // 设置下载文件名称
      document.body.appendChild(link)
      link.click()
      document.body.appendChild(link)
      resolve();
    } catch (error) {
      reject(error);
    }
  })
};


export const downloadWithCustName = (url, formData, config = {}) => {
  return new Promise(async (resolve, reject) => {
    const option = Object.assign({}, config, {
      responseType: 'blob',
      baseURL: '/m',
      headers: {
        post: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }
    })
    try {
      const params = Object.assign({}, formData, {
        __mortals_token__: cookie.getItem('__mortals_token__'),
      })
      var requestData = Qs.stringify(params, { arrayFormat: 'repeat', allowDots: true });
      axios.post(url, requestData, option)
        .then(response => {
          if (response.data.type == 'application/json') {
            var reader = new FileReader();
            reader.onload = function (event) {
              var content = reader.result;
              reject(content);
            };
            reader.readAsText(response.data);
            return;
          }
          const filename = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1]) || `${url.substr(1).replace(/\//g, '_')}_${new Date().getTime()}.xls`
          let downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
          let link = document.createElement('a')
          link.style.display = 'none';
          link.href = downloadUrl;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        }, err => {
          reject(err);
        }).catch((error) => {
          reject(error)
        })
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * 普通的ajax upload请求
 *
 * @param {Object} formData  需要发送参数
 * @param {String} url 调用接口
 * @param {Object} [config] 配置
 * @returns 科里化后的call方法
 */
export const normalCallUpload = (url, formData, config = {}) => {
  return call(upload, url, formData, config);
};

/**
 * 使用队列的ajax请求，后自动cancel前一个请求
 *
 * @param {Object} formData  需要发送参数
 * @param {String} url 调用接口
 * @param {Object} [config] 配置
 * @returns  科里化后的call方法
 */
export const queueCall = (url, formData, config = {}) => {
  return call(queue, url, formData, config);
};

/**
 * 根据条件查询用户列表
 */
export async function getUserListByQuery(query) {
  try {
    /* //下拉只获取正常状态数据：status{0: "停用", 1: "正常", 2: "冻结", 3: "销户", 4: "离职"}
     query["query.status"] = 1;*/
    const data = await normalCallPost('/user/list', query);
    const list = data.data.result.map(({ id, loginName, realName, mobile }) => {
      return { id, loginName, realName, mobile }
    });
    return list;
  } catch (error) {
    return [];
  }
};


/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId] })) || 0
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  //循环所有项
  console.log("11111", cloneData)
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    //返回第一层
    return father[parentId] === rootId;
  });
  console.log("treeData", treeData)
  return treeData != '' ? treeData : data;
};


/**
     * 下载文件
     * @param {String} path - 下载地址/下载请求地址。
     * @param {String} name - 下载文件的名字/重命名（考虑到兼容性问题，最好加上后缀名）
     */
export function downloadFile(path, name) {
  if (path && name) {
    const xhr = new XMLHttpRequest();
    xhr.open("get", path);
    xhr.responseType = "blob";
    xhr.send();
    xhr.onload = function () {
      if (this.status === 200 || this.status === 304) {
        // 如果是IE10及以上，不支持download属性，采用msSaveOrOpenBlob方法，但是IE10以下也不支持msSaveOrOpenBlob
        if ("msSaveOrOpenBlob" in navigator) {
          navigator.msSaveOrOpenBlob(this.response, name);
          return;
        }
        // const blob = new Blob([this.response], { type: xhr.getResponseHeader('Content-Type') });
        // const url = URL.createObjectURL(blob);
        const url = URL.createObjectURL(this.response);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };
  }

}


// 当元素滚动条被滚动时运行的脚本
export function handleScroll() {
  let scrollbarEl = this.$refs["scroll"].wrap;
  let jump = document.querySelectorAll(".step-jump");

  scrollbarEl.onscroll = () => {
    let distance = scrollbarEl.scrollTop;
    jump.forEach((item, index) => {
      if (distance >= item.offsetTop) {
        this.activeStep = index;
      }
    });
  };
}
// 锚点点击
export function jump(index) {
  console.log(index);
  let _this = this;
  this.activeStep = index;
  // 用 class=".step-jump" 添加锚点，此时的类名要放在tr上，放在td上不对，
  // 以后做的时候要注意这点，不是表格的时候，如何放置锚点
  let jump = document.querySelectorAll(".step-jump");
  console.log("jump", jump);
  // 通过 offsetTop 获取对象到窗体顶部的距离，然后赋值给 scrollTop，就能实现锚点的功能
  let total = jump[index].offsetTop;
  console.log(total);
  // scrollTop滚动条距离页面的距离
  let distance = this.$refs["scroll"].wrap.scrollTop;
  // 平滑滚动，时长500ms，每10ms一跳，共50跳
  let step = total / 50;
  if (total > distance) {
    smoothDown();
  } else {
    let newTotal = distance - total;
    step = newTotal / 50;
    smoothUp();
  }
  function smoothDown() {
    if (distance < total) {
      distance += step;
      _this.$refs["scroll"].wrap.scrollTop = distance;
      setTimeout(smoothDown, 10);
    } else {
      _this.$refs["scroll"].wrap.scrollTop = distance;
      document.body.scrollTop = total;
      document.documentElement.scrollTop = total;
      window.pageYOffset = total;
    }
  }
  function smoothUp() {
    if (distance > total) {
      distance -= step;
      _this.$refs["scroll"].wrap.scrollTop = distance;
      setTimeout(smoothUp, 10);
    } else {
      _this.$refs["scroll"].wrap.scrollTop = distance;
    }
  }
};









