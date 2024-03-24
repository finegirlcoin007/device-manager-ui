<template>
  <div class="page">
    <div class="page-header">
      <div>
        <span style="font-size: 14px"
          ><b>设备列表</b> （
          <span style="margin-right: 6px">{{ siteName }}</span> 站点编码：{{
            siteCode
          }}
          ）</span
        >
        <el-link
          style="margin-left: 10px"
          type="primary"
          class="addclass"
          @click="switchMap"
          :underline="false"
          >地图模式
        </el-link>
      </div>
      <el-button style="margin-right: 10px" @click="handleBack" size="small"
        >返回上一级
      </el-button>
    </div>
    <el-divider></el-divider>
    <LayoutTable :data="tableData" :config="tableConfig">
      <el-button
        slot="table-head-left2"
        style="margin-left: 10px"
        type="primary"
        class="addclass"
        size="mini"
        @click="handleImport"
        >导入
      </el-button>
      <el-button
        slot="table-head-left2"
        style="margin-left: 10px"
        type="primary"
        class="addclass"
        size="mini"
        @click="doExport"
        :disabled="isExport"
        >导出
      </el-button>

      <el-button
        slot="table-head-left2"
        style="margin-left: 10px"
        type="primary"
        class="addclass"
        size="mini"
        @click="batchActiveDevice"
        >批量激活
      </el-button>

      <el-button
        slot="table-head-left2"
        style="margin-left: 10px"
        type="primary"
        class="addclass"
        size="mini"
        @click="batchUpdateHall"
        >更新大厅
      </el-button>

      <el-button
        slot="table-head-left2"
        style="margin-left: 10px"
        type="primary"
        class="addclass"
        size="mini"
        @click="batchRestartApp"
        >批量重启
      </el-button>
      <el-tag
        slot="table-body-head"
        size="mini"
        class="cursord"
        @click="changeStatAll()"
        >设备总数：{{ tableData.totalCount }}台
      </el-tag>

      <el-tag
        slot="table-body-head"
        size="mini"
        style="margin: 5px"
        type="success"
        class="cursord"
        @click="changeStat(2)"
        >在线：{{ tableData.onlineCount }}台
      </el-tag>

      <el-tag
        slot="table-body-head"
        size="mini"
        style="margin: 5px"
        type="danger"
        class="cursord"
        @click="changeStat(1)"
        >离线：{{ tableData.offlineCount }}台
      </el-tag>

      <el-tag
        slot="table-body-head"
        size="mini"
        style="margin: 5px"
        type="danger"
        class="cursord"
        @click="changeStatEnabled(0)"
        >停用：{{ tableData.stopCount }}台
      </el-tag>

      <el-tag
        slot="table-body-head"
        size="mini"
        style="margin: 5px"
        type="warning"
        class="cursord"
        @click="changeStat(0)"
        >未激活：{{ tableData.unActiveCount }}台
      </el-tag>
    </LayoutTable>

    <!-- 设备导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?siteId=' + siteId"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />
          是否更新已经存在的数据
          <el-link
            type="primary"
            class="addclass"
            style="font-size: 14px"
            @click="downloadTemplate"
            >下载模板
          </el-link>
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="addclass" @click="submitFileForm"
          >确 定</el-button
        >
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 站点修改对话框 -->
    <el-dialog
      :title="tree.title"
      :visible.sync="tree.open"
      width="40%"
      append-to-body
    >
      <span style="font-size: 13px"
        ><b>当前站点:</b> (<el-link
          style="margin-left: 10px"
          type="primary"
          class="addclass"
          :underline="false"
          >{{ siteName }}</el-link
        >
        站点编码：{{ siteCode }} )</span
      >
      <el-divider></el-divider>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="addclass" @click="updateSiteConform"
          >确 定</el-button
        >
        <el-button @click="tree.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 大厅修改对话框 -->
    <el-dialog
      :title="hallDialog.title"
      :visible.sync="hallDialog.open"
      width="60%"
      append-to-body
    >
      <el-form label-width="120px">
        <Field
          label="站点大厅"
          v-model="hallId"
          type="radio"
          :enumData="tableData.dict.hallId"
          placeholder="请选择所属大厅"
        />
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="addclass"
          @click="updateBatchHallConform"
          >确 定</el-button
        >
        <el-button @click="hallDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看二维码弹窗 -->
    <el-dialog
      title="设备二维码"
      :visible.sync="qrCodeDialog.visible"
      width="350px"
    >
      <img :src="qrCodeDialog.qrCode" />
      <p style="word-wrap: break-word">{{ qrCodeDialog.qrCodeUrl }}</p>
    </el-dialog>
    <!-- <dialog-show ref="dialogform" @ok="getData" /> -->

    <drawer-show ref="drawerform" @ok="getData" />

    <drawer-view ref="drawerViewform" :siteInfo="siteInfo" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import drawerView from "./drawerview";
import drawerShow from "./drawershow";
import table from "@/assets/mixins/table";
import tree from "@/assets/mixins/tree";

export default {
  name: "Device",
  components: { drawerShow, drawerView },
  mixins: [table, tree],
  data() {
    return {
      //二维码
      qrCodeDialog: {
        visible: false,
        qrCode: "",
        qrCodeUrl: "",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（设备导入）
        open: false,
        // 弹出层标题（设备导入）
        title: "导入设备数据",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 上传的地址
        url: "/m/device/importData",
      },

      hallDialog: {
        // 是否显示弹出层（设备导入）
        open: false,
        // 弹出层标题（设备导入）
        title: "所属大厅选择",
      },

      info: {},
      // 站点树
      tree: {
        // 是否显示弹出层（设备导入）
        open: false,
        // 弹出层标题（设备导入）
        title: "修改站点",
      },
      isExport: false,
      siteId: null,
      siteName: "",
      siteCode: "",
      siteInfo: {},
      updateSiteId: null,
      updateSiteName: "",
      updateSiteCode: "",

      hallId: null,
      hallName: "",

      config: {
        getsocketData: null,
        tableName: "table",
        search: [
          {
            name: "deviceName",
            type: "text",
            label: "设备名称",
            fuzzy: true,
          },
          {
            name: "deviceCode",
            type: "text",
            label: "设备编码",
            fuzzy: true,
          },
          {
            name: "orgName",
            type: "text",
            label: "所属机构",
            fuzzy: true,
          },
          {
            name: "productId",
            type: "select",
            label: "设备类型",
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

          { label: "设备名称", align: "center", prop: "deviceName" },

          {
            label: "设备类型",
            align: "center",
            prop: "productId",
            formatter: this.formatter,
          },

          { label: "设备编码", align: "center", prop: "deviceCode" },

          { label: "所属大厅", prop: "hallName" },
          { label: "所属机构", prop: "orgName" },
          {
            label: "设备生产商",
            align: "center",
            prop: "deviceFirmId",
            formatter: this.formatter,
            width: 250,
          },
          { label: "负责人", align: "center", prop: "leadingOfficial" },
          {
            label: "联系电话",
            align: "center",
            prop: "leadingOfficialTelephone",
          },
          {
            label: "状态 ",
            align: "center",
            prop: "deviceStatus",
            formatter: this.formatterStatus,
          },

          {
            label: "利旧设备",
            align: "center",
            prop: "source",
            formatter: this.formatterYES,
          },

          {
            prop: "enabled",
            align: "center",
            label: "启用/停用",
            width: 100,
            formatter: this.changeStatus,
          },

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
                <div>
                  <table-buttons
                    noAdd
                    row={row}
                    onEdit={this.toEdit}
                    onView={this.toView}
                    onDel={this.toDel}
                  />
                  <span> </span>
                  {row.deviceStatus === 0 ? (
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-open"
                      onClick={() => {
                        this.activeDevice(row);
                      }}
                    >
                      激活
                    </el-button>
                  ) : (
                    ""
                  )}
                  <span> </span>
                  <el-button
                    type="text"
                    size="mini"
                    onClick={() => this.viewQrCode(row.id)}
                  >
                    二维码
                  </el-button>
                  <span> </span>
                  <el-button
                    type="text"
                    size="mini"
                    onClick={() => this.restartApp(row)}
                  >
                    重启
                  </el-button>
                </div>
              );
            },
          },
        ],
      },
    };
  },
  created() {
    this.siteId = this.$route.query.siteId;
    this.info = this.$route.query;
    this.query = { siteId: this.siteId };

    this.$get("/sitestat/siteInfo", {
      siteId: this.siteId,
    })
      .then((res) => {
        if (res.code == 1) {
          //this.info=res.data
          this.siteName = res.data.siteName;
          this.siteCode = res.data.siteCode;
          this.siteInfo = res.data;
        }
      })
      .catch((error) => {
        this.$message.error(error.message);
      });

    // this.$router.push({ query: {siteId:this.siteId } });
  },
  methods: {
    switchMap() {
      this.$router.push({
        path: "/sitestat/mapDetail",
        query: this.info,
      });
    },
    /** 导入 */
    handleImport() {
      this.upload.title = "设备导入";
      this.upload.open = true;
    },

    /** 下载模板操作 */
    downloadTemplate() {
      this.isExport = true;
      this.$download(
        "/device/downloadTemplate",
        {},
        { type: "excel", fileName: "设备导入模板" }
      )
        .then(() => (this.isExport = false))
        .catch((error) => {
          this.isExport = false;
          this.$message.error(error.message);
        });
    },
    /** 文件上传中处理 */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    /** 文件上传成功处理 */
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getData();
    },
    /** 提交上传文件 */
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 导出Excel */
    doExport() {
      this.isExport = true;
      this.$download(
        "/device/exportExcel",
        {
          idList: this.selection,
          deviceName: this.$route.query["deviceName"],
          siteId: this.$route.query["siteId"],
        },
        { type: "excel", fileName: "设备表" }
      )
        .then(() => (this.isExport = false))
        .catch((error) => {
          this.isExport = false;
          this.$message.error(error.message);
        });
    },
    /** 重写新增方法 */
    toAdd(row) {
      //this.$refs.dialogform.add(row);
      row.siteId = this.siteId;
      row.siteName = this.siteName;
      row.siteCode = this.siteCode;

      this.$refs.drawerform.add(row);
    },
    /** 重写编辑方法 */
    toEdit(row) {
      row.siteName = this.siteName;
      row.siteCode = this.siteCode;
      this.$refs.drawerform.edit(row);
    },
    /** 重写查看方法 */
    toView(row) {
      this.$refs.drawerViewform.view(row);
    },

    changeStatAll() {
      delete this.query["productId"];
      delete this.query["deviceName"];
      delete this.query["deviceCode"];
      delete this.query["deviceStatus"];

      this.query["page"] = 1;
      this.query = Object.assign(this.query, {
        //deviceStatusList: [1, 2],
        // enabled: 1,
      });

      this.getData();
    },

    changeStatEnabled(enabled) {
      //去除其它条件
      this.query["page"] = 1;
      this.query = Object.assign(this.query, {
        // deviceStatusList: [1, 2],
        enabled: enabled,
      });

      this.getData();
    },

    changeStat(val) {
      //去除其它条件
      // delete this.query["productId"]
      //delete this.query["deviceName"]
      delete this.query["enabled"];
      this.query = Object.assign(this.query, { deviceStatus: val });
      this.query["page"] = 1;
      this.getData();
    },

    activeDevice(row) {
      this.$post("/device/active", {
        deviceCode: row.deviceCode,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("激活设备成功！");
            this.getData();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    batchActiveDevice(row) {
      this.$post("/device/batchActive", {
        idList: this.selection,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("批量激活设备成功！");
            this.getData();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    batchUpdateHall() {
      this.hallId = null;
      this.hallName = "";
      this.hallDialog.title = "设备所属大厅设置";
      this.hallDialog.open = true;
    },

    updateBatchHallConform(row) {
      this.hallName = this.tableData.dict.hallId[this.hallId];
      this.$post("/device/batchUpdateHall", {
        idList: this.selection,
        hallId: this.hallId,
        hallName: this.hallName,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("批量更新大厅设备成功！");
            this.hallDialog.open = false;
            console.log(this.$refs);
            this.selection = [];
            this.getData();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    batchRestartApp(row) {
      this.$post("/device/batchRestartApp", {
        idList: this.selection,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("批量重启设备应用成功！");
            this.getData();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    restartApp(row) {
      this.$post("/device/batchRestartApp", {
        idList: [row.id],
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("重启设备应用成功！");
            this.getData();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    updateSite(row) {
      this.$get("/sitestat/siteTree", {}).then(({ data }) => {
        this.areaData = data.siteTree;
        this.tree.open = true;
        this.tree.id = row.id;
      });
    },

    handleNodeClick(node) {
      this.currentNode = node;
    },

    updateSiteConform() {
      if (this.currentNode.type != "site") {
        this.$message.error("请选择正确的站点！");
        return;
      }

      this.loading = true;
      this.$post("/device/save", {
        id: this.tree.id,
        siteId: this.currentNode.id,
        siteCode: this.currentNode.siteCode,
        siteName: this.currentNode.label,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("编辑站点成功！");
            this.tree.open = false;

            this.getData();
          }
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error.message);
        });
    },
    // 操作菜单状态
    changeStatus(row, column) {
      return (
        <device-switch
          confirm
          url="/device/enable"
          row={row}
          onChange={this.statusChange}
          value={this.tableData.data}
          onInput={(data) => {
            this.tableData.data = data;
          }}
        />
      );
    },
    async viewQrCode(id) {
      try {
        const { qrCode, qrCodeUrl } = await this.$post("/device/viewQrCode", {
          id: id,
        });
        this.qrCodeDialog.qrCode = qrCode;
        this.qrCodeDialog.qrCodeUrl = qrCodeUrl;
        this.qrCodeDialog.visible = true;
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    // 返回
    handleBack() {
      let path = sessionStorage.getItem("sitestat");
      if (path) {
        this.$router.push({
          path,
          query: this.info,
        });
      } else {
        this.$router.back();
      }
    },
  },
  beforeDestroy() {
    sessionStorage.removeItem("sitestat");
  },
};
</script>
<style lang="less" scoped>
.page-header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-divider--horizontal {
  margin: 2px 0;
  background: 0 0;
  border-top: 1px solid #e8eaec;
}

.cursord {
  cursor: pointer;
}
</style>
