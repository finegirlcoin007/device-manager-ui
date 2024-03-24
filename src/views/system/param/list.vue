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
    // 新增
    toAdd(row) {
      this.$refs.dialogform.add(row);
    },
    // 编辑
    toEdit(row) {
      this.$refs.dialogform.edit(row);
    },
    // 查看
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
            label: "参数名称",
            fuzzy: true,
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
            align: "center",
            label: "参数名称",
          },
          {
            prop: "firstOrganize",
            align: "center",
            label: "一级组织",
          },
          {
            prop: "secondOrganize",
            align: "center",
            label: "二级组织",
          },
          {
            prop: "paramKey",
            align: "center",
            label: "参数键",
          },
          {
            prop: "paramValue",
            align: "center",
            label: "参数值",
            // formatter: this.util_short('paramValue', 20)
          },
          {
            prop: "validStatus",
            align: "center",
            label: "有效状态",
            width: 70,
            formatter: this.formatter,
          },
          {
            prop: "modStatus",
            align: "center",
            label: "修改状态",
            width: 100,
            formatter: this.formatter,
          },
          {
            prop: "displayType",
            align: "center",
            label: "展现类型",
            width: 100,
            formatter: this.formatter,
          },
          {
            prop: "remark",
            align: "center",
            label: "备注",
          },
          {
            label: "操作",
            align: "center",
            width: 260,
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
<style lang="css">
.el-tooltip__popper {
  display: inline-block;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 18px;
  cursor: pointer;
}
</style>


