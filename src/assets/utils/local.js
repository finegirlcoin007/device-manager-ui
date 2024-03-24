/**
 *  本地存储函数
 */

 const local = {
    // 设置
    setLocal(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    },
  
    // 获取
    getLocal(key) {
      return JSON.parse(localStorage.getItem(key));
    },

    // 删除本地存储
    removeLocal(key){
      localStorage.removeItem(key)
    },
  
    // 清空本地存储
    clearLocal() {
      localStorage.clear();
    },
  };
  
  // 暴露
  export default local;