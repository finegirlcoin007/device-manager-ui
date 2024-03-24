// 解析文本内容
export default function parser(string) {
  try {
    return string.split('\n').map(item=>{ // 多行分割为单行文本
      let [name, label, originType, required] = item.split(/\s+/); // 按照空格切分单行文本，分别对应
      let [type, size] = originType.split('('); // 从type中获取类型和限制长度
      size = parseInt(size, 10);
      required = required === '是' || false;
      return {name, label, type, size, required}
    });
  } catch (error) {
    console.error(error)
    return [];
  }
}