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
  components: {
    dialogShow,
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
      config: {
        search: [
          {
            name: "name",
            type: "text",
            label: "资源名称",
            fuzzy: true,
          },
          {
            name: "authType",
            type: "select",
            label: "权限类型",
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
          // {
          //   prop: 'id',
          //   label: 'ID',
          // },
          {
            prop: "name",
            align: "center",
            label: "名称",
          },
          {
            prop: "url",
            align: "center",
            label: "资源",
          },
          {
            prop: "authType",
            align: "center",
            label: "认证类型",

            formatter: this.formatter,
          },
          // {
          //   prop: 'userType',
          //   label: '用户类型',
          //   width: 100,
          //   formatter: this.formatter,
          // },
          {
            label: "操作",
            align: "center",
            witdh: 120,
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

