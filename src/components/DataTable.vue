<template>
  <el-table
    size='small'
    :ref="tableName"
    :data="tableData"
    :row-key="handleRowKeyMethod"
    :span-method="handleSpanMethod"
    :toggleRowSelection="toggleRowSelection"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
    @row-click="handleRowClick"
    :row-class-name="tableRowClassName"
    :empty-text='emptyText'
    border
    style="width: 100%">
      <el-table-column
        v-for='column in columns'
        :key='column.prop'
        :type="column.type"
        :index="handleIndexMethod"
        :selectable="handleSelectableMethod"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :sortable="column.sortable"
        :show-overflow-tooltip="column.tooltip"
        :align="column.align || 'left'"
        :formatter='column.formatter'
        :reserve-selection='column.reserveSelection'
        :subColumns='column.subColumns'

      >
        <el-table-column
          v-for='sunColumn in column.subColumns'
          :key='sunColumn.prop'
          :type="sunColumn.type"
          :prop="sunColumn.prop"
          :label="sunColumn.label"
          :width="sunColumn.width"
          :sortable="sunColumn.sortable"
          :align="sunColumn.align || 'left'"
          :formatter='sunColumn.formatter'

        />
      </el-table-column>
  </el-table>
</template>

<script>

export default {
  props: {
    handleRowKeyMethod: {
      type: Function,
      required: false,
      default: row => { return row.id }
    },
    handleSelectableMethod: {
      type: Function,
      required: false,
      default: () => {}
    },
    handleIndexMethod: {
      type: Function,
      required: false,
      default: () => {}
    },
    handleSpanMethod: {
      type: Function,
      required: false,
      default: () => {}
    },
    toggleRowSelection: {
      type: Function,
      required: false,
      default: () => {}
    },
    handleSelectionChange: {
      type: Function,
      required: false,
      default: () => {}
    },
    handleRowClick: {
      type: Function,
      required: false,
      default: () => {}
    },
    handleSortChange: {
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
    tableData: {
      type: Array,
      required: false,
      default: () => []
    },
    columns: {
      type: Array,
      required: false,
      default: ()=> [],
    },
    tableName: {
      type: String,
      required: false,
      default: "table",
    }
  },
  computed: {
    emptyText() {
       return (!this.loading && !this.tableData.length) ? '暂无数据' : '加载中...'
    },
  },
  methods:{
  },
  data() {
    return {}
  }
}
</script>


