<template>
  <div class="page">
    <LayoutTable :data="tableData" :config="tableConfig" />
    <dialog-show ref="dialogform" @ok="getData" />
  </div>
</template>

<script>
import table from "@/assets/mixins/table";
import dialogShow from "./dialogshow";
export default {
  mixins: [table],
  components: { dialogShow },
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
        search: [
          {
            name: "name",
            type: "text",
            label: "任务名称",
          },
          {
            name: "status",
            type: "select",
            label: "任务状态",
          },
        ],
        columns: [
          {
            type: "selection",
            align: "center",
            reserveSelection: true,
            width: 60,
          },
          { type: "index", label: "序号", align: "center", width: 50 },
          {
            prop: "name",
            label: "任务名称",
            align: "center",
          },
          {
            prop: "excuteHost",
            label: "执行主机",
            align: "center",
          },
          {
            prop: "excuteContainer",
            label: "执行容器",
            align: "center",
          },
          {
            prop: "excuteStrategy",
            label: "执行策略",
            align: "center",
            formatter: this.formatter,
          },
          {
            prop: "lastExcuteHost",
            label: "最后执行主机",
            align: "center",
          },
          {
            prop: "lastExcuteTime",
            label: "最后执行时间",
            align: "center",
            formatter: this.formatterDate,
          },
          {
            prop: "status",
            align: "center",
            label: "执行状态",
            formatter: this.formatter,
          },
          {
            label: "操作",
            align: "center",
            width: 180,
            formatter: (row) => {
              return (
                <table-buttons
                  noView
                  row={row}
                  onEdit={this.toEdit}
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


