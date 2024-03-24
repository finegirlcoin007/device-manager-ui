// 通过解析后的文本生成form表单页面
export default function f(list) {
  return `
<template>
  <layout-form>
    <el-form
      :model="form" 
      :loading="loading" 
      :rules="rules" 
      size='small'
      label-width='100px'
      ref="form" 
    >
      <el-row>
        ${fields(list)}
      </el-row>
      <form-buttons @submit='submitForm'/>
    </el-form>
  </layout-form>
</template>

<script>
import form from '@/assets/mixins/form';
export default {
  mixins: [form],
  data() {
    return {
      ${toString(list)},
      ${rules(list)},
    }
  }
}
</script>
`
}

// 生成fields
function fields(list) {
  return list.map(field).join('\n')
}
function field({name, label, type, size}) {
  if(type === 'tinyint'){  // 枚举类型
    return `<Field label="${label}" prop="${name}" v-model="form.${name}" :enumData='dict.${name}' type='select' :disabled="pageInfo.type === 'view'"/>`
  }

  if(size > 100 && size < 500) { // 长单行文本框
    return `<Field label="${label}" prop="${name}" v-model="form.${name}" :span='24' :disabled="pageInfo.type === 'view'"/>`
  }

  if(size > 500) { // 多行文本框
    return `<Field label="${label}" prop="${name}" v-model="form.${name}" type='textarea' :span='24' :disabled="pageInfo.type === 'view'"/>`
  }

  // 默认为单行文本框
  return `<Field label="${label}" prop="${name}" v-model="form.${name}" :disabled="pageInfo.type === 'view'"/>`
}

// 生成rules
function rules(list) {
  const rules = list.filter(item=>item.required).map(item=>{
    const {name, type, label} = item;
    const message = `请${type === "tinyint" ? "选择" : "输入"}${label}`;
    return `${name}: [{ required: true, message: '${message}', trigger: 'blur' },]`
  }).join(',\n');
  return `rules: {${rules}}`
}

// 对枚举类型字段生成toString
function toString(list) {
  const strings = list.filter(item=>item.type === 'tinyint').map(item=>{
    return `"${item.name}"`
  }).join(',');
  return `toString: [${strings}]`
}
