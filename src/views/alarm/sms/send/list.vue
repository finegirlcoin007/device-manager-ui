<template>
  <div class="page">
    <LayoutTable :data="tableData" notAdd notDel :config="tableConfig">
      <el-button slot="table-head-left2" type="primary" size="mini" @click="doExport"
        :disabled="isExport">导出</el-button>
    </LayoutTable>

    <drawer-show ref="drawerform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import drawerShow from "./drawershow";
import table from "@/assets/mixins/table";
import session from "@/assets/utils/session";
export default {
  name: "AlarmSmsSend",
  components: { drawerShow },
  mixins: [table],
  created() {
    this.query = Object.assign({}, this.query, {
      siteId: session.getSession("siteid") || null,
    });
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
      this.$refs.drawerform.view(row);
    },
    /** 导出Excel */
    doExport() {
      this.isExport = true;
      this.$download(
        "/alarm/sms/send/exportExcel",
        {
          idList: this.selection,
          sendStatus: this.$route.query["sendStatus"],
          sendTime: this.$route.query["sendTime"],
        },
        { type: "excel" }
      )
        .then(() => (this.isExport = false))
        .catch((error) => {
          this.isExport = false;
          this.$message.error(error.message);
        });
    },
  },
  data() {
    return {
      config: {
        search: [
          {
            name: "sendStatus",
            type: "select",
            label: "发送状态",
            fuzzy: true,
          },

          {
            name: "sendTimeStart",
            type: "datetime",
            label: "开始时间",
          },

          {
            name: "sendTimeEnd",
            type: "datetime",
            label: "结束时间",
            placeholder: "结束时间",
          },
        ],
        columns: [
          { type: "selection", align: "center", width: 60 },
          { type: "index", align: "center", label: "序号", width: 60 },

          { label: "发送内容", align: "center", prop: "sendMess", width: 500 },
          { label: "联系电话", align: "center", prop: "mobile" },

          { label: "接收人员", align: "center", prop: "receiver" },

          {
            label: "发送状态",
            align: "center",
            prop: "sendStatus",
            formatter: this.formatter,
          },

          {
            label: "发送时间",
            align: "center",
            prop: "sendTime",
            formatter: this.formatterDate,
          },
          {
            label: "操作",
            align: "center",
            width: 240,
            formatter: (row) => {
              return (
                <table-buttons
                  noAdd
                  noEdit
                  noDel
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
.buttons {
  display: flex;

  .el-row {
    margin-left: 20px;
  }
}
</style>