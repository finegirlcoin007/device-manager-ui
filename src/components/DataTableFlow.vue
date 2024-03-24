<script>
export default {
  props: {
    handleSelectionChange: {
      type: Function,
      required: false,
      default: () => {},
    },
    handleRowClick: {
      type: Function,
      required: false,
      default: () => {},
    },
    tableRowClassName: {
      type: Function,
      required: false,
      default: () => {},
    },
    tableData: {
      type: Array,
      required: false,
      default: () => [],
    },
    columns: {
      type: Array,
      required: false,
      default: () => [],
    },
    dict: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  methods: {
    // 开标状态
    bidStatus(v) {
      switch (v) {
        case 0:
          return "type1";
        case 4:
          return "type3";
        default:
          return "type2";
      }
    },
    // 格式化
    formatter(v, code) {
      return this.dict[code] ? this.dict[code][v] : "--";
    },
    cell(row, column, cellValue, index) {
      column.property = column.prop;
      if (column.formatter)
        return column.formatter(row, column, cellValue, index);
      return false;
    },
  },
  data() {
    return {
      src: require(`@/assets/images/1.png`),
    };
  },

  render() {
    return (
      <div>
        {this.tableData.map((item, index) => {
          let arrs = this.columns
            .filter((i) => !i.type)
            .filter((i) => !i.title)
            .filter((i) => i.flow);
          return (
            <el-row>
              <el-row gutter="20">
                <el-col span="22">
                  {" "}
                  <div
                    onClick={() =>
                      this.handleRowClick(item, this.columns, null)
                    }
                  >
                    <el-descriptions
                      column={arrs.length}
                      size="small"
                      title={this.columns
                        .filter((i) => i.title)
                        .map((column) => item[column.prop])}
                    >
                      {arrs
                        .filter((i) => i.label != "操作")
                        .map((column) => {
                          return (
                            <el-descriptions-item label={column.label}>
                              {this.cell(
                                item,
                                column,
                                item[column.prop],
                                index
                              ) || item[column.prop]}
                            </el-descriptions-item>
                          );
                        })}
                    </el-descriptions>
                  </div>
                  {arrs
                    .filter((i) => i.label == "操作")
                    .map((column) => {
                      return (
                        <div
                          style="margin-left:5px;margin-top:3px"
                          label={column.label}
                        >
                          {this.cell(item, column, item[column.prop], index) ||
                            item[column.prop]}
                        </div>
                      );
                    })}
                </el-col>
                <el-col span="2">
                  <span
                    class="state_box"
                    class={[this.bidStatus(item.projectOpenBidStatus)]}
                  >
                    {this.formatter(
                      item.projectOpenBidStatus,
                      "projectOpenBidStatus"
                    )}
                  </span>
                </el-col>
              </el-row>
              <el-row>
                {" "}
                <el-divider />
              </el-row>
            </el-row>
          );
        })}
      </div>
    );
  },
};
</script>

<style lang="less" scoped>
.state_box {
  position: relative;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  right: 15px;
  top: 10px;
  display: inline-block;
  border-radius: 50%;
  transform: rotateZ(45deg);
  font-size: 13px;
}
.type1 {
  color: tomato;
  border: 2px solid tomato;
  &:extend(.state_box);
}
.type2 {
  color: #1334a7;
  border: 2px solid #1334a7;
  &:extend(.state_box);
}
.type3 {
  color: #999;
  border: 2px solid #999;
  &:extend(.state_box);
}
</style>