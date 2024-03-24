<template>
  <div class="page">
    <LayoutTable :data="tableData" :config="tableConfig"> </LayoutTable>

    <dialog-show ref="dialogform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import dialogShow from "./dialogshow";
import table from "@/assets/mixins/table";
export default {
  name: "DeviceModule",
  components: { dialogShow },
  mixins: [table],
  created() {},
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
      config: {
        search: [{
            name: "moduleName",
            type: "text",
            label: "模块名称",
        }],
        columns: [
          { type: "selection", align: "center", width: 60 },
          { type: "index", align: "center", label: "序号", width: 50 },

          { label: "模块名称", align: "center", prop: "moduleName" },

          { label: "模块消息编码", align: "center", prop: "moduleMsgCode" },
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
