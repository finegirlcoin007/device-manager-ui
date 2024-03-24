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
        <Field
          :span="22"
          label="所属平台"
          prop="platformId"
          v-model="form.platformId"
          :enumData="dict.platformId"
          type="select"
          placeholder="请输入产品名称，名称唯一"
        />

        <Field
          :span="22"
          label="产品名称"
          prop="productName"
          v-model="form.productName"
          placeholder="请输入产品名称，名称唯一"
        />
        <Field
          :span="22"
          label="产品编码"
          prop="productCode"
          v-model="form.productCode"
          placeholder="请输入产品编码"
        />

        <Field
          :span="22"
          label="默认首页"
          prop="skinId"
          v-model="form.skinId"
          @change="skinSelect"
          :enumData="dict.skinProductCodeMap[form.productCode]"
          type="select"
          placeholder="请输入产品名称，名称唯一"
        />

        <Field
          :span="22"
          v-if="form.productCode == 'pjq'"
          label="事件地址"
          prop="eventUrl"
          v-model="form.eventUrl"
          placeholder="请输入事件地址"
        />
        <Field
          :span="22"
          label="备注"
          prop="productRemark"
          v-model="form.productRemark"
          type="textarea"
          placeholder="请输入备注"
        />
      </el-row>

      <form-buttons @submit="submitForm" noCancelBtn v-if="pageInfo.type != 'view'"/>
    </el-form>
  </el-drawer>
</template>

<script>
import form from "@/assets/mixins/formdialog";
export default {
  name: "ProductDetail",
  mixins: [form],
  components: {},
  created() {
    this.changePath("product");
  },
  data() {
    return {
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

  methods: {
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
      this.urls.currUrl = "product/view";
      this.getData();
      this.pageInfo.type = "view";
      this.title = "产品详细";
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
