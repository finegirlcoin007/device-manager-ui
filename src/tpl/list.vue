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
          {
            prop: 'id',
            label: 'ID',
            width: 60,
          },
          {
            prop: 'name',
            label: '名称',
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
      },
    }
  }
}
</script>


