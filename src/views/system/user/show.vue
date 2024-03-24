// 用户管理
<template>
  <layout-form>
    <el-form
      :model="form"
      :loading="loading"
      :rules="rules"
      size="small"
      label-width="100px"
      ref="form"
    >
      <el-row>
        <Field label="登录名称" prop="loginName" v-model="form.loginName" />
        <Field
          label="登录密码"
          prop="loginPwd"
          v-model="form.loginPwd"
          v-if="pageInfo.type === 'add'"
        />
        <Field label="用户昵称" prop="realName" v-model="form.realName" />
        <Field label="手机号码" prop="mobile" v-model="form.mobile" />
        <Field
          label="用户类型"
          prop="userType"
          v-model="form.userType"
          :enumData="dict.userType"
          type="select"
        />
        <Field
          label="用户状态"
          prop="status"
          v-model="form.status"
          :enumData="dict.status"
          type="select"
        />
      </el-row>
      <form-buttons @submit="submitForm" />
    </el-form>
  </layout-form>
</template>

<script>
import form from "@/assets/mixins/form";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  mixins: [form],
  name: "User",
  components: { Treeselect },
  created() {},
  methods: {
    /** 编辑 */
    edit(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.editUrl;
      this.getData();
      this.pageInfo.type = "edit";
      this.open = true;
      this.title = "修改设备";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.pageInfo.type = "add";
      this.open = true;
      this.title = "新增设备";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.pageInfo.type = "view";
      this.open = true;
      this.title = "设备详细";
    },
    /**取消按钮 */
    cancel() {
      this.open = false;
    },
    afterSubmit(data) {
      this.open = false;
      this.$emit("ok");
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
  },
  data() {
    return {
      toString: ["status", "userType"],
      siteOptions: [],
      rules: {
        deviceName: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur",
          },
          { max: 20, message: "最多只能录入20个字符", trigger: "blur" },
        ],
        deviceType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        deviceMac: [
          { required: true, message: "请输入Mac地址", trigger: "blur" },
        ],
        deviceFirmId: [
          { required: true, message: "请选择设备生产商", trigger: "change" },
        ],

        deviceFirmname: [
          {
            required: true,
            message: "请输入设备生产厂商名称关联mortals_xhx_stp_firm",
            trigger: "blur",
          },
          { max: 20, message: "最多只能录入20个字符", trigger: "blur" },
        ],
        deviceToRoomName: [
          {
            required: true,
            message: "请输入设备所属房间名称",
            trigger: "blur",
          },
          { max: 128, message: "最多只能录入128个字符", trigger: "blur" },
        ],
        deviceOnlineStatus: [
          { required: true, message: "请选择在线状态 ", trigger: "change" },
        ],
        deviceStatus: [
          { required: true, message: "请选择启用状态 ", trigger: "change" },
        ],
        createTime: [{ required: true, message: "请选择创建时间" }],
      },
    };
  },
};
</script>



