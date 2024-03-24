/**
 *  本地存储函数
 */

const session = {
  // 设置
  setSession(key, val) {
    sessionStorage.setItem(key, JSON.stringify(val));
  },

  // 获取
  getSession(key) {
    return JSON.parse(sessionStorage.getItem(key));
  },

  // 删除本地存储
  removeSession(key) {
    sessionStorage.removeItem(key);
  },

  // 清空本地存储
  clearSession() {
    sessionStorage.clear();
  },
};

// 暴露
export default session;
