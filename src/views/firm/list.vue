<template>
  <div class="page">
    <div class="xs-title">
      <div class="active">生产产商</div>
    </div>
    <LayoutTable :data="tableData" :config="tableConfig"> </LayoutTable>

    <drawer-show ref="drawerform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */

import drawerShow from "./drawershow";
import table from "@/assets/mixins/table";
export default {
  name: "FirmList",
  components: {
    drawerShow,
  },
  mixins: [table],
  created() { },
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
        search: [
          {
            name: "firmName",
            type: "text",
            label: "设备生产厂商名称",
            // fuzzy: true,
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

          { label: "设备生产厂商名称", align: "center", prop: "firmName" },

          { label: "设备生产商编码", align: "center", prop: "firmCode" },

          { label: "备注", align: "center", prop: "firmRemark" },

          {
            label: "创建时间",
            align: "center",
            prop: "createTime",
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

<style scoped lang="less">
.xs-title {
  padding-left: 20px;
  background: #fff;
  border-bottom: 1px solid #ededed;
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 14px;

  .active {
    color: #1890ff;
    font-weight: 600;
    border-bottom: 2px solid #1890ff;
    padding: 0 15px;
  }
}
</style>