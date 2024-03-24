const Filter = function() {};

Filter.install = (Vue, options) => {

  /**
   * 转换日期格式为 yyyy-MM-dd
   *
   * @param {date} value 需要转换的日期
   * @returns
  */
  Vue.filter('date', function (value) {
    if(!value) return '';
    let date = new Date(value);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return y + '.' + m + '.' + d;
  });

  Vue.filter('courseType', function (value) {
    const courseTypeMap = {
      1: '直播',
      2: '点播',
    }
    return courseTypeMap[value] ? courseTypeMap[value] : value;
  });
}

export default Filter;


