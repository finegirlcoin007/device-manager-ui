<template>
  <div class="page">
    <LayoutTable :data="tableData" :config="tableConfig"> </LayoutTable>

    <drawer-show ref="drawerform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import drawerShow from "./drawershow";
import table from "@/assets/mixins/table";
export default {
  name: "Platform",
  components: { drawerShow },
  mixins: [table],
  created() {},
  methods: {
    /** 重写新增方法 */
    toAdd(row) {
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
  },
  data() {
    return {
      config: {
        search: [{
            name: "platformName",
            type: "text",
            label: "平台名称",
        },{
            name: "platformSn",
            type: "text",
            label: "平台编码",
        }],
        columns: [
          {
            type: "selection",
            align: "center",
            reserveSelection: true,
            width: 60,
          },
          { type: "index", label: "序号", align: "center", width: 50 },

          {
            label: "平台名称，名称唯一",
            align: "center",
            prop: "platformName",
          },

          { label: "平台编码，编码唯一", align: "center", prop: "platformSn" },

          {
            label: "发送第三方平台消息类型",
            align: "center",
            prop: "sendMsgType",
            formatter: this.formatter,
          },

          {
            label: "是否启用发送消息",
            align: "center",
            prop: "sendSwitch",
            formatter: this.formatter,
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