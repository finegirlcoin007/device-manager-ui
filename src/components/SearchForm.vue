// 列表-条件查询

<template>
  <div class="search-form-wapper">
    <el-form :inline="true" :model="form" ref="search-form" size="small">
      <el-form-item
        v-for="(item, i) in search"
        :key="i"
        v-bind:class="{ search_new_line: item.newLine }"
      >
        <el-input
          v-model="form[item.name]"
          v-if="item.type === 'text'"
          :placeholder="
            item.placeholder ? item.placeholder : '请输入' + item.label
          "
        ></el-input>

        <el-checkbox-group
          v-model="form[item.name]"
          v-if="item.type === 'checkbox'"
        >
          <el-checkbox
            v-for="(label, value) in table.dict[item.name]"
            :label="value"
            :key="value"
            >{{ label }}</el-checkbox
          >
        </el-checkbox-group>

        <el-select
          v-model="form[item.name]"
          :filterable="item.filterable"
          :multiple="item.multiple"
          clearable="true"
          @change="item.change"
          @clear="item.clear"
          v-if="item.type === 'select'"
          :placeholder="'请选择'+item.label"
        >
          <el-option
            label="全部"
            value=""
            v-if="!item.multiple && !item.notShowAll"
          ></el-option>
          <el-option
            :label="label"
            :value="value"
            v-for="(label, value) in table.dict[item.name]"
            :key="value"
          ></el-option>
        </el-select>

        <el-select
          v-model="form[item.name]"
          clearable
          :multiple="item.multiple"
          filterable
          remote
          v-if="item.type === 'remoteSelect'"
          placeholder="请输入关键词"
          searchType="item.searchType"
          :remote-method="
            (query) => {
              remoteMethod(query, item.searchType);
            }
          "
        >
          <el-option
            :label="label"
            :value="value"
            v-for="(label, value) in remoteOptions[item.searchType]"
            :key="value"
          ></el-option>
        </el-select>

        <el-cascader
          placeholder="选择区域"
          v-if="item.type === 'cascader'"
          v-model="selectedTreeID"
          :filterable="item.filterable"
          clearable="true"
          change-on-select
          @change="treeSelecteds"
          :options="treeDatas"
        ></el-cascader>

        <el-select
          v-model="form[item.name]"
          :multiple="item.multiple"
          :remote-method="userRemoteMethod"
          :loading="loading"
          @focus="userRemoteMethod"
          :reserve-keyword="item.reserve - keyword"
          :clearable="item.clearable"
          :placeholder="item.placeholder ? item.placeholder : '请输入用户'"
          filterable
          remote
          v-if="item.type === 'userLoginNameRemoteSelect'"
        >
          <el-option
            v-for="i in userData"
            :key="i.loginName"
            :label="i.realName"
            :value="i.loginName"
          ></el-option>
        </el-select>

        <el-date-picker
          v-model="form[item.name]"
          v-if="item.type === 'date' && !item.valueFormat"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>

        <el-date-picker
          v-model="form[item.name]"
          v-if="item.type === 'date' && item.valueFormat"
          type="date"
          :value-format="item.valueFormat"
          placeholder="选择日期"
        >
        </el-date-picker>

        <el-date-picker
          v-model="form[item.name]"
          v-if="item.type === 'month' && !item.valueFormat"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月份"
        >
        </el-date-picker>

        <el-date-picker
          v-model="form[item.name]"
          v-if="item.type === 'month' && item.valueFormat"
          type="month"
          :value-format="item.valueFormat"
          placeholder="选择月份"
        >
        </el-date-picker>

        <el-date-picker
          v-model="form[item.name]"
          v-if="item.type === 'datetime'"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="item.label"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary" class="addclass"
          icon="el-icon-search"
          @click="onSubmit"
          title="查询"
          >查询</el-button
        >

        <el-button
          icon="el-icon-download"
          @click="downloadFile"
          :loading="isDownload"
          v-if="downloadUrl"
          >下载</el-button
        >
        <el-button icon="el-icon-refresh-left" @click="cleanForm" title="清空"
          >清空</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Qs from "qs";
import { type } from "@/assets/utils";
import { isArray } from "util";

export default {
  props: {
    search: {
      type: Array,
      default: () => [],
    },
    table: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    $route(route) {
      console.log(222)
      this.initForm(route.query);
    },
  },
  async created() {
    console.log("1111")
    this.initForm(this.$route.query);
  },
  methods: {
    remoteMethod(query, searchType) {
      if (query == "") {
        return;
      }
      this.loading = true;
      var param = {
        name: query,
        searchType: searchType,
      };
      try {
        this.$post("/common/autoComplete/list", param).then(({ data }) => {
          this.loading = false;
          var tempOptions = {};
          data.result.forEach(({ id, name }) => {
            tempOptions[id] = name;
          });
          this.remoteOptions[searchType] = Object.assign({}, tempOptions);
          sessionStorage.setItem(
            searchType + "OptionsDict",
            JSON.stringify(this.remoteOptions[searchType])
          );
        });
      } catch (error) {}
    },
    async initForm(data) {
      //初始化查询表单
      let newFormData = {};
      // this.form = this.encode(data, this.form);
      this.search.forEach((item) => {
        //复选框
        if (item.type === "checkbox") {
          if (this.form[item.name] == undefined) {
            newFormData[item.name] = [];
          } else if (Array.prototype.isPrototypeOf(this.form[item.name])) {
            newFormData[item.name] = this.form[item.name];
          } else {
            newFormData[item.name] = [this.form[item.name]];
          }
        } else if (item.multiple === true) {
          if (this.form[item.name] == undefined) {
            this.form[item.name] = [];
            newFormData[item.name] = [];
          } else {
            if (!isArray(this.form[item.name])) {
              var temp = this.form[item.name];
              this.form[item.name] = [temp];
              newFormData[item.name] = [temp];
            }
          }
        }
      });
      this.form = Object.assign({}, this.form, newFormData);
     // this.form = Object.assign({}, this.form, data);
     // console.log("after form",this.form)
    },
    cleanForm() {
      this.clean();
      this.onSubmit();
    },
    // 清空表单值
    clean() {
      let newData = {};
      this.search.forEach((item) => {
        if (item.name === "groupList") {
          newData[item.name] = [];
        } else {
          newData[item.name] = item.multiple ? [] : undefined;
        }
      });
      this.form = Object.assign({}, this.form, newData);
    },
    onSubmit() {
      let { path, query } = this.$route;
      let data = this.decode(this.form);
      console.log("data:",data)
      console.log("form",this.form)
      //delete this.form["deviceStatusList"]
      this.$router.push({
        path: path,
        query: Object.assign({}, query, data),
      });
      //this.decodetwo(this.form)
    },
    // 解析url字符串，去除query字段
    encode(data, formTemp) {
      let newData = {};
      Object.keys(Qs.parse(data)).forEach((item) => {
        if (/^query\./.test(item)) {
          let val = data[item];
          let key = item.replace(/^query\./, "");
          this.search.forEach((obj) => {
            if (
              obj.name === key &&
              obj.fuzzy === true &&
              val &&
              val.length > 0
            ) {
              //支持模糊查询,首尾去掉百分号
              val = val.substring(1, val.length - 1);
            }
          });

          let isAreaTemp = ["areaId"];
          let isAreaParam = isAreaTemp.includes(key);
          newData[key] =
            type(val) === "Array"
              ? val.map(isAreaParam ? Number : String)
              : val;
        }
      });
      return newData;
    },

    // 解析url字符串，加入query字段
    decode(data) {
      let newData = { page: 1 };
      Object.keys(data).forEach((item) => {
        let val = data[item];
        this.search.forEach((obj) => {
          if (
            obj.name === item &&
            obj.fuzzy === true &&
            val &&
            val.length > 0
          ) {
            //支持模糊查询,收尾增加百分号
            val = val.trim();
            if (val.charAt(0) != "%") {
              val = "%" + val;
            }
            if (val.charAt(val.length - 1) != "%") {
              val = val + "%";
            }
          }
        });
        newData[item] = this.decodeVal(val);
      });
      return newData;
    },


    decodetwo(data) {
      let newData = { page: 1 };
      Object.keys(data).forEach((item) => {
        let val = data[item];
        this.search.forEach((obj) => {
          if (
              obj.name === item &&
              obj.fuzzy === true &&
              val &&
              val.length > 0
          ) {
            //支持模糊查询,收尾增加百分号
            val = val.trim();
            if (val.charAt(0) == "%") {
              val = val.slice(1);
            }
            if (val.charAt(val.length - 1) == "%") {
              val = val + "%";
            }
          }
        });
        newData[item] = this.decodeVal(val);
      });
      return newData;
    },

    decodeVal(val) {
      let valType = type(val);
      if (["Number", "Boolean"].indexOf(valType) > -1) {
        return val;
      }
      if (valType == "Undefined" || valType == "Null") {
        return undefined;
      }
      if (valType == "String") {
        let str = val.trim();
        return str.length ? str : undefined;
      }
      return val;
    },

    listChange() {},
  },
  computed: {},
  data() {
    return {
      form: {
        groupList: [],
      },
      remoteOptions: {},
    };
  },
};
</script>

<style lang="less">
.search_new_line {
  width: 100%;
}
.search-form-wapper {
  .el-input {
    width: 170px;
  }
  .el-select .el-input {
    width: 140px;
  }
}

@media screen and (max-width: 800px) {
  .search-form-wapper {
    .el-form-item {
      width: 100%;
      .el-form-item__label {
        min-width: 70px;
      }
      .el-input {
        width: 200px;
      }
      .el-select .el-input {
        width: 200px;
      }
    }
  }
}
</style>

