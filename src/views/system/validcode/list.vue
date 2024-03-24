<template>
  <div class="page">
    <LayoutTable :data='tableData' :config='tableConfig' notAdd notDel />
  </div>
</template>

<script>
import table from '@/assets/mixins/table';

export default {
  mixins: [table],
  methods: {

  },
  data() {
    return {
      config: {
        columns: [
          {
            type: 'selection',
            width: 60,
          },
          {
            prop: 'id',
            label: 'ID',
            width: 60,
          },
          {
            prop: 'code',
            label: '验证码',
          },
          {
            prop: 'url',
            label: '校验地址',
          },
          {
            prop: 'mobile',
            label: '手机号码',
          },
          {
            prop: 'email',
            label: '校验邮箱',
          },
          {
            prop: 'type',
            label: '校验方式',
            width: 130,
            formatter: this.formatter,
          },
          {
            prop: 'sessionId',
            label: '会话ID'
          },
          {
            prop: 'ip',
            label: 'IP地址'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            prop: 'lapseTime',
            label: '失效时间'
          },
          {
            label: '操作',
            formatter: (row)=> {
              return (
                <table-buttons row={row} onEdit={this.toEdit} onDel={this.toDel} />
              )
            },
          },
        ],
        search: [
          {
            name: 'mobile',
            type: 'text',
            label: '手机号码',
          },
        ]
      },

    }
  }
}
</script>


