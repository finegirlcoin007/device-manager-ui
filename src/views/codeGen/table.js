// 通过解析后的文本生成form表单页面
export default function f(list) {
  return `
<template>
  <div class="page">
    <LayoutTable :data='tableData' :config='tableConfig' />
  </div>
</template>

<script>
import table from '@/assets/mixins/table';

export default {
  mixins: [table],
  data() {
    return {
      config: {
        search: [
          {
            name: 'name',
            type: 'text',
            label: '名称',
          },
        ],
        columns: [
          {
            type: 'selection',
            width: 60,
          },
          ${columns(list)}
          {
            label: '操作',
            width: 180,
            formatter: (row)=> {
              return (
                <table-buttons row={row} onEdit={this.toEdit} onView={this.toView} onDel={this.toDel} />
              )
            },
          },
        ],
      },
    }
  }
}
</script>
`
}

// 生成fields
function columns(list) {
  return list.map(column).join('\n')
}
function column({name, label, type, size}) {
  if(type === 'tinyint') { // 枚举类型
    return `
    {
      prop: '${name}',
      label: '${label}',
      width: 70,
      formatter: this.formatter
    },
    `
  }
  if(type === 'datetime') { // 时间戳类型
    return `
    {
      prop: '${name}',
      label: '${label}',
      width: 140,
      formatter: this.formatterDate
    },
    `
  }
  return `
  {
    prop: '${name}',
    label: '${label}',
  },
  `
}
