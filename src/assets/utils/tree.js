import Cache from './cache';

export class TreeCache extends Cache {
  /**
   *Creates an instance of TreeCache.
   * @param {string} fecthUrl 远程加载数据的url
   * @param {number} durtion 缓存有效时间(秒)
   * @memberof TreeCache
   */
  constructor(fecthUrl, durtion) {
    super(fecthUrl, durtion);
    this.pidCache = {};
    this.nameCache = {};
  }
  // 每次修改tree缓存数据后，清空pid和name缓存
  setData(data) {
    super.setData(data);
    this.pidCache = {};
    this.nameCache = {};
  }
  async getData() {
    const result = await super.getData();
    const data = result.map(item=>{
      //console.log(i)
      if(!item.parentId) {
        item.parentId = -1;
      }
      return item;
    });
    return this.cache.data = data;
  }

  async getTree() {
    const data = await this.getData();
    if(!data.length) return [];
    return buildTree(-1, data);
  }

  // 通过省获取区域id
  async getAreasByProvinceId(provinceList) {
    const data = await this.getData();
    const cities = data.filter(i=>provinceList.includes(i.parentId)).map(i=>i.id);
    const areas = await this.getAreasByCityId(cities);
    return areas
  }

  // 通过市获取区域id
  async getAreasByCityId(cityList) {
    const data = await this.getData();
    return data.filter(i=>cityList.includes(i.parentId) && i.level === 3).map(i=>i.id);
  }

  getPname(id) {
    if(!id) return '--';
    if(!this.nameCache[id]) {
      this.nameCache[id] = getParentName(id, this.cache.data, []).join('-');
    }
    return this.nameCache[id];
  }

  getPid(id) {
    if(!id) return [];
    
    if(!this.pidCache[id]) {
      this.pidCache[id] = getParentId(id, this.cache.data, []);
    }
    return this.pidCache[id];
  }
}



//export const treeCache = new TreeCache('/area/list', 6000);

/**
 * 获取父级节点的id列表
 *
 * @export
 * @param {string} id 当前节点id
 * @param {[]} list 全部节点列表
 * @param {string[]} arr 初始列表
 * @returns {string[]}
 */
export function getParentId(id, list, arr) {
  if(id != -1){
    arr.unshift(id);
  }
  let pid = '';
  try {
    pid = list.filter(i=>id == i.id)[0].parentId;
  } catch (error) {
    
  }
 
  if(pid) {
    return getParentId(pid, list, arr)
  }else{
    return arr;
  }
}

/**
 * 获取父级节点的name列表
 *
 * @export
 * @param {string} id 当前节点id
 * @param {[]} list 全部节点列表
 * @param {string[]} arr 初始列表
 * @param {string} name 获取到的name
 * @returns {string[]}
 */
export function getParentName(id, list, arr, name) {
  name && arr.unshift(name);
  let parent = '';
  let pid = '';
  try {
    parent = list.filter(i=>id == i.id)[0];
    pid = parent.parentId;
  } catch (error) {
    pid = null;
  }
 
  if(pid !== null) {
    return getParentName(pid, list, arr, parent.name)
  }else{
    return arr;
  }
}

/**
 * list to tree
 *
 * @export
 * @param {string} pid
 * @param {[]} list
 * @returns {[]}
 */
export function buildTree(pid, list) {
  const data = list.filter(i=>pid == i.parentId);
 
  return data.length ? data.map(i=>{
    return {
      value: i.id,
      label: i.name,
      level: i.level,
      children: buildTree(i.id, list),
    }
  }) : undefined
}


// 查找该条数据所处的层级深度
function getDeep(list, parentId, deep) {
  try {
    let pid = list.filter(i=>i.id == parentId)[0].parentId;
    deep++;
    if(pid != 0) {
      return getDeep(list, pid, deep);
    }else{
      return deep
    }
  } catch (error) {
    return deep;
  }
}
// 分组排序
function sort(list) {
  let array = [];
  list.filter(i=>(i.parentId===-1)).forEach(item=>{
    array = array.concat(child(list, item, []))
  })
  return array
}

function child(list, data, arr) {
  arr.push(data);
  if(data.hasChild) {
    list.filter(i=>i.parentId==data.id).forEach(item=>{
      return child(list, item, arr)
    })
  }
  return arr;
}


let treeData = [];


export let render = function(result) {
  return treeData = sort(result.map(i=>{
    i.hasChild = result.filter(j=>j.parentId==i.id).length > 0; // 是否有下级
    i.deep = getDeep(result, i.parentId, 0); // 缩进层级
    i.open = false;
    i.isShow = (i.parentId==-1);
    return i;
  }));
}

export let toggle = function(row) {
  // 关闭的时候，需要递归关闭下面全部子级
  let childId = []
  // 打开下级
  if(row.open) {
    childId = child(treeData, row, []).map(i=>i.id)
    childId.shift();
  }

  return treeData.map(i=>{
    if(i.id == row.id) {
      i.open = !i.open;
    }
    if(i.parentId == row.id) {
      i.isShow = !i.isShow;
    }
    if(childId.indexOf(i.id) > -1) {
      i.open = false;
      i.isShow = childId.indexOf(i.id) === -1
    }
    return i;
  })
  .filter(i=>i.isShow)
}