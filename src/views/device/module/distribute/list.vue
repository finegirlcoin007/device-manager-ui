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

    <dialog-show ref="dialogform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */

import dialogShow from "./dialogshow";
import table from "@/assets/mixins/table";
import session from "@/assets/utils/session";
export default {
  name: "DeviceModuleDistributeList",
  components: {
    dialogShow,
  },
  mixins: [table],
  created() {
    const siteid = session.getSession("siteid");
    this.query["siteId"] = siteid ? siteid : 1;
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
      row.siteId = session.getSession("siteid");
      this.$refs.dialogform.add(row);
    },
    /** 重写编辑方法 */
    toEdit(row) {
      this.$refs.dialogform.edit(row);
    },
    /** 重写查看方法 */
    toView(row) {
      this.$get("/device/module/distribute/view", { id: row.id })
        .then((res) => {
          if (res.code == 1) {
            window.open(res.data.entity.filePath, "_blank");
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    handleSwitch(row) {
      console.log(row);
      this.loading = true;
      if (row.selected == 1) {
        this.$post("/device/module/distribute/selected", {
          id: row.id,
          selected: 0,
        })
          .then((res) => {
            if (res && res.code && res.code == 1) {
              row.selected = 0;
            }
            // console.log(res);
            // this.getData();

            // console.log(row)
            // if (res && res.code && res.code == 1) {
            //   this.getData();
            //   this.loading = false;
            // }else{
            //   this.$message.error(res.msg);
            // }
          })
          .catch((error) => {
            this.$message.error(error.message);
          });
      } else {
        this.$post("/device/module/distribute/selected", {
          id: row.id,
          selected: 1,
        })
          .then((res) => {
            if (res && res.code && res.code == 1) {
              row.selected = 1;
            }

            // this.getData();
            // if (res && res.code && res.code == 1) {
            //   this.getData();
            //   this.loading = false;
            // }else{
            //   this.$message.error(res.msg);
            // }
          })
          .catch((error) => {
            this.$message.error(error.message);
          });
      }
    },

    distribute(row) {
      this.$post("/device/module/distribute/active", row)
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
            name: "productName",
            type: "text",
            label: "产品",
            fuzzy: true,
          },
        ],
        columns: [
          { type: "selection", align: "center", width: 60 },
          { type: "index", align: "center", label: "序号", width: 50 },

          {
            label: "产品",
            align: "center",
            prop: "productId",
            formatter: this.formatter,
          },

          {
            label: "分辨率",
            align: "center",
            prop: "imageResolution",
            formatter: this.formatter,
          },

          { label: "版本号", align: "center", prop: "version" },
          {
            label: "默认选择",
            align: "center",
            prop: "selected",
            formatter: (row) => {
              return (
                <el-switch
                  value={row.selected + ""}
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1"
                  inactive-value="0"
                  onChange={() => {
                    this.handleSwitch(row);
                  }}
                ></el-switch>
              );
            },
          },
          {
            label: "是否部署",
            align: "center",
            prop: "distribute",
            formatter: this.formatter,
          },
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
                    部署
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
