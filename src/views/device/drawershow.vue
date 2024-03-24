<template>
  <!-- 弹出框表单 -->
  <el-drawer
    :title="title"
    :visible.sync="open"
    :direction="direction"
    size="70%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <Field
          label="设备名称"
          prop="deviceName"
          v-model="form.deviceName"
          placeholder="请输入设备名称"
        />
        <!-- <Field
          label="设备编码"
          prop="deviceCode"
          v-model="form.deviceCode"
          placeholder="请输入设备编码码"
        /> -->
        <Field
          label="MAC地址"
          prop="deviceCode"
          v-model="form.deviceCode"
          placeholder="请输入设备的MAC地址"
        />

        <Field
          label="所属机构"
          prop="orgName"
          v-model="form.orgName"
          placeholder="请输入设备的所属机构"
        />
        <!-- <Field  label="平台类型" prop="platformId" v-model="form.platformId" type="select" :enumData="dict.platformId" placeholder="请选择平台类型"/> -->
        <Field
          label="产品类型"
          prop="productId"
          v-model="form.productId"
          type="select"
          :enumData="dict.productId"
          @change="changeProduct"
          placeholder="请选择产品类型"
        />
        <Field
          label="设备生产商"
          placeholder="请选择设备生产商"
          prop="deviceFirmId"
          v-model="form.deviceFirmId"
          type="select"
          :enumData="dict.deviceFirmId"
        />
        <Field
          label="设备来源"
          prop="deviceSrc"
          v-model="form.deviceSrc"
          type="select"
          :enumData="dict.deviceSrc"
          placeholder="请选择设备来源"
        />
        <Field
          label="数据获取方式"
          prop="deviceDataSourceWay"
          v-model="form.deviceDataSourceWay"
          type="select"
          :enumData="dict.deviceDataSourceWay"
          placeholder="请选择数据获取方式"
        />
        <!-- <Field
          label="经度"
          prop="lon"
          v-model="form.lon"
          placeholder="请输入经度"
        />
        <Field
          label="纬度"
          prop="lati"
          v-model="form.lati"
          placeholder="请输入纬度"
        /> -->
        <Field
          label="默认首页"
          prop="skinId"
          v-model="form.skinId"
          @change="skinSelect"
          :enumData="
            !form.productCode
              ? { 0: '无' }
              : dict.skinProductCodeMap[form.productCode]
          "
          type="select"
          placeholder="选择首页"
        />

        <Field
          label="所属楼栋"
          prop="deviceInBuilding"
          v-model="form.deviceInBuilding"
          type="num"
          placeholder="请选择所属楼栋"
        ></Field>
        <Field
          label="所属楼层"
          prop="deviceInFloor"
          v-model="form.deviceInFloor"
          type="num"
          placeholder="请选择所属楼层"
        />
        <Field
          label="保修期至"
          prop="defectsLiabilityPeriod"
          v-model="form.defectsLiabilityPeriod"
          type="datetime"
        />
        <Field
          label="负责人"
          prop="leadingOfficial"
          v-model="form.leadingOfficial"
          placeholder="请输入负责人"
        />
        <Field
          label="联系电话"
          prop="leadingOfficialTelephone"
          v-model="form.leadingOfficialTelephone"
          placeholder="请输入联系电话"
        />
        <Field
          label="接收异常短信"
          prop="isReceiveMess"
          v-model="form.isReceiveMess"
          type="select"
          :enumData="dict.isReceiveMess"
          placeholder="请选择是否接收异常短信"
        />

        <Field
          label="利旧设备"
          prop="source"
          v-model="form.source"
          type="select"
          :enumData="dict.source"
          placeholder="请选择状态 "
        />

        <Field
          label="启用状态"
          prop="enabled"
          v-model="form.enabled"
          type="select"
          :enumData="dict.enabled"
          placeholder="请选择启用状态 "
        />

        <Field
          label="显示短信"
          prop="showSms"
          v-model="form.showSms"
          type="radio"
          :enumData="dict.showSms"
          placeholder="请选择是否显示短信"
        />
        <Field
          label="显示打印机"
          prop="showPrint"
          v-model="form.showPrint"
          type="radio"
          :enumData="dict.showPrint"
          placeholder="请选择是否显示打印机"
        />
        <Field
          label="小程序二维码"
          prop="showWechatQrCode"
          v-model="form.showWechatQrCode"
          type="radio"
          :enumData="dict.showWechatQrCode"
          placeholder="请选择是否显示小程序二维码"
        />

        <Field :span="24" label="上传图片">
          <ImageUpload v-model="form.devicePhotoPath" prePath="/file/preview" />
        </Field>
        <Field
          label="授权码"
          :span="24"
          prop="deviceAuthCode"
          v-model="form.deviceAuthCode"
          type="textarea"
          placeholder="请输入授权码"
        />

        <Field
          label="备注"
          :span="24"
          prop="deviceRemark"
          v-model="form.deviceRemark"
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
import ImageUpload from "@/components/ImageUpload";

export default {
  mixins: [form],
  components: {
    ImageUpload,
  },
  data() {
    return {
      siteCode: "",
      siteName: "",
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "设备",
      // 是否显示弹出层
      open: false,
      direction: "rtl",
      urls: {
        saveUrl: "/device/save",
      },
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
        "showSms",
        "showPrint",
        "showWechatQrCode",
        "skinId",
      ],
      toDate: ["defectsLiabilityPeriod"],

      // 表单校验
      rules: {
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          { max: 20, message: "最多只能录入20个字符", trigger: "blur" },
        ],
        deviceCode: [
          { required: true, message: "请输入设备编码", trigger: "blur" },
        ],
        deviceMac: [
          { required: true, message: "请输入Mac地址", trigger: "blur" },
        ],

        platformId: [
          { required: true, message: "请选择平台", trigger: "blur" },
        ],
        productId: [{ required: true, message: "请选择产品", trigger: "blur" }],
      },
    };
  },

  methods: {
    changeProduct(val) {
      this.form.productCode = this.dict.productCode[val];
    },
    skinSelect(val) {
      this.form.skinName = this.dict.skinProductCodeMap[this.form.productCode][
        val
      ];
    },
    /** 编辑 */
    edit(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = "/device/edit";
      this.siteName = row.siteName;
      this.siteCode = row.siteCode;
      this.getData();
      this.pageInfo.type = "edit";
      this.title = "修改设备";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.urls.currUrl = "/device/add";
      this.pageInfo.type = "add";
      this.form.siteId = row.siteId;
      this.siteName = row.siteName;
      this.siteCode = row.siteCode;
      this.getData();
      this.title = "新增设备";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = "/device/view";
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
      if (this.pageInfo.type == "add" || this.pageInfo.type == "edit") {
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
