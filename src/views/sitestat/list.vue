<template>
  <div class="page">
    <el-row :gutter="20" class="pd20">
      <el-col :span="6" :xs="12" class="mytree">
        <el-card>
          <div slot="header">
            <span><b class="cardTitle">站点分布</b></span>
            <el-button style="float: right" @click="switchStat" type="text"
              >切换为地图模式</el-button
            >
          </div>
          <el-scrollbar style="height: 100%">
            <el-tree
              size="mini"
              ref="siteTree"
              :data="areaData"
              id="el-tree"
              node-key="id"
              indent="4"
              :props="treeProps"
              :load="loadNode"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
              :render-content="renderContent"
              @node-click="handleNodeClick"
            >
            </el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>

      <el-col :span="18" :xs="12">
        <el-card>
          <el-row>
            <LayoutTable
              ref="layoutTable"
              :data="tableData"
              notAdd
              notDel
              :config="tableConfig"
            >
              <!-- <el-button
                slot="table-head-left2"
                style="margin-left: 10px"
                type="primary"
                class="addclass"
                size="mini"
                @click="doExport"
                :disabled="isExport"
                >导出
              </el-button> -->
            </LayoutTable>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <dialog-show ref="dialogform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import dialogShow from "./dialogshow";
import table from "@/assets/mixins/table";
import tree from "@/assets/mixins/tree";

export default {
  name: "Sitestat",
  components: { dialogShow },
  mixins: [table, tree],
  created() {
    this.$get("/sitestat/siteTree", {}).then(({ data }) => {
      // this.areaData = data.siteTree;
      this.areaData = data.data;
    });
  },
  methods: {
    /** 下载模板操作 */
    downloadTemplate() {
      this.isExport = true;
      this.$download("/sitestat/downloadTemplate", {}, { type: "excel" })
        .then(() => (this.isExport = false))
        .catch((error) => {
          this.isExport = false;
          this.$message.error(error.message);
        });
    },

    /** 导出Excel */
    doExport() {
      if (JSON.stringify(this.query) === "{}") {
        this.$message.warning("请先选择区域或者站点");
        return;
      }
      this.isExport = true;
      this.$download(
        "/sitestat/exportExcel",
        {
          ...this.query,
          size: 999,
        },
        { type: "excel", fileName: "站点设备统计信息" }
      )
        .then(() => (this.isExport = false))
        .catch((error) => {
          this.isExport = false;
          this.$message.error(error.message);
        });
    },

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
      let path = this.$route.path;
      sessionStorage.setItem("sitestat", path);
      //console.log(row)
      //进入设备列表页面
      this.$router.push({
        path: "/device/list",
        query: { sitestatId: row.id, siteId: row.siteId },
      });
    },

    switchStat() {
      this.$router.push({
        path: "/sitestat/maplist",
      });
    },

    handleNodeClick(node) {
      this.currentNode = node;
      if (node.type === "site") {
        //分页查询站点业务列表
        // this.siteMatterTable.siteId = node.id;
        //this.getSiteMatterTableData();

        if (node.id.search(",") > -1) {
          //this.query = { siteId: node.id.split(",")[0] ,siteIdList:node.id.split(",")}
          this.query = {
            siteIdList: node.id.split(",").map((i) => parseInt(i)),
          };
        } else {
          this.query = {
            siteId: node.id,
            //  siteName: node.label
          };
        }

        this.getData();
      } else if (node.type === "area") {
        this.query = { areaCode: node.areaCode };

        this.getData();
      }
      console.log(this.query);
    },
  },
  data() {
    return {
      isExport: false,
      config: {
        search: [
          {
            name: "siteName",
            type: "text",
            label: "站点名称",
          },
        ],
        columns: [
          {
            type: "selection",
            align: "center",
            reserveSelection: true,
            width: 60,
          },
          {
            type: "index",
            align: "center",
            label: "序号",
            width: 50,
          },

          { label: "站点名称", align: "center", prop: "siteName" },

          { label: "站点编号", align: "center", prop: "siteCode" },

          {
            label: "设备总数",
            align: "center",
            prop: "deviceTotal",
            // formatter: this.formatter,
          },

          {
            label: "在线数量",
            align: "center",
            prop: "onlineCount",
            // formatter: this.formatter,
          },

          {
            label: "离线数量",
            align: "center",
            prop: "offlineCount",
            // formatter: this.formatter,
          },

          {
            label: "停用数量",
            align: "center",
            prop: "stopCount",
            // formatter: this.formatter,
          },

          {
            label: "待激活数量",
            align: "center",
            prop: "unActiveCount",
            // formatter: this.formatter,
          },
          {
            label: "操作",
            align: "center",
            width: 240,
            formatter: (row) => {
              return (
                <table-buttons
                  noAdd
                  noEdit
                  noDel
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

<style>
.el-card__body {
  padding: 10px;
}

.el-calendar-table .el-calendar-day {
  height: 70px;
}

.is-selected {
  color: #fa3b19;
}
</style>

<style lang="scss" scoped>
.cardTitle {
  font-size: 16px;
  color: rgb(20, 134, 248);
  list-style-type: none;
  border-bottom: 3px solid rgb(20, 134, 248);
  padding-bottom: 2px;
}

.mytree ::v-deep {
  .el-tree--highlight-current
    ::v-deep
    .el-tree-node.is-checked
    > .el-tree-node__content {
    background-color: rgb(255, 255, 255);
    color: rgb(64, 158, 255);
  }

  .el-tree--highlight-current
    ::v-deep
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: rgb(255, 255, 255);
    color: rgb(64, 158, 255);
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node {
    position: relative;
    padding-left: 16px;
  }

  //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  .el-tree-node__children {
    padding-left: 16px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 24px;
  }
}
</style>
