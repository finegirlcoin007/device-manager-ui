<template>
  <div>
    <Map ref="map" :markersData="originData" @choose="getDetailData">
      <el-row :gutter="20" slot="leftTop" class="mytree">
        <el-card>
          <div slot="header">
            <span><b class="cardTitle">站点分布</b></span>
            <el-button style="float: right" @click="switchStat" type="text"
              >切换为列表模式</el-button
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
      </el-row>
      <el-row :gutter="20" slot="rightTop" class="mytree">
        <el-card>
          <div slot="header">
            <span><b class="cardTitle">站点列表</b></span>
          </div>
          <div class="listbody">
            <div class="listtop">
              <div class="item sbzs">
                <div>{{ listNum.all }}</div>
                <div class="wz">设备总数(台)</div>
              </div>
              <div class="item zx">
                <div>{{ listNum.online }}</div>
                <div class="wz">在线(台)</div>
              </div>
              <div class="item lx">
                <div>{{ listNum.unline }}</div>
                <div class="wz">离线(台)</div>
              </div>
            </div>
            <div class="maplist">
              <div
                v-for="(item, index) in rightShowList"
                :key="index"
                class="deployitem"
              >
                <div class="top">
                  <div class="title">{{ item.label }}</div>
                  <div class="ckxq pointer" @click="getDetailData(item)">
                    查看详情
                  </div>
                </div>
                <div class="are">{{ item.detailAddress }}</div>
                <div class="data">
                  <div class="sbzs dataitem">
                    设备总数：<span>{{ item.deviceTotal }}台</span>
                  </div>
                  <div class="zx dataitem">
                    在线：<span>{{ item.onlineTotal }}台</span>
                  </div>
                  <div class="lx dataitem">
                    离线：<span>{{ item.offlineTotal }}台</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-row>
    </Map>
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
  mounted() {
    this.pageInfo.list = "/sitestat/list";
  },
  watch: {
    originData(newval) {
      let val = JSON.parse(JSON.stringify(newval));
      let arr = this.flatten(val).filter((v) => {
        return v.type == "site";
      });
      this.rightShowList = arr;
      let all = 0;
      let online = 0;
      let unline = 0;
      arr.forEach((v) => {
        all += parseInt(v.deviceTotal);
        online += parseInt(v.onlineTotal);
        unline += parseInt(v.offlineTotal);
      });
      this.listNum.all = all;
      this.listNum.online = online;
      this.listNum.unline = unline;
    },
  },
  created() {
    this.pageInfo.list = "/sitestat/list";
    // this.$get("/sitestat/maplist", {}).then(({ data }) => {
    // this.originData = data;
    // this.$refs.map.refresh(this.originData);
    // });

    this.$get("/sitestat/siteTree", {}).then(({ data }) => {
      let arr = [];
      data.data.forEach((i) => {
        arr.push({
          ...i,
          lat: i.latitude,
          lng: i.longitude,
          level: 1,
        });
      });
      this.originData = arr;
      this.areaData = JSON.parse(JSON.stringify(arr));
      this.$refs.map.refresh(this.originData);
    });
  },
  methods: {
    flatten(arr) {
      return arr.reduce((result, item) => {
        return result.concat(
          item,
          Array.isArray(item.children) ? this.flatten(item.children) : []
        );
      }, []);
    },
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
      this.isExport = true;
      this.$download(
        "/sitestat/exportExcel",
        {
          siteId: this.$route.query["siteId"],
          siteName: this.$route.query["siteName"],
        },
        { type: "excel" }
      )
        .then(() => (this.isExport = false))
        .catch((error) => {
          this.isExport = false;
          this.$message.error(error.message);
        });
    },

    getDetailData(info, callback) {
      this.$router.push({
        path: "/sitestat/mapDetail",
        // query: info,
        query: { sitestatId: info.siteStatId, siteId: info.siteId || info.id },
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
      //进入设备列表页面
      this.$router.push({
        path: "/device/list",
        query: {
          siteId: row.siteId,
        },
      });
    },

    switchStat() {
      this.$router.push({
        path: "/sitestat/list",
      });
    },

    handleNodeClick(node) {
      this.$refs.map.window.visible = false;
      this.currentNode = node;
      if (node.type === "site") {
        let obj = {};
        obj.lng = node.longitude;
        obj.lat = node.latitude;
        this.$refs.map.relocate(obj);
      }
      if (node.level == 1) {
        let arr = [];
        arr.push(JSON.parse(JSON.stringify(node)));
        this.originData = arr;
        this.$refs.map.refresh(this.originData);
        this.$refs.map.zoom = 6;
      } else {
        let children = JSON.parse(JSON.stringify(node.children));
        children = this.$refs.map.flatten(children);
        children.unshift(JSON.parse(JSON.stringify(node)));
        children = children.filter((v) => {
          return v.type == "site";
        });
        children = children.map((i) => {
          return {
            ...i,
            lat: i.latitude,
            lng: i.longitude,
          };
        });
        this.originData = children;
        this.$refs.map.refresh(this.originData);
      }
    },
  },
  data() {
    return {
      listNum: {
        all: 0,
        online: 0,
        unline: 0,
      },
      rightShowList: [],
      isExport: false,
      originData: [],
      config: {
        search: [
          {
            name: "siteName",
            type: "text",
            label: "站点名称",
          },
        ],
        columns: [
          { type: "selection", width: 60 },

          { label: "站点名称", prop: "siteName" },

          { label: "站点编号", prop: "siteCode" },

          { label: "设备总数", prop: "deviceTotal", formatter: this.formatter },

          { label: "在线数量", prop: "onlineCount", formatter: this.formatter },

          {
            label: "离线数量",
            prop: "offlineCount",
            formatter: this.formatter,
          },

          { label: "停用数量", prop: "stopCount", formatter: this.formatter },

          {
            label: "待激活数量",
            prop: "unActiveCount",
            formatter: this.formatter,
          },
          {
            label: "操作",
            width: 240,
            formatter: (row) => {
              return (
                <table-buttons
                  noAdd
                  noEdit
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

<style lang="less" scoped>
.deployitem {
  padding: 10px 0;
  color: #223333;
  border-bottom: 1px solid gainsboro;
  .top {
    display: flex;
    justify-content: space-between;
  }
  .ckxq {
    font-size: 12px;
    margin-right: 20px;
    margin-top: 8px;
    color: #1890ff;
    flex-shrink: 0;
  }
  .data {
    display: flex;
    font-size: 12px;
    font-weight: 500;
    color: #999999;
    margin: 4px 0;
    .dataitem {
      margin-right: 16px;
    }
    .sbzs > span {
      color: #223333;
    }
    .zx > span {
      color: #0064e9;
    }
    .zx {
      position: relative;
    }
    .zx::before {
      content: "";
      position: absolute;
      width: 4px;
      height: 4px;
      background: #0064e9;
      border-radius: 50%;
      top: 6px;
      left: -6px;
    }
    .lx > span {
      color: #fa4d4c;
    }
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    padding: 4px 0;
  }
  .are {
    font-size: 12px;
  }
}
.listbody::-webkit-scrollbar {
  width: 0;
}
.listbody {
  max-height: 700px;
  overflow: auto;
  .listtop {
    display: flex;
    justify-content: space-between;
    padding: 20px 0 10px;
    border-bottom: 1px solid #dcdcdc;
    .item {
      width: 120px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #fff;
      padding-bottom: 6px;
      font-size: 12px;
      .wz {
        margin-left: 14px;
      }
    }
    .sbzs {
      background: url("~@/assets/images/sbzs.png") no-repeat;
      background-size: 100% 100%;
    }
    .zx {
      background: url("~@/assets/images/zx.png") no-repeat;
      background-size: 100% 100%;
    }
    .lx {
      background: url("~@/assets/images/lx.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}
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

<style>
.amap-wrapper {
  width: 500px;
  height: 500px;
}
</style>
