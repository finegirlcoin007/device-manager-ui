// table-list 所需的一系列操作方法


/**
 * formatter
 *
 * @param {*} tableData 表单数据
 * @param {*} column 列数据
 * @returns {string} val 解析后的结果
 */
const formatter = (tableData, column, val) => {
  const key = column.property;
  if(tableData.dict && tableData.dict[key]){
    const dict = tableData.dict[key]
    return dict[val] || val;
  }
  return val;
};

/**
 * formatterAmount
 *
 * @param {*} row 单元格数据
 * @param {*} column 列数据
 * @returns {string} val 解析后的结果
 */
const formatterAmount = (row, column) => {
  const property = column.property;
  const amount = row[property];
  if(!amount){
	  return '0.00';
  } 
  if(amount == 0){
	  return '0.00'; 
  } 
  return amount;
};

/**
 * formatterDate
 *
 * @param {*} row 单元格数据
 * @param {*} column 列数据
 * @returns {string} val 解析后的结果
 */
const formatterDate = (row, column) => {
  const property = column.property;
  const time = row[property];
  if(!time) return '';
  let date = new Date(Number(time));
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D = panLeft(date.getDate()) + ' ';
  let h = panLeft(date.getHours()) + ':';
  let m = panLeft(date.getMinutes()) + ':';
  let s = panLeft(date.getSeconds());
  return Y+M+D+h+m+s;
};

/**
 * formatterDateOnly
 *
 * @param {*} row 单元格数据
 * @param {*} column 列数据
 * @returns {string} val 解析后的结果
 */
const formatterDateOnly = (row, column) => {
  const property = column.property;
  const time = row[property];
  if(!time) return '';
  let date = new Date(Number(time));
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D = panLeft(date.getDate()) + ' ';
  return Y+M+D;
};

function panLeft(num){
  return num < 10 ? '0'+num : num;
}

/**
 * 通过id从数组中查找
 *
 * @param {array} list 数组
 * @param {string} key 需要查找的key
 * @param {string} val 需要查找的val
 * @returns {object} data 找到的数据
 */
const find = (list, key, val) => {
  let index = -1;
  let data = null;
  list.forEach((item, i)=>{
    if(item[key] === val){
      index = i;
      data = JSON.parse(JSON.stringify(item));
      return;
    }
  })
  return {
    index,
    data,
  }
}


export {
  formatter,
  formatterAmount,
  formatterDate,
  formatterDateOnly,
  find,
};