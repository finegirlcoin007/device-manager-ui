<template>
  <div class="page page-home homeIndex" style="min-height: 100vh">
    <el-row :gutter="10">
      <el-row
        style="margin-left: 50px; margin-right: 50px"
        type="flex"
        justify="end"
        :gutter="10"
      >
        <el-button type="text" size="mini" style="color: #fff"
          >数据更新:{{
            formatterDate(statData.updateTime)
          }}
          5分钟后自动更新</el-button
        >
        <el-button
          icon="el-icon-refresh"
          style="color: #fff"
          size="mini"
          @click="syncDeviceStat"
          type="text"
          >手动刷新</el-button
        >
      </el-row>

      <el-card
        style="
            margin-left: 50px;
            margin-right: 50px;
            margin-top: 10px;
            height: 160px;
          "
      >
        <div class="total-list">
          <!-- 设备总数 -->
          <div class="total-item">
            <p class="total-item-count">{{ statData.deviceTotalCount }}</p>
            <span style="font-size: 12px"
              ><span class="tips">昨日 </span
              ><span
                :class="{
                  success: statData.deviceAddCount >= 0,
                  warn: statData.deviceAddCount < 0,
                }"
                >{{
                  statData.deviceAddCount >= 0
                    ? "+" + statData.deviceAddCount
                    : "-" + statData.deviceAddCount
                }}</span
              ></span
            >
            <p class="total-item-title">
              <img src="../assets/images/abzs.png" alt="" />
              <span>设备总数</span>
            </p>
          </div>
          <!-- 监控站点数 -->
          <div class="total-item">
            <p class="total-item-count">{{ statData.siteTotalCount }}</p>
            <span style="font-size: 12px"
              ><span class="tips">昨日 </span
              ><span
                :class="{
                  success: statData.siteAddCount >= 0,
                  warn: statData.siteAddCount < 0,
                }"
                >{{
                  statData.siteAddCount >= 0
                    ? "+" + statData.siteAddCount
                    : "-" + statData.siteAddCount
                }}</span
              ></span
            >
            <p class="total-item-title">
              <img src="../assets/images/jczds.png" alt="" />
              <span>监控站点数</span>
            </p>
          </div>
          <!-- 在线设备 -->
          <div class="total-item">
            <p class="total-item-count">{{ statData.deviceOnlineCount }}</p>
            <span style="font-size: 12px"
              ><span class="tips">上线率 </span
              ><span v-bind:class="{ success: statData.deviceOnlineRatio >= 0 }"
                >{{ (statData.deviceOnlineRatio * 100).toFixed(2) }}%</span
              ></span
            >
            <p class="total-item-title">
              <img src="../assets/images/zxsb.png" alt="" />
              <span>在线设备</span>
            </p>
          </div>
          <!-- 离线率 -->
          <div class="total-item">
            <p class="total-item-count">{{ statData.deviceOfflineCount }}</p>
            <span style="font-size: 12px"
              ><span class="tips">离线率 </span
              ><span v-bind:class="{ warn: statData.deviceOfflineRatio >= 0 }"
                >{{ (statData.deviceOfflineRatio * 100).toFixed(2) }}%</span
              ></span
            >
            <p class="total-item-title">
              <img src="../assets/images/lxsb.png" alt="" />
              <span>离线设备</span>
            </p>
          </div>
          <!-- 停用设备 -->
          <div class="total-item">
            <p class="total-item-count">{{ statData.deviceStopRatio }}</p>
            <span style="font-size: 12px"
              ><span class="tips">停用率 </span
              ><span v-bind:class="{ warn: statData.deviceStopRatio >= 0 }"
                >{{ (statData.deviceStopRatio * 100).toFixed(2) }}%</span
              ></span
            >
            <p class="total-item-title">
              <img src="../assets/images/tusb.png" alt="" />
              <span>停用设备</span>
            </p>
          </div>
          <!-- 未激活设备 -->
          <div class="total-item">
            <p class="total-item-count">{{ statData.deviceUnActiveRatio }}</p>
            <span style="font-size: 12px"
              ><span class="tips">未激活率 </span
              ><span v-bind:class="{ warn: statData.deviceUnActiveRatio >= 0 }"
                >{{ (statData.deviceUnActiveRatio * 100).toFixed(2) }}%</span
              ></span
            >
            <p class="total-item-title">
              <img src="../assets/images/wjhsb.png" alt="" />
              <span>未激活设备</span>
            </p>
          </div>
          <!-- 今日警告次数 -->
          <div class="total-item">
            <p class="total-item-count">{{ statData.alarmTotalCount }}</p>
            <span style="font-size: 12px"
              ><span class="tips">昨日 </span
              ><span
                v-bind:class="{
                  success: statData.alarmAddCount >= 0,
                  warn: statData.alarmAddCount < 0,
                }"
                >{{
                  statData.alarmAddCount >= 0
                    ? "+" + statData.alarmAddCount
                    : "-" + statData.alarmAddCount
                }}</span
              ></span
            >
            <p class="total-item-title">
              <img src="../assets/images/gjcs.png" alt="" />
              <span>今日告警次数</span>
            </p>
          </div>
          <!-- 今日消息推送 -->
          <div class="total-item">
            <p class="total-item-count">{{ statData.pushTotalCount }}</p>
            <span style="font-size: 12px"
              ><span class="tips">昨日 </span
              ><span
                v-bind:class="{
                  success: statData.pushAddCount >= 0,
                  warn: statData.pushAddCount < 0,
                }"
                >{{
                  statData.pushAddCount >= 0
                    ? "+" + statData.pushAddCount
                    : "-" + statData.pushAddCount
                }}</span
              ></span
            >
            <p class="total-item-title">
              <img src="../assets/images/xits.png" alt="" />
              <span>今日消息推送次数</span>
            </p>
          </div>
        </div>
      </el-card>
    </el-row>

    <el-row
      style="margin-left: 35px; margin-right: 35px; margin-top: 15px"
      :gutter="20"
    >
      <el-col :span="12">
        <!-- 设备数据 -->
        <el-card class="box-card">
          <div id="deviceTotal" style="width: 100%; height: 300px"></div>
          <!-- 天数选择 -->
          <el-select
            class="change-day"
            v-model="myEchartsDay"
            @change="changeEchartDay(1)"
            size="mini"
            placeholder="请选择"
          >
            <el-option label="近15天" :value="15"> </el-option>
            <el-option label="近30天" :value="30"> </el-option>
          </el-select>
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- 设备状态 -->
        <el-card class="box-card">
          <div id="deviceStat" style="width: 100%; height: 300px"></div>
          <!-- 天数选择 -->
          <el-select
            class="change-day"
            size="mini"
            placeholder="请选择"
            @change="changeEchartDay(2)"
            v-model="deviceStatEchartsDay"
          >
            <el-option label="近15天" :value="15"> </el-option>
            <el-option label="近30天" :value="30"> </el-option>
          </el-select>
        </el-card>
      </el-col>
    </el-row>

    <el-row
      style="margin-left: 35px; margin-right: 35px; margin-top: 10px"
      :gutter="20"
    >
      <el-col :span="12">
        <!-- 设备告警 -->
        <el-card class="box-card device-alarm">
          <div id="deviceAlarm" style="width: 70%; height: 300px"></div>
          <div id="PieEcharts" style="width: 30%; height: 300px"></div>
          <!-- 天数选择 -->
          <el-select
            class="change-day"
            v-model="deviceAlarmEchartsDay"
            @change="changeEchartDay(3)"
            size="mini"
            placeholder="请选择"
          >
            <el-option label="近15天" :value="15"> </el-option>
            <el-option label="近30天" :value="30"> </el-option>
          </el-select>
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- 设备消息推送 -->
        <el-card class="box-card">
          <div id="devicePush" style="width: 100%; height: 300px"></div>
          <!-- 天数选择 -->
          <el-select
            class="change-day"
            v-model="devicePushEchartsDay"
            @change="changeEchartDay(4)"
            size="mini"
            placeholder="请选择"
          >
            <el-option label="近15天" :value="15"> </el-option>
            <el-option label="近30天" :value="30"> </el-option>
          </el-select>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { formatterDate } from "@/assets/utils/index";
import session from "@/assets/utils/session";
export default {
  computed: {
    userData() {
      return this.$store.state.userData.currUserName;
    },
    // 近15天时间
    // day15() {
    //   return this.$moment().add(-15, "d").format("YYYY-MM-DD HH:mm:ss");
    // },
    // 近30天时间
    // day30() {
    //   return this.$moment().add(-30, "d").format("YYYY-MM-DD HH:mm:ss");
    // },
  },
  mounted() {
    this.timer = setInterval(this.syncDeviceStat, 1000 * 300);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    // 解绑window事件
    window.removeEventListener("resize", this.adapterEcharts);
  },
  created() {
    // this.siteId = window.sessionStorage.getItem("siteid") || null
    this.siteId = session.getSession("siteid") || null;
    let today = new Date();
    let query = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      siteId: this.siteId,
    };
    //查询今日设备统计
    this.loading = true;
    this.$post("/device/stat/list", query)
      .then((res) => {
        if (res.code == 1) {
          this.statData = res.data.data[0];
        }
        this.loading = false;
      })
      .catch((error) => {
        this.$message.error(error.message);
      });
    //默认查询15天数据
    let beforeday = new Date(today);
    beforeday.setDate(beforeday.getDate() - 15);
    this.findDeviceTotalStat(beforeday);
    this.findDeviceStat(beforeday);
    this.findDeviceAlarm(beforeday);
    this.findDevicePush(beforeday);
  },
  methods: {
    formatterDate,
    // echarts 适配函数
    adapterEcharts() {
      this.deviceTotalChart.resize();
      this.deviceStatChart.resize();
      this.alarmChart.resize();
      this.pieChart.resize();
      this.pushChart.resize();
    },
    syncDeviceStat() {
      this.$post("/device/stat/syncDeviceStat", { siteId: this.siteId })
        .then((res) => {
          if (res.code == 1) {
            this.statData = res.data.data[0];
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    findDeviceTotalStat(beforeday) {
      let query = { createTimeStart: this.formatterDate(beforeday) };
      //当前选择站点id
      query.siteId = this.siteId;
      query.size = -1;
      this.$post("/device/stat/list", query)
        .then((res) => {
          if (res.code == 1) {
            this.statArrayData = res.data.data;
            this.beforeday = this.statArrayData.map((i) => {
              let daystr = i.month + "-" + i.day;
              return daystr;
            });

            this.deviceTotalyData = this.statArrayData.map((i) => {
              return i.deviceTotalCount;
            });
            this.deviceOnlineyData = this.statArrayData.map((i) => {
              return i.deviceOnlineRatio;
            });

            this.$nextTick(() => {
              this.myEcharts();
            });
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    findDeviceStat(beforeday) {
      let query = { createTimeStart: this.formatterDate(beforeday) };
      query.siteId = this.siteId;
      query.size = -1;
      this.$post("/device/stat/list", query)
        .then((res) => {
          if (res.code == 1) {
            this.statArrayData = res.data.data;

            this.beforeDeviceStatday = this.statArrayData.map((i) => {
              let daystr = i.month + "-" + i.day;
              return daystr;
            });

            this.deviceStatOnlineyData = this.statArrayData.map((i) => {
              return i.deviceOnlineRatio;
            });
            this.deviceStatOfflineyData = this.statArrayData.map((i) => {
              return i.deviceOfflineRatio;
            });
            this.$nextTick(() => {
              this.deviceStatEcharts();
            });
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    findDeviceAlarm(beforeday) {
      let query = { createTimeStart: this.formatterDate(beforeday) };
      query.siteId = this.siteId;
      query.size = -1;
      this.$post("/device/stat/list", query)
        .then((res) => {
          if (res.code == 1) {
            this.statArrayData = res.data.data;

            this.beforeDeviceAlarmday = this.statArrayData.map((i) => {
              let daystr = i.month + "-" + i.day;
              return daystr;
            });

            this.deviceAlarmyData = this.statArrayData.map((i) => {
              return i.alarmTotalCount;
            });

            this.$nextTick(() => {
              this.deviceAlarmEcharts();
              this.devicePieEcharts();
            });
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    findDevicePush(beforeday) {
      let query = { createTimeStart: this.formatterDate(beforeday) };
      query.siteId = this.siteId;
      query.size = -1;
      this.$post("/device/stat/list", query)
        .then((res) => {
          if (res.code == 1) {
            this.statArrayData = res.data.data;

            this.beforeDevicePushday = this.statArrayData.map((i) => {
              let daystr = i.month + "-" + i.day;
              return daystr;
            });

            this.devicePushyData = this.statArrayData.map((i) => {
              return i.pushTotalCount;
            });

            this.$nextTick(() => {
              this.devicePushEcharts();
            });
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    changeEchartDay(type) {
      let today = new Date();
      let beforeday = new Date(today);
      if (type == 1) {
        beforeday.setDate(beforeday.getDate() - this.myEchartsDay);
        this.findDeviceTotalStat(beforeday);
      }
      if (type == 2) {
        beforeday.setDate(beforeday.getDate() - this.deviceStatEchartsDay);
        this.findDeviceStat(beforeday);
      }
      if (type == 3) {
        beforeday.setDate(beforeday.getDate() - this.deviceAlarmEchartsDay);
        this.findDeviceAlarm(beforeday);
      }
      if (type == 4) {
        beforeday.setDate(beforeday.getDate() - this.devicePushEchartsDay);
        this.findDevicePush(beforeday);
      }
    },

    // 设备数据图
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      this.deviceTotalChart = this.$echarts.init(
        document.getElementById("deviceTotal")
      );
      let option = {
        title: {
          text: "设备数据",
          top: "0",
          subtext: "",
          fontSize: "16px",
          color: "#333",
        },
        // 图例提示框
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          textStyle: {
            color: "#000",
          },
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },

        grid: {
          top: "30%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          orient: "horizontal",
          top: "40px",
          left: "0",
          y: "top",
          itemWidth: 14,
          data: ["设备总量", "在线趋势"],
          icon: "roundRect",
        },
        xAxis: {
          type: "category",
          data: this.beforeday,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: [
          {
            type: "value",
            min: 0, // 配置 Y 轴刻度最小值
            max: 500, // 配置 Y 轴刻度最大值
            // interval: 50,
            splitNumber: 5, // 配置 Y 轴数值间隔
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
          {
            type: "value",
            min: 0, // 配置 Y 轴刻度最小值
            max: 1, // 配置 Y 轴刻度最大值
            // interval: 5,
            splitNumber: 5, // 配置 Y 轴数值间隔
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              formatter: "{value} %",
            },
          },
        ],

        series: [
          // 多组折线图数据
          {
            name: "设备总量",
            data: this.deviceTotalyData,
            type: "bar",
            barWidth: 22, // 设置柱状图的宽度
          },

          {
            name: "在线趋势",
            yAxisIndex: 1,
            data: this.deviceOnlineyData,
            type: "line",
          },
        ],
        color: ["#2984D8", "#3FCA97"],
      };

      // 使用刚指定的配置项和数据显示图表。
      this.deviceTotalChart.setOption(option);
      // 适配
      window.addEventListener("resize", this.adapterEcharts);
    },
    // 设备状态图
    deviceStatEcharts() {
      this.deviceStatChart = this.$echarts.init(
        document.getElementById("deviceStat")
      );

      let deviceStatOption = {
        title: {
          text: "设备状态",
          top: "0",
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          textStyle: {
            color: "#000",
          },
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          top: "40px",
          left: "0",
          itemWidth: 14,
          data: ["在线率", "离线率"],
          icon: "roundRect",
        },

        grid: {
          top: "30%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.beforeDeviceStatday,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            max: 1,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "在线率",
            type: "line",
            stack: "online",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            color: "#2984D8",
            areaStyle: {
              opacity: 0.8,
              color: "#ACD1FB",
            },
            emphasis: {
              focus: "series",
            },
            data: this.deviceStatOnlineyData,
          },
          {
            name: "离线率",
            type: "line",
            stack: "offline",
            smooth: true,
            color: "#FA2C2E",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: "#CE8BA4",
            },
            emphasis: {
              focus: "series",
            },
            data: this.deviceStatOfflineyData,
          },
        ],
      };

      this.deviceStatChart.setOption(deviceStatOption);
      // 适配
      window.addEventListener("resize", this.adapterEcharts);
    },
    // 告警趋势图
    deviceAlarmEcharts() {
      this.alarmChart = this.$echarts.init(
        document.getElementById("deviceAlarm")
      );

      let option = {
        title: {
          text: "设备告警趋势",
          top: "0",
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          textStyle: {
            color: "#000",
          },
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          itemWidth: 14,
          top: "40px",
          left: "",
          data: ["告警次数"],
          icon: "roundRect",
        },
        grid: {
          top: "30%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.beforeDeviceAlarmday,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "告警次数",
            type: "line",
            stack: "Total",
            smooth: true,
            color: "#247EE4",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: "#ACD1FB",
            },
            emphasis: {
              focus: "series",
            },
            data: this.deviceAlarmyData,
          },
        ],
      };
      this.alarmChart.setOption(option);
      // 适配
      window.addEventListener("resize", this.adapterEcharts);
    },
    // 告警趋势饼图
    devicePieEcharts() {
      this.pieChart = this.$echarts.init(document.getElementById("PieEcharts"));
      let option = {
        tooltip: {
          trigger: "item",
          backgroundColor: "#fff",
          textStyle: {
            color: "#000",
          },
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: "pie",
            radius: ["35%", "50%"],
            label: {
              color: "#A3A0A4",
              position: "outside",
            },
            top: "40",
            labelLine: {
              length: 10, // 指示线长度
              length2: 5, // 指示线长度
            },
            data: [
              {
                value: 1048,
                name: "离线",
                itemStyle: {
                  color: "#ACC8FD",
                },
              },
              {
                value: 735,
                name: "缺纸",
                itemStyle: {
                  color: "#ADECD4",
                },
              },
              {
                value: 580,
                name: "失效",
                itemStyle: {
                  color: "#667997",
                },
              },
              {
                value: 484,
                name: "其他",
                itemStyle: {
                  color: "#FADD85",
                },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.pieChart.setOption(option);
      // 适配
      window.addEventListener("resize", this.adapterEcharts);
    },
    // 消息推送图
    devicePushEcharts() {
      this.pushChart = this.$echarts.init(
        document.getElementById("devicePush")
      );
      let option = {
        title: {
          text: "设备消息推送趋势",
          top: "0",
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          textStyle: {
            color: "#000",
          },
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          top: "40px",
          itemWidth: 14,
          left: "0",
          data: ["告警次数"],
          icon: "roundRect",
        },
        grid: {
          top: "30%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.beforeDevicePushday,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "告警次数",
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#89AAF7",
            },
            data: this.devicePushyData,
          },
        ],
      };
      this.pushChart.setOption(option);
      // 适配
      window.addEventListener("resize", this.adapterEcharts);
    },
  },
  data() {
    return {
      siteId: null,
      timer: "",
      loading: false,
      indexStatInfo: {},
      recordListLoading: false,
      statData: {},
      dayProjectList: [],
      pendList: [],
      beforeday: [],
      beforeDeviceStatday: [],
      beforePushday: [],
      beforeAlarmday: [],
      deviceTotalyData: [],
      deviceOnlineyData: [],
      deviceStatOnlineyData: [],
      deviceStatOfflineyData: [],
      deviceAlarmyData: [],
      devicePushyData: [],
      weekPerDay: {
        xData: [],
        yData: [],
      },
      dict: {},
      value: new Date(),
      myEchartsDay: 15, // 设备数据天数选择
      deviceStatEchartsDay: 15, // 设备状态天数选择
      deviceAlarmEchartsDay: 15, // 设备告警天数选择
      devicePushEchartsDay: 15, // 消息推送天数选择
    };
  },
};
</script>

<style scoped lang="less">
/deep/.el-card__body {
  width: 100%;
  height: 100%;
}

.total-list {
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .total-item {
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .total-item-count {
      font-size: 24px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #333333;
    }

    .total-item-title {
      display: flex;
      align-items: center;

      img {
        width: 14px;
        height: 14px;
        margin-right: 4px;
      }

      span {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #8a8a8a;
      }
    }
  }
}

.success {
  color: green;
}

.warn {
  color: rgb(215, 25, 25);
}

.homeIndex {
  display: inline-block;
  position: relative;
}

/deep/.el-card__body {
  display: flex;
  position: relative;
}

.change-day {
  width: 120px !important;
  position: absolute;
  top: 40px;
  right: 20px;
  z-index: 100;
}

.homeIndex::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 35%;
  background: linear-gradient(90deg, #1845c6 0%, #2999ff 100%);
}
</style>
