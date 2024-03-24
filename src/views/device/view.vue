<template>
  <layout-view>
    <el-descriptions
      :title="title"
      :column="column"
      :size="size"
      :colon="false"
      border
    >
      <el-descriptions-item
        label="设备名称"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceName }}
      </el-descriptions-item>
      <el-descriptions-item
        label="设备编码"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceCode }}
      </el-descriptions-item>
      <el-descriptions-item
        label="设备SN码"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceSN }}
      </el-descriptions-item>
      <el-descriptions-item
        label="设备的MAC地址"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceMac }}
      </el-descriptions-item>
      <!-- <el-descriptions-item
        label="站点Id"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.siteId }}
      </el-descriptions-item> -->
      <el-descriptions-item
        label="站点编号"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.siteCode }}
      </el-descriptions-item>
      <el-descriptions-item
        label="站点名称"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.siteName }}
      </el-descriptions-item>

      <el-descriptions-item
        label="平台系统名称"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.platformName }}
      </el-descriptions-item>

      <el-descriptions-item
        label="产品名称"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.productName }}
      </el-descriptions-item>

      <el-descriptions-item
        label="设备生产厂商名称"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceFirmname }}
      </el-descriptions-item>
      <el-descriptions-item
        label="设备来源"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ util_formatters("deviceSrc", form.deviceSrc) }}
      </el-descriptions-item>
      <el-descriptions-item
        label="数据获取方式"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ util_formatters("deviceDataSourceWay", form.deviceDataSourceWay) }}
      </el-descriptions-item>
      <el-descriptions-item
        label="经度"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.lon }}
      </el-descriptions-item>
      <el-descriptions-item
        label="纬度"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.lati }}
      </el-descriptions-item>
      <el-descriptions-item
        label="所属楼栋"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceInBuilding }} 栋
      </el-descriptions-item>
      <el-descriptions-item
        label="所属楼层"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceInFloor }} 层
      </el-descriptions-item>
      <el-descriptions-item
        label="保修期至"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ util_formatterDate(form.defectsLiabilityPeriod) }}
      </el-descriptions-item>
      <el-descriptions-item
        label="负责人"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.leadingOfficial }}
      </el-descriptions-item>
      <el-descriptions-item
        label="联系电话"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.leadingOfficialTelephone }}
      </el-descriptions-item>
      <el-descriptions-item
        label="是否接收异常短"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ util_formatters("isReceiveMess", form.isReceiveMess) }}
      </el-descriptions-item>
      <el-descriptions-item
        label="设备图片"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        <ImagePreview :src="form.devicePhotoPath" />
      </el-descriptions-item>

      <el-descriptions-item
        label="设备topic信息"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceTopic }}
      </el-descriptions-item>
      <el-descriptions-item
        label="设备状态 "
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ util_formatters("deviceStatus", form.deviceStatus) }}
      </el-descriptions-item>
      <el-descriptions-item
        label="启用状态 "
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ util_formatters("enabled", form.enabled) }}
      </el-descriptions-item>

      <el-descriptions-item
        label="利旧设备 "
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ util_formatters("source", form.source) }}
      </el-descriptions-item>

      <el-descriptions-item
        label="设备授权码"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceAuthCode }}
      </el-descriptions-item>
      <el-descriptions-item
        label="备注"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ form.deviceRemark }}
      </el-descriptions-item>
      <el-descriptions-item
        label="最近上线时间"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ util_formatterDate(form.onlineTime) }}
      </el-descriptions-item>
      <el-descriptions-item
        label="最近离线时间"
        label-class-name="labelClass"
        content-class-name="contentClass"
      >
        {{ util_formatterDate(form.offlineTime) }}
      </el-descriptions-item>
    </el-descriptions>
    <br />

    <el-descriptions
      :title="title"
      :column="column"
      :size="size"
      :colon="false"
      border
    >
      <template slot="title">
        <i class="el-icon-tickets"></i>
        设备位置
      </template>
    </el-descriptions>
    <!-- <Map></Map> -->
    <div class="map">
      <el-amap
        vid="amaps"
        :zoom="20"
        viewMode="3D"
        expandZoomRange
        :center="[siteInfo.longitude, siteInfo.latitude]"
      >
        <el-amap-marker
          vid="2"
          topWhenClick
          :label="{
            content: `我在${siteInfo.detailAddress}`,
            offset: [0, -20],
          }"
          :position="[siteInfo.longitude, siteInfo.latitude]"
          :icon="require('@/assets/images/d.png')"
        ></el-amap-marker>
      </el-amap>
    </div>
  </layout-view>
</template>

<script>
// import view from "@/assets/mixins/view";
export default {
  // mixins: [view],
  props: {
    form: {
      type: Object,
      default: null,
    },
    dict: {
      type: Object,
      default: null,
    },
    siteInfo: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {},
  created() {},
  methods: {
    util_formatterDate(time) {
      if (time == null) {
        return "";
      }

      let date = new Date(Number(time));
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.panLeft(date.getDate()) + " ";
      let h = this.panLeft(date.getHours()) + ":";
      let m = this.panLeft(date.getMinutes()) + ":";
      let s = this.panLeft(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    panLeft(num) {
      return num < 10 ? "0" + num : num;
    },

    // 从dict字段暴力取值，取不到则返回原值
    util_formatter(key, val) {
      try {
        return this.dict[key][val];
      } catch (error) {
        return val;
      }
    },
    util_formatters(key, val) {
      try {
        return val
          .split(",")
          .map((i) => this.util_formatter(key, i))
          .join(",");
      } catch (error) {
        return val;
      }
    },
  },
  data() {
    return {
      form: {},
      size: "small",
      column: 3,
      toString: [
        "deviceSrc",
        "deviceDataSourceWay",
        "deviceInBuilding",
        "deviceInFloor",
        "isReceiveMess",
        "deviceStatus",
        "enabled",
        "deleted",
      ],
      toArrays: [],
      toDate: [],
    };
  },
};
</script>
<style lang="less">
.labelClass {
  width: 200px;
}
.el-descriptions__body {
  margin-left: 5px;
  margin-right: 5px;
  color: #606266;
  background-color: #fff;
}
.contentClass {
  width: 600px;
}
.map {
  width: 100%;
  height: 600px;
}
</style>
