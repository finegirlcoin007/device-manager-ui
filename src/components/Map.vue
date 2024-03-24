// 地图组件

<template>
  <div class="my-map">
    <el-amap
      ref="map"
      vid="amapDemo"
      :amap-manager="amapManager"
      :center="center"
      :zoom="zoom"
      :plugin="plugin"
      :events="events"
      class="amap-demo"
    >
      <div class="tuli"><slot name="leftTop"></slot></div>
      <div class="liebiao"><slot name="rightTop"></slot></div>

      <!-- <el-amap-search-box :on-search-result="onSearchResult" :events='searchEvents'/> -->

      <!--marker  -->
      <el-amap-marker
        v-for="(marker, index) in markers"
        :key="'marker' + index"
        :events="markerevents"
        :position="marker.position"
        :label="marker.label"
        :contentRender="contentRender"
        :extData="marker"
      >
        <div class="marker-using-slot" style="positon: relative">
            <img
              style="width: 36px; height: 50px"
              src="@/assets/images/red.png"
            />
            <div
              style="
                color: #ffffff;
                position: absolute;
                top: 8px;
                left: 50%;
                transform: translate(-50%);
              " v-if="marker.extData.level == 1">
              {{ marker.extData.siteCount }}
            </div>
        </div>
      </el-amap-marker>

      <!--信息窗体-->
      <el-amap-info-window
        :closeWhenClickMap="true"
        :position="window.position"
        :visible="window.visible"
        :content="window.content"
        ><el-row :body-style="{ padding: '0px' }">
          <el-row type="flex" justify="space-between">
            <span style="font-size: 18px"
              ><b>{{ info.label }}</b></span
            >
            <el-button
              type="text"
              size="mini"
              @click="getDeviceDetial"
              class="button"
              >查看详情</el-button
            >
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="space-around">
            <el-col :span="4">
              <span style="font-size: 13px"
                ><b>{{ info.deviceTotal }}</b></span
              ><br />
              <span style="font-size: 12px">设备总数</span>
            </el-col>
            <el-col :span="4">
              <span style="font-size: 13px"
                ><b style="color: green">{{ info.onlineCount }}</b></span
              ><br />
              <span style="font-size: 12px">在线</span>
            </el-col>
            <el-col :span="4">
              <span style="font-size: 13px"
                ><b style="color: red">{{ info.offlineCount }}</b></span
              ><br />
              <span style="font-size: 12px">离线</span>
            </el-col>
            <el-col :span="4">
              <span style="font-size: 13px"
                ><b style="color: orange">{{ info.stopCount }}</b></span
              ><br />
              <span style="font-size: 12px">停用</span>
            </el-col>
            <el-col :span="4">
              <span style="font-size: 13px"
                ><b style="color: grey">{{ info.unActiveCount }}</b></span
              ><br />
              <span style="font-size: 12px">待激活</span>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-descriptions :column="1" size="small">
            <!-- <el-descriptions-item label="站点编码">{{
              info.siteCode
            }}</el-descriptions-item>
            <el-descriptions-item label="站点地址">{{
              info.address
            }}</el-descriptions-item>
            <el-descriptions-item
              label="联系人"
              :labelStyle="{ 'text-align': 'right', width: '50px' }"
              >{{ info.leadingOfficial }}</el-descriptions-item
            >
            <el-descriptions-item label="联系电话">
              {{ info.leadingOfficialTelephone }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{
              formatterDate(info.createTime)
            }}</el-descriptions-item> -->
          </el-descriptions>
        </el-row></el-amap-info-window
      >
    </el-amap>
  </div>
</template>

<script>
import { formatterDate } from "@/assets/utils/index";

import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
let amapManager = new AMapManager();

export default {
  name: "MapList",
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
    this.refresh(this.markersData);
    this.markerevents = {
      click: (e) => {
        let exData = e.target.getExtData();
        this.center = [exData.extData.lng, exData.extData.lat]
        this.zoom = 8
        this.info = exData.extData;
        console.log(this.info);
        this.window.position = exData.position;
        if(this.info.children && this.info.children.length>0){
          let children = JSON.parse(JSON.stringify(exData.extData.children))
          children = this.flatten(children)
          children = children.map(i=> {return {
            ...i,
            lat:i.latitude,
            lng:i.longitude,
          }})
          exData.extData.level = ''
          children.unshift(JSON.parse(JSON.stringify(exData.extData)))
          children = children.filter((v) => {
            return v.type == "site";
          });
          this.refresh(children)
        }
        this.window.visible = false;
        this.$nextTick(() => {
          this.window.visible = true; //点击点坐标，出现信息窗体
        });
      },
    }
  },
  methods: {
    formatterDate,
    contentRender(h, params) {
      return <img style="width: 36px;height: 50px;" src={require("../assets/images/red.png")} />;
    },
    getDeviceDetial() {
      this.$emit("choose", this.info, (val) => {
        console.log("callback:" + val);
      });
    },
    refresh(data) {
      // console.log("刷新数据", data,this.markers);
      this.markersData = data;
      this.markers = []
      this.markersData.map((item) => {
        this.setMarker(item);
      });
    },

    relocate(center) {
      this.center = [center.lng, center.lat];
      this.zoom = 10;
      //重新定位中心点
    },

    setMarker(item) {
      if (!item.lng && !item.lat) return;
      let markerLabel = {
        label: { offset: [20, 38] },
        position: [item.lng, item.lat],
        //icon: require("@/assets/images/marker-blue.png"),
        extData: item,
        
      };

      this.markers.push(markerLabel);
    },
    flatten(arr) {
      return arr.reduce((result, item) => {
        return result.concat(
          item,
          Array.isArray(item.children) ? this.flatten(item.children) : []
        );
      }, []);
    },
    // 处理搜索结果，定位到中心点
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (!pois.length) return;
      pois.forEach((poi) => {
        let { lng, lat } = poi;
        lngSum += lng;
        latSum += lat;
      });
      let center = {
        lng: lngSum / pois.length,
        lat: latSum / pois.length,
      };
      this.setMarker(center.lng, center.lat, pois[0].name);
      this.center = [center.lng, center.lat];
    },
    choose() {
      this.$emit("input", false);
      this.$emit("choose", JSON.parse(JSON.stringify(this.mapData)), (val) => {
        //data = val;

        console.log("callback:" + val);
      });
    },
  },
  data() {
    let self = this;
    return {
      visiblepop: false,
      searchEvents: {
        init: (e) => {},
      },
      window: {
        position: [104.405994, 30.915378],
        visible: false,
        content: '<div class="red">Hi! I am here!</div>',
      },
      mapData: {},
      info: {},
      markers: [],
      geocoder: null,
      amapManager,
      zoom: 6,
      center: [104.007767, 30.568308],
      marker: {},
      //   events: {
      //     init: (e) => {
      //       this.geocoder = new AMap.Geocoder();
      //       console.log("markersData", this.markersData);
      //       // this.markersData.map((item) => {
      //       //   this.setMarker(item.lng, item.lat, item.address);
      //       // });
      //     },
      //     click: (e) => {
      //       console.log(e);
      //       self.window.position = [e.lnglat.lng, e.lnglat.lat];

      //       self.window.content=` <el-card :body-style="{ padding: '0px' }">
      //   <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
      //   <div style="padding: 14px;">
      //     <span>好吃的汉堡</span>
      //     <div class="bottom clearfix">
      //       <time class="time">{{ currentDate }}</time>
      //       <el-button type="text" class="button">操作按钮</el-button>
      //     </div>
      //   </div>
      // </el-card>`

      //       console.log(self.window)

      //       self.$nextTick(() => {
      //         self.window.visible = true; //点击点坐标，出现信息窗体
      //       });

      //       //更新窗体数据，

      //       // that.windows.forEach((window) => {
      //       //   window.visible = false; //关闭窗体
      //       // });
      //       // that.window = that.windows[index];
      //       // that.$nextTick(() => {
      //       //   that.window.visible = true; //点击点坐标，出现信息窗体
      //       // });

      //       alert(e.target.getExtData());
      //       // this.visiblepop = true;
      //       // let resp=this.$emit("choose", e.target.getExtData().siteId);

      //       //console.log("resp",resp)
      //       // const { lat, lng } = e.lnglat;
      //       // this.geocoder.getAddress([lng, lat], (status, result) => {
      //       //   if (status === "complete" && result.info === "OK") {
      //       //     const address = result.regeocode.formattedAddress;
      //       //     this.setMarker(lng, lat, address);
      //       //     this.center = [lng, lat];
      //       //   }
      //       // });
      //     },
      //  },
      // 一些工具插件
      plugin: [
        // {
        //   pName: "Geocoder",
        //   events: {
        //     init(o) {
        //       //console.log("一些工具插件--地址"+o.getAddress())
        //     },
        //   },
        // },
        {
          // 定位
          pName: "Geolocation",
          events: {
            init(o) {
              // o是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  // 设置经度
                  self.lng = result.position.lng;
                  // 设置维度
                  self.lat = result.position.lat;
                  // 设置坐标
                  self.center = [self.lng, self.lat];
                  self.markers.push([self.lng, self.lat]);
                  // load
                  self.loaded = true;
                  // 页面渲染好后
                  self.$nextTick();
                }
              });
            },
          },
          // 单位按钮
          showButton: false,
        },
        // {
        //   // 工具栏
        //   pName: "ToolBar",
        //   events: {
        //     init(instance) {
        //       //console.log("工具栏:"+instance);
        //     },
        //   },
        // },
        // {
        //   // 鹰眼
        //   pName: "OverView",
        //   events: {
        //     init(instance) {
        //       //console.log("鹰眼:"+instance);
        //     },
        //   },
        // },
        {
          // 地图类型
          pName: "MapType",
          defaultType: 0,
          events: {
            init(instance) {
              //console.log("地图类型:"+instance);
            },
          },
        },
        {
          // 搜索
          pName: "PlaceSearch",
          events: {
            init(instance) {
              //console.log("搜索:"+instance)
            },
          },
        },
      ],
    };
  },
};
</script>

<style  lang="less">
.amap-maptypecontrol{
  display: none;
}
.liebiao{
  width: 400px;
  top: 40px;
  right: 34px;
  position: absolute;
  // float: right;
  background-color: rgba(255, 255, 255, 0.7);

}
.tuli {
  width: 300px;
  top: 20px;
  left: 34px;
  position: absolute;
  float: left;
  background-color: rgba(255, 255, 255, 0.7);
}
.amap-info-content {
  position: relative;
  background: #fff;
  line-height: 1.4;
  overflow: auto;
}
.my-map {
  .amap-demo {
    position: relative;
    width: 100%;
    height: 600px;
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



