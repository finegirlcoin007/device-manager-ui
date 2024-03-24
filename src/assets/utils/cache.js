import {normalCallPost} from './index';

export default class Cache {
  constructor(fecthUrl, durtion) {
    this.cache = {
      time: 0,
      data: [],
    };
    this.durtion = durtion;
    this.fecthUrl = fecthUrl;
  }
  async getData() {
    const currTime = new Date().getTime();
    // 缓存过期，重新拉取
    if(currTime - this.cache.time > this.durtion * 1000) {
      const data = await this.fecthData();
      this.setData(data);
      return data;
    }
    return this.cache.data
  }
  setData(data) {
    this.cache.data = data;
    this.cache.time = new Date().getTime();
  }
  fecthData() {
    return new Promise(async (resolve)=>{
      const {data} = await normalCallPost(this.fecthUrl, {pageInfo: {prePageResult: -1}});
      resolve(data.data);
    })
  }
}