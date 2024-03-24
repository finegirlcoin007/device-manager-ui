<template>
  <!-- 弹出框表单 -->
  <el-drawer
    :title="title"
    :visible.sync="open"
    :direction="direction"
    :destroy-on-close="true"
    size="80%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-tabs style="margin-left: 10px" v-model="activeName">
        <el-tab-pane label="设备详情" name="deviceDetail">
          <view-show :siteInfo="siteInfo" :form="viewInfo" :dict="dict" />
        </el-tab-pane>
        <el-tab-pane label="告警记录" name="alarmLog">
          <alarm-list :queryIn="{ alarmDevice: form.id }" />
        </el-tab-pane>
        <el-tab-pane label="模块管理" name="model">
          <module-list :queryIn="{ deviceId: form.id }" />
        </el-tab-pane>
      </el-tabs>
      <el-form-item
        style="text-align: center; margin-left: -100px; margin-top: 10px"
      >
        <el-button @click="deleteDevice()">删除设备</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import form from "@/assets/mixins/formdialog";
import viewShow from "./view";
import alarmList from "./alarm/info/list";
import moduleList from "./module/use/list";
import ImageUpload from "@/components/ImageUpload";
export default {
  mixins: [form],
  components: {
    ImageUpload,
    viewShow,
    alarmList,
    moduleList,
  },
  props: {
    siteInfo: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      activeName: "deviceDetail",
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "设备",
      // 是否显示弹出层
      open: false,
      viewInfo: {},
      direction: "rtl",
      toString: [
        "deviceFirmId",
        "platformId",
        "productId",
        "deviceSrc",
        "deviceDataSourceWay",
        "isReceiveMess",
        "deviceStatus",
        "enabled",
        "deviceFirmId",
        "source",
      ],
      // 表单校验
      rules: {
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          { max: 20, message: "最多只能录入20个字符", trigger: "blur" },
        ],
        platformId: [
          { required: true, message: "请选择平台", trigger: "blur" },
        ],
        productId: [{ required: true, message: "请选择产品", trigger: "blur" }],
      },
    };
  },

  methods: {
    /** 编辑 */
    edit(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.editUrl;
      this.getData();
      this.pageInfo.type = "edit";
      this.title = "修改设备";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.urls.currUrl = this.pageInfo.addUrl;
      this.pageInfo.type = "add";
      this.getData();
      this.title = "新增设备";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.pageInfo.type = "view";
      this.title = "设备详细";
    },
    /**取消按钮 */
    cancel() {
      this.open = false;
    },

    deleteDevice() {
      this.$get("/device/delete", {
        id: this.form.id,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("删除成功！");
            this.open = false;
            //this.getData();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    /**获取数据后弹框 */
    afterRender(data) {
      this.open = true;
      Object.assign(this.viewInfo, this.form);
      if (this.pageInfo.type == "add") {
        this.form.siteId = this.siteId;
        this.form.siteName = this.siteName;
        this.form.siteCode = this.siteCode;
      }
    },

    afterSubmit(data) {
      this.open = false;
      this.$emit("ok");
    },

    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
    handleClose() {},
  },
};
</script>
