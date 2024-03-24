// 地图组件

<template>
  <div class="my-map">
    <el-amap
      ref="map"
      vid="amapDetail"
      :amap-manager="amapManager"
      :center="center"
      :expandZoomRange="true"
      :zoom="20"
      :pitch="65"
      :rotation="45"
      viewMode="3D"
      :plugin="plugin"
      :events="events"
      class="amap-demo"
    >
      <div class="tuli1"><slot name="leftTop1"></slot></div>
      <div class="tuli"><slot name="leftTop"></slot></div>

      <div class="rightTop"><slot name="rightTop"></slot></div>

      <!--marker  -->
      <el-amap-marker
        v-for="(marker, index) in markers"
        :key="'marker' + index"
        :events="marker.events"
        :position="marker.position"
        :contentRender="contentRender"
        :icon="marker.icon"
        :extData="marker"
      >
      </el-amap-marker>
      <!--信息窗体-->
      <el-amap-info-window
        :closeWhenClickMap="true"
        :position="window.position"
        :visible="window.visible"
        :offset="[0, -30]"
        :events="{
          init(m) {
            m.on('open', () => (window.visible = true));
            m.on('close', () => (window.visible = false));
          },
        }"
      >
        <div class="info-window">
          <!-- 头部 -->
          <div class="header flex aic jcb mb20">
            <div class="title">
              {{ curDev.productName + "-" + curDev.deviceName }}
            </div>
            <div class="hint">
              <div class="green" v-if="curDev.deviceStatus === 2">
                <i class="el-icon-link"></i>
                在线
              </div>
              <div class="wraning" v-else-if="curDev.enabled === 0">
                <i class="el-icon-switch-button"></i>
                停用
              </div>
              <div class="ordinary" v-else-if="curDev.deviceStatus === 0">
                <i class="el-icon-sunset"></i>
                未激活
              </div>
              <div class="delete" v-else-if="curDev.deviceStatus === 1">
                <i class="el-icon-light-rain"></i>
                离线
              </div>
            </div>
          </div>
          <!-- 主体 -->
          <div class="info-box">
            <el-descriptions :column="1" size="small">
              <el-descriptions-item label="设备编码">{{
                curDev.deviceCode ? curDev.deviceCode : "--"
              }}</el-descriptions-item>
              <el-descriptions-item label="MAC地址">{{
                curDev.deviceMac ? curDev.deviceMac : "--"
              }}</el-descriptions-item>
              <el-descriptions-item label="设备位置"
                >{{
                  curDev.deviceInBuilding ? curDev.deviceInBuilding : "--"
                }}栋{{
                  curDev.deviceInFloor ? curDev.deviceInFloor : "--"
                }}层</el-descriptions-item
              >
              <el-descriptions-item
                :labelStyle="{ 'text-align': 'right', width: '50px' }"
                label="负责人"
              >
                {{ curDev.leadingOfficial || "--" }}
              </el-descriptions-item>
              <el-descriptions-item label="联系电话">{{
                curDev.leadingOfficialTelephone || "--"
              }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{
                formatterDate(curDev.createTime)
              }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <!-- 底部按钮 -->
          <!-- <div class="footer mt20 flex aic">
            <el-button
              size="small"
              v-if="curDev.deviceStatus === 0"
              type="primary"
              @click="handleActive"
              >一键激活</el-button
            >
            <el-button size="small" type="primary" @click="checkInfo(curDev.id)"
              >查看设备详情</el-button
            >
          </div> -->
        </div>
      </el-amap-info-window>
    </el-amap>
  </div>
</template>

<script>
import { formatterDate } from "@/assets/utils/index";
import { AMapManager } from "vue-amap";
let amapManager = new AMapManager();
export default {
  name: "MapDetail",
  props: {
    value: {
      type: Boolean,
    },
    originData: {
      type: Object,
      default: () => {},
    },
    markersData: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set() {
        this.$emit("input", false);
      },
    },
  },
  created() {
    //this.refresh(this.markersData);
  },
  methods: {
    formatterDate,
    contentRender(h, params) {
      //console.log(params.extData.extData.productId)
      let value = params.extData.extData.productName;
      try {
        require(`../assets/images/${value}.png`);
        return <img src={require(`../assets/images/${value}.png`)} />;
      } catch (error) {
        return <img src={require(`../assets/images/dn.png`)} />;
      }
    },
    getDeviceDetial() {
      //获取设备列表
    },
    refresh(data) {
      // this.markersGroupData = data;
      //this.$refs.map.clear();
      this.$nextTick(() => {
        let map = this.amapManager.getMap();
        if (map) {
          map.clearMap();
        }

        for (let group of data) {
          for (let item of group.deviceList) {
            //console.log("marker", item);
            this.setMarker(item);
          }
        }
      });
    },

    relocate(center) {
      this.center = [center.lng, center.lat];
      this.zoom = 20;
      //重新定位中心点
    },

    setMarker(item) {
      if (!item.lon && !item.lati) return;

      let markerLabel = {
        label: { content: item.deviceName, offset: [30, 70] },
        position: [item.lon, item.lati],

        extData: item,

        events: {
          click: (e) => {
            let ExtData = e.target.getExtData();
            this.window.visible = true;
            this.window.position = ExtData.position;
            this.curDev = ExtData.extData;
            console.log("getExtData", e.target.getExtData());
          },
        },
      };

      this.markers.push(markerLabel);
    },

    choose() {
      this.$emit("input", false);
      this.$emit("choose", JSON.parse(JSON.stringify(this.mapData)), (val) => {
        //data = val;
      });
    },
  },
  data() {
    return {
      markersGroupData: [],
      mapData: {},
      info: {},
      markers: [],
      geocoder: null,
      amapManager,
      zoom: 20,
      center: [104.007767, 30.568308],
      marker: {},
      window: {
        position: [0, 0],
        visible: false,
      },
      curDev: {},
      // 一些工具插件
    };
  },
};
</script>

<style lang="less">
.tuli {
  width: 400px;
  top: 40px;
  left: 34px;
  position: absolute;
  float: left;
  background-color: rgba(255, 255, 255, 0.7);
}
.tuli1 {
  width: 150px;
  top: 10px;
  left: 34px;
  position: absolute;
  float: left;
  background-color: rgba(255, 255, 255, 0.7);
}
.rightTop {
  width: 250px;
  height: 100%;
  top: 0px;
  right: 0px;
  position: absolute;
  float: right;
  background-color: rgba(255, 255, 255, 1);
  overflow-y: auto;
}
.amap-info-content {
  position: relative;
  background: #fff;
  line-height: 1.4;
  overflow: auto;
}
.info-window {
  width: 400px;
  padding: 10px;
  font-size: 12px;
  color: #606266;
  .header {
    .title {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .info-text-title {
    width: 90px;
    text-align: right;
  }
  .info-box {
    padding: 10px 0px;
    border-top: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
  }
  .footer {
    justify-content: flex-end;
  }
}
.my-map {
  width: 100%;
  height: 93vh;
  .amap-demo {
    position: relative;
    width: 100%;
    height: 100%;
    .map-marker {
      position: relative;
      width: 30px;
      height: 30px;
      img {
        position: absolute;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }
      .el-tag {
        position: absolute;
        color: #fff;
        top: 30px;
        transform: translateX(-50%);
        background: #f56c6c;
      }
    }
    .el-vue-search-box-container {
      position: absolute;
      top: -28px;
      width: 100%;
      box-shadow: 0 0 3px #ccc;
      .search-tips {
        width: 100%;
        max-height: 300px;
      }
    }
  }
}
</style>
