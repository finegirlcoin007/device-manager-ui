<template>
  <div class="page">
    <LayoutTable :data="tableData" notAdd notDel :config="tableConfig">
    </LayoutTable>

    <dialog-show ref="dialogform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import dialogShow from "./dialogshow";
import table from "@/assets/mixins/table";
import session from "@/assets/utils/session";
export default {
  name: "DeviceLog",
  components: { dialogShow },
  mixins: [table],
  created() {
    // this.siteId=window.sessionStorage.getItem('siteid') || null
    this.siteId = session.getSession("siteid") || null;
    this.query = Object.assign({}, this.query, { siteId: this.siteId });
  },
  methods: {
    /** 重写新增方法 */
    toAdd(row) {
      this.$refs.dialogform.add(row);
    },
    /** 重写编辑方法 */
    toEdit(row) {
      this.$refs.dialogform.edit(row);
    },
    /** 重写查看方法 */
    toView(row) {
      this.$refs.dialogform.view(row);
    },
  },
  data() {
    return {
      siteId: null,
      config: {
        search: [
          {
            name: "deviceCode",
            type: "text",
            label: "设备编号",
            // fuzzy: true,
          },
          {
            name: "messageHead",
            type: "text",
            label: "业务标识",
            // fuzzy: true,
          },
          {
            name: "logType",
            type: "select",
            label: "日志类型",
          },
        ],
        columns: [
          { label: "traceID", align: "center", prop: "traceID", width: 320 },

          {
            label: "设备编号",
            align: "center",
            prop: "deviceCode",
            width: 160,
          },

          {
            label: "设备名称",
            align: "center",
            prop: "deviceName",
            width: 160,
          },
          { label: "内容", align: "center", prop: "content" },

          {
            label: "业务标识",
            align: "center",
            prop: "messageHead",
            width: 80,
          },

          {
            label: "日志类型",
            align: "center",
            prop: "logType",
            formatter: this.formatter,
            width: 80,
          },

          {
            label: "创建时间",
            align: "center",
            prop: "createTime",
            formatter: this.formatterDate,
            width: 160,
          },
          //   {
          //     label: "操作",
          //     width: 240,
          //     formatter: (row) => {
          //       return (
          //         <table-buttons
          //           noAdd
          //           noEdit
          //           noDel
          //           row={row}
          //           onEdit={this.toEdit}
          //           onView={this.toView}
          //           onDel={this.toDel}
          //         />
          //       );
          //     },
          //   },
        ],
      },
    };
  },
};
</script>
