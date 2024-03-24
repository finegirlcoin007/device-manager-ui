<template>
    <div class="page">
        <LayoutTable :data="tableData" :config="tableConfig">
                    </LayoutTable>
        <dialog-show ref="dialogform" @ok="getData" />
    </div>
</template>

<script>
    /** 表单弹出框模式需引入 */
    import dialogShow from "./dialogshow";
    import table from "@/assets/mixins/table";
    export default {
        name: "AppPublishList",
        components: {
            dialogShow
},
        mixins: [table],
        created() {
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
          distribute(row) {
            this.$post("/app/publish/active", row)
                .then((res) => {
                  if (res.code == 1) {
                    this.$message.success("模块部署成功！");
                    this.getData();
                  }
                })
                .catch((error) => {
                  this.$message.error(error.message);
                });
          },

        },
        data() {
            return {
                config: {
                    search: [
                      {
                          name: "appCode",
                          type: "text",
                          label: "应用编码",
                          fuzzy: true,
                      },
                      {
                          name: "appName",
                          type: "text",
                          label: "应用名称",
                          fuzzy: true,
                      },
                    ],
                    columns: [
                        {type: "selection", width: 60},
                        {type: "index",label: "序号",width: 50},

                        {label: "应用编码", prop: "appCode"},

                        {label: "应用名称", prop: "appName"},

                        {label: "文件路径地址", prop: "filePath"},

                        {label: "文件部署路径地址", prop: "distributeFilePath"},

                        {label: "应用类型", prop: "appType",formatter: this.formatter},

                        {label: "是否部署", prop: "distribute",formatter: this.formatter},

                        {label: "版本", prop: "version"},
                        {
                            label: "操作",
                            width: 240,
                          formatter: (row) => {
                            return (
                                <div>
                                  <table-buttons
                                      noAdd
                                      row={row}
                                      onEdit={this.toEdit}
                                      onView={this.toView}
                                      onDel={this.toDel}
                                  />
                                  <el-button
                                      size="mini"
                                      type="text"
                                      icon="el-icon-open"
                                      onClick={() => {
                                        this.distribute(row);
                                      }}
                                  >
                                    部署
                                  </el-button>
                                </div>
                            );
                          },
                        }
                    ]
                }
            };
        }
    };
</script>
