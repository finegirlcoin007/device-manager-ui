<template>
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      @row-click="handleRowClick"
      :row-class-name="tableRowClassName"
      :default-expand-all="expand"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >

 <el-table-column
        v-for='column in columns'
        :key='column.prop'
        :type="column.type"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :show-overflow-tooltip="column.tooltip"
        :align="column.align || 'left'"
        :formatter='column.formatter'
      >
      </el-table-column>
    </el-table>
</template>

<script>

export default {
  props: {
    handleSpanMethod: {
      type: Function,
      required: false,
      default: () => {}
    },

    handleRowClick: {
      type: Function,
      required: false,
      default: () => {}
    },

    tableRowClassName: {
      type: Function,
      required: false,
      default: () => {}
    },
    loading: {
      type: Boolean,
      required: false,
      default: true
    },
    expand: {
      type: Boolean,
      required: false,
      default: true
    },
    tableData: {
      type: Array,
      required: false,
      default: () => []
    },
    columns: {
      type: Array,
      required: false,
      default: ()=> [],
    }
  },
  computed: {
    emptyText() {
       return (!this.loading && !this.tableData.length) ? '暂无数据' : '加载中...'
    },
  },
  data() {
    return {}
  }
}
</script>


