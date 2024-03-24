<template>
  <!-- 弹出框表单 -->
  <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <!-- <Field :span="20" label="设备名称"  prop="deviceName" v-model="form.deviceName" placeholder="请输入设备名称"/> -->
        <Field
          :span="20"
          label="设备编码"
          prop="deviceCode"
          v-model="form.deviceCode"
          placeholder="请输入设备编码"
        />
        <Field
          :span="20"
          label="平台类型"
          prop="platformId"
          v-model="form.platformId"
          type="select"
          :enumData="dict.platformId"
          placeholder="请选择平台类型"
        />
        <Field
          :span="20"
          label="产品类型"
          prop="productId"
          v-model="form.productId"
          type="select"
          :enumData="dict.productId"
          placeholder="请选择产品类型"
        />
        <Field
          :span="20"
          label="设备的MAC地址"
          prop="deviceMac"
          v-model="form.deviceMac"
          placeholder="请输入设备的MAC地址"
        />
        <!-- <Field :span="20" label="中心设备编码"  v-model="form.centernum" placeholder="请输入中心设备编码"/> -->
        <Field :span="20" disabled label="设备访问ip" v-model="form.ip" />
        <Field :span="20" disabled label="端口" v-model="form.port" />
        <Field :span="20" disabled label="站点编号" v-model="form.siteNum" />
        <Field
          :span="20"
          label="设备生产商："
          placeholder="请选择设备生产商"
          prop="deviceFirmId"
          v-model="form.deviceFirmId"
          type="select"
          :enumData="dict.deviceFirmId"
        />
        <Field
          :span="20"
          label="备注"
          prop="deviceRemark"
          v-model="form.deviceRemark"
          type="textarea"
          placeholder="请输入备注"
        />
        <Field
          :span="20"
          label="启用状态 "
          prop="status"
          v-model="form.status"
          type="radio"
          :enumData="dict.status"
          placeholder="请选择启用状态 "
        />
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        class="addclass"
        v-if="pageInfo.type !== 'view'"
        @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import form from "@/assets/mixins/formdialog";
import dialogShow from "./dialogshow";
export default {
  mixins: [form],
  components: {
    dialogShow,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "设备",
      // 是否显示弹出层
      open: false,
      direction: "rtl",
      toString: ["deviceType", "deviceOnlineStatus", "status", "deviceFirmId"],
      // 表单校验
      rules: {
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          { max: 20, message: "最多只能录入20个字符", trigger: "blur" },
        ],
        deviceType: [
          { required: true, message: "请输入设备类型", trigger: "blur" },
        ],
        deviceOnlineStatus: [
          { required: true, message: "请输入在线状态 ", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请输入启用状态 ", trigger: "blur" },
        ],
        createTime: [{ required: true, message: "请选择创建时间" }],
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
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.pageInfo.type = "add";
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
    /**获取数据后弹框 */
    afterRender(data) {
      this.open = true;
    },

    afterSubmit(data) {
      this.open = false;
      this.$emit("ok");
    },

    // 表单重置
    reset() {
      this.form = {
        deviceName: "",
        deviceCode: "",
        deviceType: 1,
        deviceMac: "",
        ip: "",
        centernum: "",
        port: "",
        siteNum: "",
        deviceFirmId: null,
        deviceFirmname: "",
        deviceOnlineStatus: 0,
        status: 0,
        deviceRemark: "",
        onlineTime: null,
        offlineTime: null,
      };
      this.resetForm("form");
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
  },
};
</script>
