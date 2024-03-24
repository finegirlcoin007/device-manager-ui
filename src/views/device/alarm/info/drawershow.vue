<template>
  <!-- 弹出框表单 -->
  <el-drawer
    :title="title"
    :visible.sync="open"
    :direction="direction"
    size="50%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <!-- <Field
          :span="22"
          label="所属平台"
          prop="platformId"
          v-model="form.platformId"
          :enumData="dict.platformId"
          type="select"
          placeholder="请输入产品名称，名称唯一"
        /> -->

        <Field
          :span="22"
          label="产品名称"
          prop="productName"
          v-model="form.productName"
          placeholder="请输入产品名称，名称唯一"
        />
        <Field
          :span="22"
          label="告警设备"
          prop="deviceName"
          v-model="form.deviceName"
        />
        <Field
          :span="22"
          label="告警时间"
          prop="alarmTime"
          v-model="time"
        />
        
        <Field
          :span="22"
          label="告警内容"
          prop="alarmType"
          v-model="alarmType"
        />
        <Field
          :span="22"
          label="告警程度"
          prop="alarmLevel"
          v-model="alarmLevel"
        />
        <Field
          :span="22"
          label="告警状态"
          prop="alarmStatus"
          v-model="alarmStatus"
        />
        <Field
          :span="22"
          label="接收人员"
          prop="alarmReceivePersonnel"
          v-model="form.alarmReceivePersonnel"
        />
        <Field
          :span="22"
          label="告警详情"
          prop="alarmContent"
          v-model="form.alarmContent"
          type="textarea"
        />
        
        <!-- <Field
          :span="22"
          label="产品编码"
          prop="productCode"
          v-model="form.productCode"
          placeholder="请输入产品编码"
        /> -->

        <!-- <Field
          :span="22"
          label="默认首页"
          prop="skinId"
          v-model="form.skinId"
          @change="skinSelect"
          :enumData="dict.skinProductCodeMap[form.productCode]"
          type="select"
          placeholder="请输入产品名称，名称唯一"
        /> -->

        <!-- <Field
          :span="22"
          v-if="form.productCode == 'pjq'"
          label="事件地址"
          prop="eventUrl"
          v-model="form.eventUrl"
          placeholder="请输入事件地址"
        /> -->
      </el-row>

      <!-- <form-buttons @submit="submitForm" noCancelBtn /> -->
    </el-form>
  </el-drawer>
</template>

<script>
import form from "@/assets/mixins/formdialog";
import { formatterDate } from "@/assets/utils/index";
export default {
  name: "DeviceAlarmDetail",
  mixins: [form],
  components: {},
  created() {
    this.changePath("product");
  },
  data() {
    return {
      alarmLevel:'',
      alarmStatus:'',
      time:'',
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "产品",
      // 是否显示弹出层
      open: false,
      direction: "rtl",
      toString: ["platformId", "skinId"],
      toDate: [],
      // 表单校验
      rules: {
        productName: [
          {
            required: true,
            message: "请输入产品名称，名称唯一",
            trigger: "blur",
          },
          { max: 20, message: "最多只能录入20个字符", trigger: "blur" },
        ],
        productCode: [
          { required: true, message: "请输入产品编码", trigger: "blur" },
          { max: 256, message: "最多只能录入256个字符", trigger: "blur" },
        ],
        homeUrl: [
          { required: true, message: "请输入首页地址", trigger: "blur" },
          { max: 512, message: "最多只能录入512个字符", trigger: "blur" },
        ],
      },
    };
  },
  watch:{
    'form.alarmTime'(newval){
      this.time = this.formatterDate(parseInt(newval))
    },
    "form.alarmLevel"(newval){
      this.alarmLevel = this.dict.alarmLevel[newval]
    },
    "form.alarmStatus"(newval){
      this.alarmStatus = this.dict.alarmStatus[newval]
    },
    "form.alarmType"(newval){
      this.alarmType = this.dict.alarmType[newval]
    },
  },
  methods: {
    formatterDate,
    skinSelect(val) {
      this.form.skinName =
        this.dict.skinProductCodeMap[this.form.productCode][val];
    },
    /** 编辑 */
    edit(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = "product/edit";
      this.getData();
      this.pageInfo.type = "edit";
      this.title = "修改产品";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.urls.currUrl = "product/add";
      this.getData();
      this.pageInfo.type = "add";
      this.title = "新增产品";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = "device/alarm/info/view";
      this.getData();
      this.pageInfo.type = "view";
      this.title = "详情";
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
        platformId: null,
        productName: "",
        productCode: "",
        productRemark: "",
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
