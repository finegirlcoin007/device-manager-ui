<template>
  <div class="page">
    <LayoutTable :data="tableData" notAdd notDel :config="tableConfig">
      <el-button slot="table-head-left2" type="primary" class="addclass"  size="mini" @click="doExport"
        :disabled="isExport">导出</el-button>

      <el-tag slot="table-head-row2-left" size="mini" style="margin: 10px">告警次数：{{ tableData.totalCount }}次</el-tag>

      <el-tag slot="table-head-row2-left" size="mini" style="margin: 10px" type="danger">危险：{{ tableData.dangerCount
      }}次</el-tag>

      <el-tag slot="table-head-row2-left" size="mini" style="margin: 10px" type="warning">次要：{{ tableData.subCount
      }}次</el-tag>

      <el-tag slot="table-head-row2-left" size="mini" style="margin: 10px" type="info">一般：{{ tableData.normalCount
      }}次</el-tag>
    </LayoutTable>

    <!-- <dialog-show ref="dialogform" @ok="getData" /> -->
    <drawer-show ref="drawerform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import drawerShow from "./drawershow";
// import dialogShow from "./dialogshow";
import table from "@/assets/mixins/table";
export default {
  name: "DeviceAlarmInfo",
  props: {
    queryIn: {
      type: Object,
      default: null,
    },
  },
  components: { drawerShow },
  mixins: [table],
  created() {
    if (this.queryIn && this.queryIn.alarmDevice) {
      this.query = {};
      this.query["alarmDevice"] = this.queryIn.alarmDevice;
    }
    this.changePath("/device/alarm/info");

    this.query = Object.assign({}, this.query, { siteId: 1 });
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
      // this.$refs.dialogform.view(row);
      this.$refs.drawerform.view(row);
    },
    /** 导出Excel */
    doExport() {
      this.isExport = true;
      this.$download(
        "/device/alarm/info/exportExcel",
        {
          idList: this.selection,
          alarmDevice: this.$route.query["alarmDevice"],
          alarmType: this.$route.query["alarmType"],
          alarmStatus: this.$route.query["alarmStatus"],
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
            name: "alarmStatus",
            type: "select",
            label: "告警状态",
          },

          {
            name: "alarmTimeStart",
            type: "datetime",
            label: "开始时间",
          },

          {
            name: "alarmTimeEnd",
            type: "datetime",
            label: "结束时间",
            placeholder: "结束时间",
          },
        ],
        columns: [
          {
            type: "selection",
            align: "center",
            reserveSelection: true,
            width: 60,
            label: "全选",
          },
          {
            type: "index",
            align: "center",
            label: "序号",
            width: 50,
          },

          {
            label: "告警时间",
            align: "center",
            prop: "alarmTime",
            formatter: this.formatterDate,
          },

          {
            label: "告警设备",
            align: "center",
            prop: "alarmDevice",
            formatter: this.formatter,
          },
          {
            label: "设备类型",
            align: "center",
            prop: "productName",
            formatter: this.formatter,
          },
          {
            label: "告警内容",
            align: "center",
            prop: "alarmContent",
          },

          {
            label: "告警级别",
            align: "center",
            prop: "alarmLevel",
            formatter: this.formatter,
          },

          {
            label: "接收人员,",
            align: "center",
            prop: "alarmReceivePersonnel",
          },

          {
            label: "告警状态",
            align: "center",
            prop: "alarmStatus",
            formatter: this.formatter,
          },
          {
            label: "操作",
            align: "center",
            width: 240,
            formatter: (row) => {
              return (
                <table-buttons
                  row={row}
                  noEdit={true}
                  noDel={true}
                  onView={this.toView}
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