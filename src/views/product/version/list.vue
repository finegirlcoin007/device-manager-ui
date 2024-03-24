<template>
    <div class="page">
        <LayoutTable :data="tableData" :config="tableConfig">
          <el-button
              slot="table-head-left2"
              style="margin-left: 10px"
              type="primary"
              class="addclass"
              size="mini"
              @click="cloneAppBySite"
          >复制资源
          </el-button>
                    </LayoutTable>
        <drawer-show ref="drawerform" @ok="getData" />
    </div>
</template>

<script>
    /** 表单弹出框模式需引入 */

    import drawerShow from "./drawershow";
    import table from "@/assets/mixins/table";
    import session from "@/assets/utils/session";
    export default {
        name: "ProductVersionList",
        components: {
            drawerShow
},
        mixins: [table],
        created() {
          const siteid = session.getSession("siteid");
          this.query["siteId"] = siteid ? siteid : 1;
        },
        methods: {
          cloneAppBySite(row) {
            this.$post("/product/version/cloneAppBySite", {
              sourceSiteId: 1,
              targetSiteId: session.getSession("siteid"),
            })
                .then((res) => {
                  if (res.code == 1) {
                    this.$message.success("复制资源应用成功！");
                    this.getData();
                  }
                })
                .catch((error) => {
                  this.$message.error(error.message);
                });
          },
            /** 重写新增方法 */
            toAdd(row) {
              row.siteId = session.getSession("siteid");
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
          distribute(row) {
            this.$post("/product/version/publish", row)
                .then((res) => {
                  if (res.code == 1) {
                    this.$message.success("应用发布成功！");
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
                            name: "productName",
                            type: "text",
                            label: "产品类型",
                            fuzzy: true,
                        },
                    ],
                    columns: [
                        {type: "selection", width: 60},
                        {type: "index",label: "序号",width: 50},

                        {label: "产品类型", prop: "productId", formatter: this.formatter},

                        {label: "文件相对路径地址", prop: "filePath"},

                        {label: "版本号", prop: "version",formatter: this.formatter},

                        {label: "备注信息", prop: "remark"},

                        {label: "创建时间", prop: "createTime", formatter: this.formatterDate},
                        {
                            label: "操作",
                            width: 240,
                            formatter: row => {
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
                            }
                        }
                    ]
                }
            };
        }
    };
</script>
