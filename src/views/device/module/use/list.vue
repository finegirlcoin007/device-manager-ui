<template>
  <div class="page">
    <LayoutTable
      :data="tableData"
      notAdd
      notDel
      notSearch
      :config="tableConfig"
    >
    </LayoutTable>

    <dialog-show ref="dialogform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import dialogShow from "./dialogshow";
import table from "@/assets/mixins/table";
export default {
  name: "DeviceModuleUse",
  props: {
    queryIn: {
      type: Object,
      default: null,
    },
  },
  components: { dialogShow },
  mixins: [table],
  created() {
    //this.config.addQuery = { deviceId, deviceType };

    if (this.queryIn.deviceId) {
      this.query = {};
      this.query["deviceId"] = this.queryIn.deviceId;
    }

    // this.changePath("/device/alarm/info")

    this.pageInfo.list = "/device/module/use/list";
    this.pageInfo.del = "/device/module/use/delete";
    this.pageInfo.add = "/device/module/use/add";
    this.pageInfo.edit = "/device/module/use/edit";
    this.pageInfo.view = "/device/module/use/view";
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
    // toView(row) {
    //     this.$refs.dialogform.view(row);
    // },
  },
  data() {
    return {
      config: {
        search: [],
        columns: [
          { label: "模块名称", align: "center", prop: "moduleName" },

          //   { label: "模块消息编码", prop: "moduleMsgCode" },

          {
            label: "设备名称",
            align: "center",
            prop: "deviceId",
            formatter: this.formatterString,
          },

          {
            label: "产品名称",
            align: "center",
            prop: "platformAndProductName",
          },

          { label: "调用次数", align: "center", prop: "useNum" },
        ],
      },
    };
  },
};
</script>