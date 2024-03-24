<template>
  <div class="page">
    <LayoutTable :data="tableData" notDel notSearch :config="tableConfig">
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
  name: "ProductList",
  components: {
    drawerShow,
  },
  mixins: [table],
  created() {    const siteid = session.getSession("siteid");
    this.query["siteId"]=siteid?siteid:1;
    },
  methods: {
    cloneAppBySite(row) {
      this.$post("/device/module/distribute/cloneAppBySite", {
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

    selectDeviceVersiion(row) {
       this.$post("/product/upGrade", {
        id: row.id,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("产品升级命令下发成功！");
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });

    },

    distribute(row) {
      this.$post("/product/publish", row)
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
  //   beforeRouteEnter(to, from, next) {next(vm => {
  //     // 通过 `vm` 访问组件实例
  //     console.log(vm)
  //   })},
  data() {
    return {
      config: {
        search: [],
        columns: [
          // {type: "selection", width: 60},
          {
            type: "index",
            align: "center",
            label: "序号",
            width: 50,
          },

          {
            label: "关联平台",
            align: "center",
            prop: "platformId",
            formatter: this.formatter,
          },

          { label: "产品名称", align: "center", prop: "productName" },

          { label: "产品编码", align: "center", prop: "productCode" },

          { label: "备注", align: "center", prop: "productRemark" },
          {
            label: "操作",
            align: "center",
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
                    发布
                  </el-button>
                 <span> </span>
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-open"
                      onClick={() => {
                        this.selectDeviceVersiion(row);
                      }}
                    >
                      升级
                    </el-button>
                  </div>
              );
            },
          },
        ],
      },
    };
  },
};
</script>
