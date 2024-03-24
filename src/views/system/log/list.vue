
<template>
  <div class="page">
    <LayoutTable :data="tableData" notAdd notDel :config="tableConfig" />
  </div>
</template>

<script>
import table from "@/assets/mixins/table";

export default {
  mixins: [table],
  data() {
    return {
      config: {
        search: [
          {
            name: "loginName",
            type: "text",
            label: "登录名",
            fuzzy: true,
          },
          {
            name: "requestUrl",
            type: "text",
            label: "请求地址",
            fuzzy: true,
          },
        ],
        columns: [
          {
            type: "index",
            align: "center",
            label: "序号",
            align: "center",
            width: 50,
          },

          {
            prop: "userName",
            label: "用户名称",
            align: "center",
          },

          {
            prop: "loginName",
            label: "用户登录名",
            align: "center",
          },

          {
            prop: "requestUrl",
            label: "请求地址",
            align: "center",
          },

          {
            prop: "content",
            label: "操作内容",
            align: "center",
          },

          {
            prop: "ip",
            label: "操作IP地址",
            align: "center",
          },

          {
            prop: "logDate",
            label: "操作时间",
            align: "center",
            formatter: this.formatterDate,
          },
        ],
      },
    };
  },
};
</script>
