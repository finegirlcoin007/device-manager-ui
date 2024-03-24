export default {
  props: {
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
    tableRowClassName: {
      type: Function,
      required: false,
      default: () => {}
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
  methods: {
    cell(row, column, cellValue, index) {
      column.property = column.prop;
      if(column.formatter) return column.formatter(row, column, cellValue, index)
      return false;
    },
  },
  render() {
    return (
      <div>
      {
        this.tableData.map((item, index)=>{
          return <div class="el-card mobile-table-card" key={index}>
          {
            this.columns.filter(i=>!i.type).map(column=>{
              return <div class="cell flex flex-pack-justify mobile-table-cell" key={column.id}>
                <div class="cell-title">{column.label}</div>
                <div class="cell-content flex-1">{this.cell(item, column, item[column.prop], index) || item[column.prop]}</div>
              </div>
            })
          }
        </div>
        })
      }
      </div>
    )
  }
}


