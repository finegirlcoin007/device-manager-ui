<template>
  <!-- 弹出框表单 -->
  <el-drawer
    :title="title"
    :visible.sync="open"
    :direction="direction"
    size="40%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <Field
          :span="22"
          label="产品类型"
          prop="productId"
          type="select"
          v-model="form.productId"
          :enumData="dict.productId"
          placeholder="请输入产品"
        />
        <Field
          :span="22"
          label="告警类型"
          prop="alarmType"
          v-model="form.alarmType"
          type="select"
          :enumData="dict.alarmType"
          placeholder="请选择告警类型"
        />
        <Field
          :span="22"
          label="告警级别"
          prop="alarmLevel"
          v-model="form.alarmLevel"
          type="select"
          :enumData="dict.alarmLevel"
          placeholder="请选择告警级别,"
        />
        <Field
          :span="22"
          label="推送方式"
          prop="alarmPusW1ay"
          v-model="form.alarmPusW1ay"
          type="select"
          :enumData="dict.alarmPusW1ay"
          placeholder="请选择推送方式,"
        />
        <Field
          :span="22"
          label="备注"
          prop="remark"
          v-model="form.remark"
          type="textarea"
          placeholder="请输入备注"
        />
        <Field
          :span="22"
          label="是否启用"
          prop="enabled"
          v-model="form.enabled"
          type="radio"
          :enumData="dict.enabled"
          placeholder="请选择是否启用"
        />
      </el-row>
      <form-buttons @submit="submitForm" noCancelBtn v-if="pageInfo.type != 'view'"/>
    </el-form>
  </el-drawer>
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
      title: "设备告警配置",
      // 是否显示弹出层
      open: false,
      toString: [
        "productId",
        "alarmType",
        "alarmLevel",
        "alarmPusW1ay",
        "enabled",
      ],
      // 表单校验
      rules: {
        productId: [
          { required: true, message: "请选择产品类型", trigger: "blur" },
        ],
        alarmType: [
          { required: true, message: "请输入告警类型", trigger: "blur" },
        ],
        alarmLevel: [
          { required: true, message: "请输入告警级别,", trigger: "blur" },
        ],
        alarmPusW1ay: [
          { required: true, message: "请输入推送方式,", trigger: "blur" },
        ],
        isUse: [{ required: true, message: "请输入是否启用", trigger: "blur" }],
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
      this.title = "修改设备告警配置";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.pageInfo.type = "add";
      this.title = "新增设备告警配置";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.pageInfo.type = "view";
      this.title = "设备告警配置详细";
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
        productId: null,
        alarmType: 0,
        alarmLevel: null,
        alarmPusW1ay: 0,
        isUse: null,
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
