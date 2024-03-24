<template>
  <div class="page">
    <LayoutTable :data="tableData" notSearch :config="tableConfig">
    </LayoutTable>
    <!-- <dialog-show ref="dialogform" @ok="getData" /> -->
    <drawer-show ref="drawerform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import drawerShow from "./drawershow";
import table from "@/assets/mixins/table";
export default {
  name: "AlarmConfig",
  components: { drawerShow },
  mixins: [table],
  created() {},
  methods: {
    /** 重写新增方法 */
    toAdd(row) {
      //this.$refs.dialogform.add(row);

      this.$refs.drawerform.add(row);
    },
    /** 重写编辑方法 */
    toEdit(row) {
      this.$refs.drawerform.edit(row);
    },
    /** 重写查看方法 */
    toView(row) {
        this.$refs.drawerform.view(row);
    },
    // 操作菜单状态
    changeStatus(row, column) {
      return (
        <device-switch
          confirm
          url="/alarm/config/save"
          row={row}
          onChange={this.statusChange}
          value={this.tableData.data}
          onInput={(data) => {
            this.tableData.data = data;
          }}
        />
      );
    },
  },
  data() {
    return {
      config: {
        search: [],
        columns: [
          { type: "selection", align: "center", width: 60 },

          { label: "序号", align: "center", type: "index", width: 60 },
          {
            label: "告警内容",
            align: "center",
            prop: "alarmType",
            formatter: this.formatter,
          },
          {
            label: "设备类型",
            align: "center",
            prop: "productId",
            formatter: this.formatterString,
          },

          {
            label: "告警级别",
            align: "center",
            prop: "alarmLevel",
            formatter: this.formatter,
          },
          {
            label: "推送方式",
            align: "center",
            prop: "alarmPusW1ay",
            formatter: this.formatter,
          },
          { label: "备注", align: "center", prop: "remark" },

          {
            label: "创建时间",
            align: "center",
            prop: "createTime",
            formatter: this.formatterDate,
          },

          {
            label: "更新时间",
            align: "center",
            prop: "updateTime",
            formatter: this.formatterDate,
          },
          {
            prop: "enabled",
            align: "center",
            label: "启用/停用",
            width: 100,
            formatter: this.changeStatus,
          },

          {
            label: "操作",
            align: "center",
            width: 240,
            formatter: (row) => {
              return (
                <table-buttons
                  noAdd
                  row={row}
                  onEdit={this.toEdit}
                  onView={this.toView}
                  onDel={this.toDel}
                />
              );
            },
          },
        ],
      },
    };
  },
};
</script>
<style lang="less" >
.page {
  .table-head {
    height: 72px;
  }
}
</style>
