class Cache {
  constructor(fecthUrl, durtion) {
    this.cache = {
      time: 0,
      data: '',
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
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve('data from fecth');
      }, 2000)
    })
  }
}

class TreeCache extends Cache {
  constructor(fecthUrl, durtion) {
    super(fecthUrl, durtion);
  }
  async getData() {
    const data = await super.getData();
    return data+'1111111111';
  }
}




let cache = new TreeCache('', 4);
cache.setData([1,2,3])
cache.getData().then(console.log)

setTimeout(()=>{
  cache.getData().then(console.log)
}, 5000)
