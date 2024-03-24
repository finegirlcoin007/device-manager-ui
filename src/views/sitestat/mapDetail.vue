<template>
  <div>
    <MapDetail ref="map" :markersData="originData" @choose="getDetailData">
      <el-card body-style="padding:0px;" slot="leftTop1">
        <el-button
          type="text"
          size="mini"
          style="margin-left: 10px"
          icon="el-icon-back"
          @click="switchStat"
          >返回至站点分布</el-button
        >
      </el-card>

      <el-card slot="leftTop">
        <el-row type="flex" justify="space-between">
          <span style="font-size: 18px"
            ><b>{{ info.siteName }}</b></span
          >
        </el-row>

        <el-divider></el-divider>
        <el-descriptions :column="1" size="small">
          <el-descriptions-item label="站点编码">{{
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
          }}</el-descriptions-item>
        </el-descriptions>

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

        <el-row type="flex" justify="space-around" style="margin-top: 10px">
          <el-button
            type="primary"
            class="addclass"
            @click="switchList"
            size="mini"
            >列表模式</el-button
          >

          <el-button
            type="primary"
            class="addclass"
            size="mini"
            icon="el-icon-edit-outline"
            @click="editSite"
            >编辑站点</el-button
          >

          <el-button
            type="primary"
            class="addclass"
            size="mini"
            @click="addDevice"
            icon="el-icon-plus"
            >添加设备</el-button
          >
        </el-row>
      </el-card>

      <el-col
        slot="rightTop"
        style="box-shadow: 12px 2px 12px 12px rgba(0, 0, 0, 0.1)"
      >
        <el-row type="flex" justify="space-around">
          <el-select
            style="padding: 5px"
            size="mini"
            @change="deviceStatuschange"
            v-model="deviceStatus"
            placeholder="请选择设备状态"
          >
            <el-option
              v-for="($label, $value) in tableData.dict.deviceStatus"
              :key="$value"
              :label="$label"
              :value="$value"
            ></el-option>
          </el-select>
          <span> </span>
        </el-row>

        <el-row>
          <el-input
            size="mini"
            v-model="deviceName"
            @change="deviceNameChange"
            style="padding: 5px"
            placeholder="请输入设备编码"
          ></el-input>
        </el-row>

        <el-divider></el-divider>

        <el-row
          v-for="(v, index) in productList.data"
          :key="index"
          type="flex"
          style="border-bottom: 1px solid #e8eaec; padding: 10px"
          justify="space-between"
        >
          <img
            v-if="formatDevIcon(v.productId) && isImageAvailable(v.productId)"
            :src="require(`@/assets/images/${formatDevIcon(v.productId)}.png`)"
          />
          <img v-else src="@/assets/images/dn.png" />
          <!-- <i style="font-size: 20px" class="el-icon-location-information"></i> -->
          <span style="font-size: 12px">{{
            formatDevIcon(v.productId) || "--"
          }}</span>
          <el-switch
            v-model="items[index]"
            :active-value="String(v.productId)"
            :inactive-value="0"
            @change="switchChange"
            active-color="#2882ED"
            inactive-color="#8C8B8E"
          >
          </el-switch>
        </el-row>
      </el-col>
    </MapDetail>

    <drawer-show ref="drawerform" @ok="getData" />
    <drawer-view ref="drawerViewform" @ok="getData" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import drawerView from "../device/drawerview";
import drawerShow from "../device/drawershow";
import table from "@/assets/mixins/table";
import { formatterDate } from "@/assets/utils/index";

export default {
  name: "DeviceMap",
  components: { drawerShow, drawerView },
  mixins: [table],
  created() {
    let { siteId } = this.$route.query;
    let { sitestatId } = this.$route.query;

    this.$get("/sitestat/info", { id: sitestatId })
      .then(({ data }) => {
        this.info = data;
        this.$nextTick(() => {
          this.$refs.map.relocate(this.info);
        });
      })
      .catch((error) => {
        console.error(error);
        this.$message.error(error.message);
      });

    //this.info = this.$route.query;
    this.query = { sitestatId: sitestatId, siteId, siteId };
  },
  methods: {
    formatterDate,
    deviceStatuschange(val) {
      this.query = Object.assign({}, this.query, { deviceStatus: val });
      this.getData();
    },
    deviceNameChange(val) {
      val = val.trim();
      if (val.charAt(0) != "%") {
        val = "%" + val;
      }
      if (val.charAt(val.length - 1) != "%") {
        val = val + "%";
      }

      this.query = Object.assign({}, this.query, { deviceName: val });
      this.getData();
    },
    editSite() {
      this.$confirm("请在基础设置系统修改站点信息", "提示", {
        showCancelButton: false, //是否显示取消按钮
      });
    },
    addDevice() {
      let row = {};
      row.siteId = this.info.siteId;
      row.siteName = this.info.siteName;
      row.siteCode = this.info.siteCode;
      this.$refs.drawerform.add(row);
    },
    switchList() {
      let path = this.$route.path;
      sessionStorage.setItem("sitestat", path);
      //进入设备列表页面
      this.$router.push({
        path: "/device/list",
        query: {
          siteId: this.info.siteId,
          sitestatId: this.info.id,
        },
      });
    },
    switchStat() {
      this.$router.push({
        path: "/sitestat/maplist",
      });
    },
    switchChange(val) {
      this.$forceUpdate();
      let arr = [];
      for (let item in this.items) {
        if (this.items[item] && this.items[item] != 0)
          arr.push(this.items[item]);
      }
      if (arr.length > 0) {
        this.query = Object.assign({}, this.query, { productIdList: arr });
      }
      this.getData();
    },
    afterRender(data) {
      if (!this.sync) {
        this.$nextTick(() => {
          this.productList = data;
          let count = 0;
          for (let i of data.data) {
            this.items[count] = i.productId + "";
            count++;
          }
          this.sync = true;
        });
      }
      //刷新地图markers
      this.$refs.map.refresh(data.data);
    },
    /** 重写新增方法 */
    toAdd(row) {
      //this.$refs.dialogform.add(row);
      row.siteId = this.siteId;
      row.siteName = this.siteName;
      row.siteCode = this.siteCode;

      this.$refs.drawerform.add(row);
    },
    /** 重写编辑方法 */
    toEdit(row) {
      row.siteName = this.siteName;
      row.siteCode = this.siteCode;
      this.$refs.drawerform.edit(row);
    },
    /** 重写查看方法 */
    toView(row) {
      this.$refs.drawerViewform.view(row);
    },
    // 格式设备图标
    formatDevIcon(product) {
      let { productId } = this.tableData.dict;
      let label = productId[product];
      return label || "";
    },
    isImageAvailable(product) {
      try {
        require(`@/assets/images/${this.formatDevIcon(product)}.png`);
        return true;
      } catch (error) {
        return false;
      }
    },
  },
  data() {
    return {
      originData: [],
      productList: [],
      value1: 1,
      sync: false,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（设备导入）
        open: false,
        // 弹出层标题（设备导入）
        title: "导入设备数据",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 上传的地址
        url: "/m/device/importData",
      },
      // 站点树
      pageInfo: {
        list: "/device/maplist",
      },

      deviceStatus: null,
      deviceName: null,

      items: {},

      info: {},
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",

      isExport: false,
      siteId: null,
      siteName: "",
      siteCode: "",

      updateSiteId: null,
      updateSiteName: "",
      updateSiteCode: "",
    };
  },
};
</script>
<style lang="less" scoped>
.el-divider--horizontal {
  margin: 5, 0, 5, 0;
  background: 0 0;
  border-top: 1px solid #e8eaec;
}

.back {
  width: 200px;
  top: 20px;
  left: 34px;
  position: absolute;
  float: left;
}

.el-row {
  margin-bottom: 5px;
  margin-top: 5px;

  &:last-child {
    margin: 0;
  }
}
</style>

<style>
.location0 {
  font-size: 18px;
  color: red;
}

.location1 {
  font-size: 18px;
  color: blueviolet;
}

.location2 {
  font-size: 18px;
  color: aqua;
}

.location3 {
  font-size: 18px;
  color: coral;
}

.location4 {
  font-size: 18px;
  color: slateblue;
}

.location5 {
  font-size: 18px;
  color: purple;
}

.location6 {
  font-size: 18px;
  color: darkgreen;
}

.location7 {
  font-size: 18px;
  color: magenta;
}

.location8 {
  font-size: 18px;
  color: goldenrod;
}

.location9 {
  font-size: 18px;
  color: orchid;
}

.location10 {
  font-size: 18px;
  color: navy;
}

.location11 {
  font-size: 18px;
  color: darkred;
}

.location12 {
  font-size: 18px;
  color: forestgreen;
}

.location13 {
  font-size: 18px;
  color: cyan;
}

.location14 {
  font-size: 18px;
  color: deepskyblue;
}
</style>
