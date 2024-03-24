<template>
  <div class="analysis flex flexc">
    <!-- 头部 -->
    <div class="header flex jcc">
      <!-- 站点选择 -->
      <div class="site-select">
        <HeaderSite></HeaderSite>
      </div>
      <div class="title flex flexc aic">
        <h1 class="title-text">AIOT物联网大数据中心</h1>
        <p class="title-en">AIOT IOT BIG DATA CENTER</p>
      </div>
      <!-- 退出系统 -->
      <div class="pointer exit-btn" @click="$router.back()">
        <i class="iconfont icon-exit"></i>
        退出系统
      </div>
    </div>
    <!-- 主体 -->
    <div class="main flex1 flex aic jcb">
      <div class="left">
        <div class="left-centent">
          <!-- 设备汇总 -->
          <div class="dev-total flex aic jcb mb30">
            <div class="dev-total-item">
              <img class="icon-img" src="@/assets/images/data/icon4.png" />
              <div class="flex flexc jcb flex1">
                <div class="title tar">设备总数（台）</div>
                <div class="tar count">{{ deviceTotalCount }}</div>
                <img class="line-img" src="@/assets/images/data/icon8.png" />
              </div>
            </div>
            <div class="dev-total-item">
              <img class="icon-img" src="@/assets/images/data/icon3.png" />
              <div class="flex flexc jcb flex1">
                <div class="title tar">监控站点（个）</div>
                <div class="tar count">{{ siteSize }}</div>
                <img class="line-img" src="@/assets/images/data/icon8.png" />
              </div>
            </div>
          </div>
          <!-- 今日告警设备排行 -->
          <div class="warning-dev mb30">
            <TitleItem title="今日告警设备排名Top10"></TitleItem>
            <div class="warning-list">
              <dv-scroll-ranking-board
                :config="warningInfo"
                style="width: 100%; height: 100%"
              />
            </div>
          </div>
          <!-- 设备类型分布 -->
          <div class="dev-type-dis flex aic jcb mb30">
            <div class="dis-item" id="devTypeDis"></div>
            <div class="dis-item" id="warningDis"></div>
          </div>
          <!-- 设备厂家排名TOP5 -->
          <div class="manufacturers">
            <TitleItem title="设备厂家排名TOP5" />
            <div class="manufacturers-info" id="manufacturersTop"></div>
          </div>
        </div>
      </div>
      <div class="center">
        <div class="center-top">
          <div class="center-top-item">
            <img src="@/assets/images/icon1.png" alt="" />
            <div>
              <h2
                style="color: #69f3ff;text-shadow: 0 0 10px #69f3ff5b,0 0 20px #69f3ff5b,0 0 30px #69f3ff5b,0 0 40px #69f3ff5b;"
              >
                {{ centerTop.deviceOnlineCount || 0 }}
              </h2>
              <p>在线设备总数</p>
            </div>
          </div>
          <div class="center-top-item">
            <img src="@/assets/images/icon2.png" alt="" />
            <div>
              <h2
                style="color: #ffba69;text-shadow: 0 0 10px #ffb9693d,0 0 20px #ffb9693d,0 0 30px #ffb9693d,0 0 40px #ffb9693d;"
              >
                {{ centerTop.deviceOfflineCount || 0 }}
              </h2>
              <p>离线设备总数</p>
            </div>
          </div>
          <div class="center-top-item">
            <img src="@/assets/images/icon3.png" alt="" />
            <div>
              <h2
                style="color: #ff69b3;text-shadow: 0 0 10px #ff69b452,0 0 20px #ff69b452,0 0 30px #ff69b452,0 0 40px #ff69b452;"
              >
                {{ centerTop.deviceStopCount || 0 }}
              </h2>
              <p>停用设备总数</p>
            </div>
          </div>
          <div class="center-top-item">
            <img src="@/assets/images/icon4.png" alt="" />
            <div>
              <h2
                style="color: #25f06c;text-shadow: 0 0 10px #25f06c3a,0 0 20px #25f06c3a,0 0 30px #25f06c3a,0 0 40px #25f06c3a;"
              >
                {{ centerTop.pushTotalCount || 0 }}
              </h2>
              <p>今日消息推送总数</p>
            </div>
          </div>
        </div>
        <div class="center-three">
          <three :floorArr="floorArr" lv="1" :checkItem="checkDeviceItem" />
        </div>
      </div>
      <div class="right">
        <div class="right-content">
          <!-- 设备告警汇总 -->
          <div class="dev-total flex aic jcb mb30">
            <div class="dev-total-item">
              <img class="icon-img" src="@/assets/images/data/icon7.png" />
              <div class="flex flexc jcb flex1">
                <div class="title tar">今日告警次数（次）</div>
                <div class="tar count">{{ todayAlarmInfoCount }}</div>
                <img class="line-img" src="@/assets/images/data/icon8.png" />
              </div>
            </div>
            <div class="dev-total-item">
              <img class="icon-img" src="@/assets/images/data/icon6.png" />
              <div class="flex flexc jcb flex1">
                <div class="title tar">今日告警设备（个）</div>
                <div class="tar count">{{ todayAlarmDeviceCount }}</div>
                <img class="line-img" src="@/assets/images/data/icon8.png" />
              </div>
            </div>
          </div>
          <!-- 今日告警等级分布 -->
          <div class="warning-rank mb30">
            <TitleItem title="今日告警等级分布" />
            <div class="warning-rank-info flex aic jca">
              <div class="warning-info-item1">
                <div class="item1-info">
                  <div class="title">危险</div>
                  <div class="percent">
                    {{ alarmLevelCollect.危险 ? alarmLevelCollect.危险 : 0 }}%
                  </div>
                </div>
              </div>
              <div class="warning-info-item2">
                <div class="item2-info">
                  <div class="title">次要</div>
                  <div class="percent">
                    {{ alarmLevelCollect.次要 ? alarmLevelCollect.次要 : 0 }}%
                  </div>
                </div>
              </div>
              <div class="warning-info-item1">
                <div class="item1-info">
                  <div class="title">一般</div>
                  <div class="percent">
                    {{ alarmLevelCollect.一般 ? alarmLevelCollect.一般 : 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 实时告警信息发布 -->
          <div class="real-time">
            <TitleItem title="实时告警信息发布" />
            <div class="real-time-list">
              <dv-scroll-board
                @click="tabelRow"
                :config="realTimeInfo"
                style="width: 100%; height: 100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// const floorArr = [
//   {
//     id: 4,
//     building: 1,
//     lv: 1,
//     picture: "",
//     phonepicture: "",
//     mtl_url: "/uploads/floor/yibin2/L1.mtl",
//     // obj_url: "/glft/sbglL1.gltf",
//     obj_url: "/module/L1.gltf",
//     siteid: 1,
//     type: 1,
//     create_time: "2023-03-13 11:32:38",
//     update_time: "2023-04-08 11:40:07",
//     zip_url: "/uploads/floor/L1-1/L1-1.zip",
//   },
//   {
//     id: 5,
//     building: 1,
//     lv: 2,
//     picture: "",
//     phonepicture: "",
//     mtl_url: "/uploads/floor/yibin/L2.mtl",
//     // obj_url: "/glft/sbglL2.gltf",
//     obj_url: "/module/L2.gltf",
//     siteid: 1,
//     type: 1,
//     create_time: "2023-03-13 16:54:14",
//     update_time: "2023-04-08 11:40:21",
//     zip_url: "/uploads/floor/L2-1/L2-1.zip",
//   },
// ];

const axios = require('axios').default;

import HeaderSite from "./components/HeaderSite.vue";
import TitleItem from "./components/TitleItem.vue";
import three from "./components/three/three.vue";
import session from "@/assets/utils/session";
export default {
  components: {
    HeaderSite,
    TitleItem,
    three,
  },
  data() {
    return {
      floorArr: [],
      siteId: session.getSession("siteid"),
      warningInfo: {
        data: [],
        rowNum: 5,
        waitTime: 2000,
        unit: "次",
      },
      realTimeInfo: {
        header: ["设备名称", "告警次数", "告警时间", "告警类型", "设备编码"],
        headerHeight: 30,
        headerBGC: "#3B5A9E",
        oddRowBGC: "",
        evenRowBGC: "#263963",
        rowNum: 17,
        align: ["center", "center", "center", "center"],
        data: [],
      },
      lv: "1",
      deviceTotalCount: 0, // 总设备数量
      siteSize: 0, // 监控站点数量
      todayAlarmInfoCount: 0, // 今日告警次数
      todayAlarmDeviceCount: 0, // 今日告警设备数量
      siteDeviceCollect: {}, // 分站点统计设备数量
      siteDeviceAlarmCollect: {}, // 分站点统计设备今日告警数量
      deviceConnTypeCollect: {}, // 设备类型分布
      alarmTypeCollect: {}, // 告警类型统计分布
      deviceFirmCollect: {}, // 设备厂家排名
      alarmLevelCollect: {}, // 今日告警等级分布
      deviceAlarmMapInfoList: [], // 实施告警消息
      Statlist: [], //设备列表
      checkDeviceItem: {}, //选中设备
      centerTop: {},
    };
  },
  created() {
    this.getStatlist();
    this.getDevAlarm();
    this.getData();
    setTimeout(() => {
      // this.floorArr = floorArr;
      this.getLCData()
    }, 500);
    this.centerDeviceType();
  },
  methods: {
    // 获取楼层数据
    getLCData(){
      axios({
        method: 'get',
        url: "/module/3Ddt/lc.json",
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(
        (res)=>{
          this.floorArr = res.data.floorArr
          console.log('resres',this.floorArr);
        }
      )
    },
    // 中间设备状态
    centerDeviceType() {
      this.$post("/device/stat/list", {
        siteId: this.siteId,
        selected: 0,
      }).then((res) => {
        const { code, data } = res;
        if (code == 1 && data.data.length > 0) {
          this.centerTop = data.data[0];
          console.log(this.centerTop);
        }
      });
    },
    // 点击设备
    tabelRow(arr) {
      const { rowIndex } = arr;
      this.checkDeviceItem = this.Statlist[rowIndex];
    },
    // 获取今日告警设备统计
    getDevAlarm() {
      this.$post("/device/alarm/info/stats", { siteId: this.siteId }).then(
        (res) => {
          let {
            deviceTotalCount,
            siteSize,
            todayAlarmInfoCount,
            todayAlarmDeviceCount,
            siteDeviceCollect,
            siteDeviceAlarmCollect,
            deviceConnTypeCollect,
            alarmTypeCollect,
            deviceFirmCollect,
            alarmLevelCollect,
            // deviceAlarmMapInfoList,
          } = res.data;
          this.deviceTotalCount = deviceTotalCount;
          this.siteSize = siteSize;
          this.todayAlarmInfoCount = todayAlarmInfoCount;
          this.todayAlarmDeviceCount = todayAlarmDeviceCount;
          this.siteDeviceCollect = siteDeviceCollect;
          this.alarmTypeCollect = alarmTypeCollect;
          this.deviceConnTypeCollect = deviceConnTypeCollect;
          this.deviceFirmCollect = deviceFirmCollect;
          this.siteDeviceAlarmCollect = siteDeviceAlarmCollect;
          this.alarmLevelCollect = alarmLevelCollect;
          // this.deviceAlarmMapInfoList = deviceAlarmMapInfoList;
          // if (deviceAlarmMapInfoList.length) {
          //   let arr = deviceAlarmMapInfoList.map((v) => {
          //     return [
          //       v.deviceName || "--",
          //       v.count,
          //       v.alarmTime,
          //       this.filterDevAlarmType(v.alarmType),
          //     ];
          //   });

          //   this.realTimeInfo = { ...this.realTimeInfo, data: arr };
          // }
          let { 直连设备, 子设备, 网关设备 } = deviceConnTypeCollect;
          let { 在线, 离线, 缺纸 } = alarmTypeCollect;
          let arr = Object.entries(deviceFirmCollect).sort((a, b) => {
            return parseFloat(b[1]) - parseFloat(a[1]);
          });
          let newDeviceFirmCollect = {};
          arr.forEach((v) => {
            newDeviceFirmCollect[v[0]] = v[1];
          });
          let firmName = Object.keys(newDeviceFirmCollect).map((key) => key);
          let firmValues = Object.keys(newDeviceFirmCollect).map((key) =>
            Number(newDeviceFirmCollect[key])
          );
          if (Object.keys(siteDeviceAlarmCollect).length) {
            let arr = Object.keys(siteDeviceAlarmCollect).map((key) => {
              return {
                name: key,
                value: siteDeviceAlarmCollect[key],
              };
            });
            this.warningInfo = { ...this.warningInfo, data: arr };
          }
          this.$nextTick(() => {
            // 设备类型发布
            this.getDevTypeDisEchart(直连设备, 子设备, 网关设备);
            // 设备告警类型分布
            this.getWarningDisEchart(在线, 离线, 缺纸);
            // 厂家top5
            this.getManufacturersTopEchart(firmName, firmValues);
          });
        }
      );
    },
    // 查询单个异常设备
    getStatlist() {
      this.$post("/device/alarm/info/statlist", { siteId: this.siteId }).then(
        (res) => {
          const { code, data } = res;
          if (code == 1) {
            this.Statlist = data || [];
            if (data.length) {
              let arr = data.map((v) => {
                return [
                  v.device.deviceName || "--",
                  v.todayAlarmInfoCount,
                  this.$moment(v.alarmTime).format("YYYY-MM-DD HH:mm"),
                  this.filterDevAlarmType(v.alarmTypeStr),
                  v.device.deviceCode,
                ];
              });
              this.realTimeInfo = { ...this.realTimeInfo, data: arr };
            }
          }
        }
      );
    },
    // 获取设备类型分布
    getDevTypeDisEchart(direct, subset, network) {
      let chartDom = document.getElementById("devTypeDis");
      this.devType = this.$echarts.init(chartDom);
      if (!this.devType) {
        this.devType = this.$echarts.init(chartDom);
      }
      let option = {
        // color: ["#5CEEFF", "#5DA7FF", "#FF964A"],
        title: {
          text: "设备类型分布",
          top: 10,
          left: 10,
          textStyle: {
            color: "#fff",
            fontSize: "14",
          },
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(180, 203, 212, .7)",
          borderWidth: 0,
          formatter: "{b} :  {d}%",
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          orient: "horizontal",
          left: "center",
          bottom: "0px",
          itemWidth: 8,
          itemHeight: 8,
          icon: "roundRect",
          textStyle: {
            fontSize: "14px",
            color: "#fff",
          },
        },
        graphic: {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: "总数" + "\n\n" + this.deviceTotalCount,
            textAlign: "center",
            fill: "#fff",
            width: 30,
            height: 30,
            fontSize: 14,
          },
        },
        series: [
          {
            name: "子设备",
            type: "pie",
            radius: ["45%", "60%"],
            label: {
              show: true,
              color: "#fff",
              fontSize: 12,
              formatter: "{d}%",
            },
            labelLine: {
              show: true,
              length: 6,
              length2: 6,
            },
            data: [
              {
                value: subset || 0,
                name: "子设备",
                itemStyle: {
                  color: "#5CEEFF",
                },
              },
              {
                value: network || 0,
                name: "网关设备",
                itemStyle: {
                  color: "#5DA7FF",
                },
              },
              {
                value: direct || 0,
                name: "直连设备",
                itemStyle: {
                  color: "#FF964A",
                },
              },
            ],
          },
        ],
      };

      option && this.devType.setOption(option);
    },
    // 获取告警类型分布
    getWarningDisEchart(onLine, offLine, lackPaper) {
      let chartDom = document.getElementById("warningDis");
      this.warningDis = this.$echarts.init(chartDom);
      if (!this.warningDis) {
        this.warningDis = this.$echarts.init(chartDom);
      }
      let option = {
        // color: ["#5CEEFF", "#5DA7FF", "#FF964A"],
        title: {
          text: "告警类型分布",
          top: 10,
          left: 10,
          textStyle: {
            color: "#fff",
            fontSize: "14",
          },
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(180, 203, 212, .7)",
          borderWidth: 0,
          formatter: "{b} :  {d}%",
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          orient: "horizontal",
          left: "center",
          bottom: "0px",
          itemWidth: 8,
          itemHeight: 8,
          icon: "roundRect",
          textStyle: {
            fontSize: "14px",
            color: "#fff",
          },
        },
        graphic: {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: "总数" + "\n\n" + this.todayAlarmInfoCount,
            textAlign: "center",
            fill: "#fff",
            width: 30,
            height: 30,
            fontSize: 14,
          },
        },
        series: [
          {
            type: "pie",
            radius: ["45%", "60%"],
            label: {
              show: true,
              color: "#fff",
              fontSize: 12,
              formatter: "{d}%",
            },
            labelLine: {
              show: true,
              length: 6,
              length2: 6,
            },
            data: [
              {
                value: onLine || 0,
                name: "在线",
                itemStyle: {
                  color: "#5CEEFF",
                },
              },
              {
                value: offLine || 0,
                name: "离线",
                itemStyle: {
                  color: "#5DA7FF",
                },
              },
              {
                value: lackPaper || 0,
                name: "缺纸",
                itemStyle: {
                  color: "#FF4A4A",
                },
              },
            ],
          },
        ],
      };

      option && this.warningDis.setOption(option);
    },
    // 获取厂家top5Echart
    getManufacturersTopEchart(names = [], values = []) {
      let chartDom = document.getElementById("manufacturersTop");
      // 避免刷新数据时重新初始化图表
      this.manufacturersTop = this.$echarts.getInstanceByDom(chartDom);
      if (!this.manufacturersTop) {
        this.manufacturersTop = this.$echarts.init(chartDom);
      }
      let option = {
        grid: {
          top: "0px",
          left: "0px",
          right: "0px",
          bottom: "-30px",
          containLabel: true,
        },
        // 鼠标移入信息查看
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(180, 203, 212, .7)",
          borderWidth: 0,
          textStyle: {
            color: "#fff",
          },
          formatter: (params) => {
            let str = "";
            params.forEach((v) => {
              str = `${v.name}：${v.value}%`;
            });
            return str;
          },
        },
        yAxis: [
          {
            type: "category",
            inverse: true, // 反转渲染
            data: names,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            // 改变label位置
            axisLabel: {
              show: true,
              inside: true,
              splitNumber: 50,
              boundaryGap: [20, 20],
              //y轴文字的配置
              color: "#fff", //Y轴内容文字颜色
              verticalAlign: "bottom",
              fontSize: 14,
              align: "left",
              padding: [0, 0, 10, 0],
            },
          },
        ],
        xAxis: {
          type: "value",
          show: false,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: ["rgba(255,255,255,.5)"], // 刻度线颜色
            },
          },
          axisLabel: {
            //y轴文字的配置
            color: "#fff", //Y轴内容文字颜色
          },
        },
        series: [
          {
            type: "bar",
            barWidth: "8px", // 柱体宽度
            data: values,
            // 数值
            label: {
              show: false,
              color: "#fff",
              fontSize: 12,

              position: "Left",
              padding: [0, 0, 0, 150],
              // height: 100,
              offset: [0, -12],
            },
            showBackground: true, // 显示背景色
            backgroundStyle: {
              color: "#243c71", // 背景颜色
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  // 四个数字分别对应 数组中颜色的开始位置，分别为 右，下，左，上。例如（1,0,0,0 ）代表从右边开始渐
                  // 变。offset取值为0~1，0代表开始时的颜色，1代表结束时的颜色，柱子表现为这两种颜色的渐变。
                  offset: 0,
                  color: "#5390E1",
                },
                {
                  offset: 1,
                  color: "#B8E7FF",
                },
              ]),
            },
          },
          {
            // 分隔
            type: "pictorialBar",
            itemStyle: {
              color: "#022539",
            },
            symbolRepeat: "fixed",
            symbolMargin: 4,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [2, 8],
            symbolPosition: "start",
            symbolOffset: [-1, 0],
            data: values,
            z: 66,
            animationEasing: "elasticOut",
            tooltip: {
              show: false,
            },
          },
          {
            // 分隔背景
            type: "pictorialBar",
            itemStyle: {
              color: "#022539",
            },
            symbolRepeat: "fixed",
            symbolMargin: 4,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [2, 8],
            symbolPosition: "start",
            symbolOffset: [-1, 0],
            data: [100, 100, 100, 100, 100],
            z: 60,
            animationEasing: "elasticOut",
            tooltip: {
              show: false,
            },
          },
        ],
      };

      option && this.manufacturersTop.setOption(option);
    },
    // 过滤设备告警类型
    filterDevAlarmType(type) {
      if (type == "离线") {
        return `<span style='color:#FF964A'>${type}</span>`;
      } else if (type == "在线") {
        return `<span style='color:#5ceeff'>${type}</span>`;
      } else if (type == "停用") {
        return `<span style='color:#FF4A4A'>${type}</span>`;
      }
    },
    // 定时获取数据
    getData() {
      this.timer = setInterval(() => {
        this.getDevAlarm();
        this.getStatlist();
      }, 1000 * 60);
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.analysis {
  width: 100%;
  height: 1080px;
  background: url("../../assets/images/data/bg.png") no-repeat center;
  background-size: 100% 1080px;
  color: #fff;
  .header {
    width: 100%;
    height: 126px;
    padding: 0px 50px;
    padding-top: 15px;
    background: url("~@/assets/images/data/head.png") no-repeat center;
    background-size: 100% 100%;
    position: relative;
    flex-shrink: 0;
    .title {
      .title-text {
        font-size: 42px;
        font-family: PangMenZhengDao;
        font-weight: normal;
      }
      .title-en {
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 500;
      }
    }
    .site-select {
      position: absolute;
      left: 50px;
    }
    .exit-btn {
      position: absolute;
      right: 50px;
      font-size: 16px;
    }
  }
  .main {
    padding: 0px 50px;
  }
  .dev-total {
    height: 120px;
  }
  .dev-total-item {
    width: 240px;
    height: 100%;
    padding-right: 10px;
    background: url("~@/assets/images/data/xk.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon-img {
      width: 80px;
      height: 80px;
    }
    .title {
      font-size: 16px;
      color: #d4eaff;
    }
    .count {
      font-size: 20px;
      margin: 4px 0px;
      font-family: Source Han Sans CN;
    }
    .line-img {
      height: 2px;
      width: 100%;
    }
  }
  .left {
    width: 500px;
    height: 100%;
    position: relative;
  }
  .left-centent {
    width: 100%;
    position: absolute;
    left: 0px;
    top: -20px;

    .warning-list {
      height: 230px;
      padding: 0px 25px;
      background: url("~@/assets/images/data/kuang2.png") no-repeat center;
      background-size: 100% 100%;
    }
    .dev-type-dis {
      height: 180px;
      .dis-item {
        height: 100%;
        width: 240px;
        background: url("~@/assets/images/data/kuang.png") no-repeat center;
        background-size: 100% 100%;
      }
    }
    .manufacturers-info {
      height: 230px;
      padding: 0px 25px;
      background: url("~@/assets/images/data/kuang2.png") no-repeat center;
      background-size: 100% 100%;
    }
  }
  .center {
    width: 780px;
    position: relative;
    .center-top {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .center-three {
      height: 780px;
      width: 780px;
    }
    .center-top-item {
      display: flex;
      align-items: center;
      img {
        display: block;
        width: 55px;
        margin-right: 5px;
      }
      h2 {
        font-size: 20px;
      }
      p {
        font-size: 12px;
      }
    }
  }
  .right {
    width: 500px;
    height: 100%;
    position: relative;
  }
  .right-content {
    width: 500px;
    position: absolute;
    left: 0px;
    top: -20px;
    .warning-rank-info {
      height: 188px;
      background: url("~@/assets/images/data/kuang2.png") no-repeat center;
      background-size: 100% 100%;
      .percent {
        font-size: 20px;
      }
      .warning-info-item1 {
        width: 128px;
        height: 100%;
        background: url("~@/assets/images/data/icon2.png") no-repeat center;
        position: relative;
        .title {
          font-size: 14px;
        }
        .item1-info {
          width: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: absolute;
          top: 28px;
          left: 30px;
        }
      }
      .warning-info-item2 {
        width: 168px;
        height: 100%;
        background: url("~@/assets/images/data/icon.png") no-repeat center;
        position: relative;
        .title {
          font-size: 18px;
        }
        .item2-info {
          width: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: absolute;
          top: 14px;
          left: 50px;
        }
      }
    }
    .real-time-list {
      height: 482px;
      padding: 15px;
      background: url("~@/assets/images/data/kuang3.png") no-repeat center;
      background-size: 100% 100%;
    }
  }
}
/deep/.dv-scroll-ranking-board {
  .rank,
  .info-name,
  .ranking-value {
    font-size: 16px;
    color: #eff7ff !important;
  }
  .ranking-column {
    border: none !important;
    background-color: #243c71;
    .inside-column {
      height: 6px;
      background: linear-gradient(90deg, #5390e1 80%, #b8e7ff 100%);
      position: relative;
    }
    .shine {
      display: none;
    }
  }
}
</style>
