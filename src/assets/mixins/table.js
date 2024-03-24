import axios from "axios";
import {
  formatter,
  formatterAmount,
  formatterDate,
  formatterDateOnly,
  find,
} from "@/assets/utils/table";

const tagsMap = {
  1: "danger",
  0: "success",
};

export default {
  mounted() {
    this.getData();
  },
  watch: {
    $route(route) {
      this.query = Object.assign({}, this.query, route.query);
      this.getData();
    },
  },
  beforeDestroy() {
    this.source.cancel("自动取消ajax操作");
    clearTimeout(this.loadingTimer);
  },
  methods: {
    // 开启、关闭
    changePath(path) {
      this.pageInfo.list = path + "/list";
      this.pageInfo.del = path + "/delete";
      this.pageInfo.add = path + "/add";
      this.pageInfo.edit = path + "/edit";
      this.pageInfo.view = path + "/view";
    },
    beforeFecth() {
      return Promise.resolve();
    },
    // 表格接收数据前
    beforeRender(data) {
      return data;
    },
    // 表格接收数据后
    afterRender(data) {},
    // 删除动作发生后
    afterDel(data) {},
    // 默认拉取数据
    async getData() {
      try {
        await this.beforeFecth();
      } catch (error) {
        return;
      }
      this.tableData.loading = true;
      this.$post(this.pageInfo.list, this.query, {
        cancelToken: this.source.token,
      })
        .then(({ data }) => {
          this.tableData = this.beforeRender(
            Object.assign({}, this.tableData, data)
          );
          this.afterRender(this.tableData);
        })
        .catch((error) => {
          if (error.message == "自动取消ajax操作") return;
          this.$message.error(error.message);
        })
        .then((data) => {
          clearTimeout(this.loadingTimer);
          this.loadingTimer = setTimeout(() => {
            this.tableData.loading = false;
          }, 300);
        });
    },
    // 复制一个数组或对象
    util_copy(data) {
      if (typeof data !== "object") return data;
      return JSON.parse(JSON.stringify(data));
    },
    _showAll(item) {
      let data = this.util_copy(item);
      data.isShowAll = true;
      this.util_update(item.id, data);
    },
    // 超长文本展开收起
    util_short(key, size) {
      return (row) => {
        let string = row[key] || "";
        if (string.length < size || row.isShowAll) return string;
        return (
          <span>
            {string.substr(0, 50) + "..."}
            <el-button
              size="mini"
              type="text"
              onClick={() => {
                this._showAll(row);
              }}
            >
              更多
            </el-button>
          </span>
        );
      };
    },
    // 从dict字段暴力取值，取不到则返回原值
    util_formatter(key, val) {
      try {
        return this.tableData.dict[key][val];
      } catch (error) {
        return val;
      }
    },
    // 通过id修改某条记录
    util_update(id, newData, idColumnName) {
      let table = this.tableData.data;
      let { index, data } = find(
        table,
        !idColumnName ? "id" : idColumnName,
        id
      );
      table.splice(index, 1, Object.assign({}, data, newData));
    },
    // 工具方法，把数字转化为字符串
    util_toString(data, array) {
      const dataCopy = Object.assign({}, data);
      for (var item in data) {
        dataCopy[item] =
          dataCopy[item] === undefined ? "" : dataCopy[item] + "";
      }
      return dataCopy;
    },
    util_formatterDate(time, fmt) {
      if (!time) return "";
      let date = new Date(Number(time));
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "[h|H]+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    util_getPrevMonthDate() {
      let date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      if (month == 0) {
        //年份为0代表,是本年的第一月,所以不能减
        month = 11; //月份为上年的最后月份
        year--; //年份减1
        return new Date(year, month, day);
      }
      month--; //否则,只减去月份
      return new Date(year, month, day);
    },
    // 格式化单元格数据
    formatter(row, column, val) {
      const content = formatter(this.tableData, column, val);
      return content ? (
        <el-tag type={"info"} size="mini">
          {content}
        </el-tag>
      ) : val ? (
        val
      ) : (
        "--"
      );
    },

    formatterYES(row, column, val) {
      const content = formatter(this.tableData, column, val);
      if (content) {
        if (val == "0") {
          return (
            <el-tag type={"danger"} size="mini">
              {content}
            </el-tag>
          );
        } else if (val == "1") {
          return (
            <el-tag type={"success"} size="mini">
              {content}
            </el-tag>
          );
        }
      } else {
        return val;
      }
    },

    formatterStatus(row, column, val) {
      const content = formatter(this.tableData, column, val);
      if (content) {
        if (val == "0") {
          return (
            <el-tag type={"warning"} size="mini">
              {content}
            </el-tag>
          );
        } else if (val == "1") {
          return (
            <el-tag type={"danger"} size="mini">
              {content}
            </el-tag>
          );
        } else if (val == "2") {
          return (
            <el-tag type={"success"} size="mini">
              {content}
            </el-tag>
          );
        } else {
          return <el-tag size="mini">{content}</el-tag>;
        }
      } else {
        return val;
      }
    },

    formatterDictLink(row, column, val) {
      const content = formatter(this.tableData, column, val);
      let underline = false;
      let type = "primary";
      if (val === 3) {
        type = "danger";
      }
      return content ? (
        <el-link
          type={type}
          underline={underline}
          onClick={() => {
            this.toDrawerMsg(row);
          }}
          size="mini"
        >
          {content}
        </el-link>
      ) : (
        val
      );
    },
    formatters(row, column, val) {
      if (val) {
        return val
          .split(",")
          .map((v) => {
            return formatter(this.tableData, column, v);
          })
          .join(",");
      }
      return "--";
    },
    formatterLink(row, column, val) {
      //const content = formatter(this.tableData, column-2, val);

      return (
        <el-link type="primary" class="addclass" href={val} target="_blank">
          {row.fileName}
        </el-link>
      );
      //return content;
      // return content ? <el-tag type={'info'} size='mini'>{content}</el-tag> : val
    },
    formatterString(row, column, val) {
      return formatter(this.tableData, column, val);
    },
    // 格式化单元格数据 0显示 0.00
    formatterAmount(row, column) {
      return formatterAmount(row, column);
    },
    // 格式化单元格数据钱单位里换算成元
    formatterMoney(row, column, val) {
      return ((val || 0) / 1000).toFixed(2);
    },
    // 格式化单元格数据
    formatterDate(row, column) {
      return formatterDate(row, column);
    },
    // 格式化单元格数据 只要年月日
    formatterDateOnly(row, column) {
      return formatterDateOnly(row, column);
    },
    // 格式化人员
    formaterPeople(row, column, val) {
      let info;
      if (val) {
        if (typeof val === "number") {
          info = (
            <el-tag type={"info"} size="mini">
              {this.util_formatter("assigneeList", val)}
            </el-tag>
          );
        } else {
          info = val.split(",").map((v) => {
            if (this.tableData.dict["assigneeList"][v] != undefined) {
              return (
                <el-tag type={"info"} size="mini">
                  {this.util_formatter("assigneeList", v)}
                </el-tag>
              );
            }
          });
        }
      } else {
        info = "--";
      }
      return info;
    },
    // 多选表格行
    handleSelectionChange(val) {
      this.selection = val.map((i) => i.id);
    },
    // 当某一行被点击时会触发该事件
    handleRowClick(row, column, event) {},
    // 合并表格行列
    handleSpanMethod() {},
    // 自定义表格排序
    handleSortChange() {},
    // 自定义索引号
    handleIndexMethod(index) {
      //prePageResult 每页条数
      //console.log("index:"+index)
      let size = this.tableData.pageInfo.prePageResult;
      let page = this.tableData.pageInfo.currPage;
      let count = parseInt(size) * (parseInt(page) - 1);
      return count + index + 1;
    },

    // 自定义表格选择行是否能勾选
    handleSelectableMethod(row, index) {
      return true;
    },

    // 设置单元行样式
    tableRowClassName() {},
    // 批量删除
    toBatchDel() {
      this.toDel(this.selection.join(","), true);
    },
    // 单个删除
    toDel(id, isBatch) {
      if (!id) {
        return this.$message.warning("请选中一条记录");
      }

      this.$get(this.pageInfo.del, { id: id })
        .then((res) => {
          this.$message.success(res.msg);
          // 更新数据
          if (isBatch) {
            // 批量删除，刷新页面
            this.getData();
          } else {
            let table = this.tableData.data;
            let { index } = find(table, "id", id);
            table.splice(index, 1);
            this.tableData.pageInfo.totalResult -= 1;
          }
          this.afterDel(id);
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    // 新增
    toAdd() {
      this.$router.push({
        path: this.pageInfo.add,
        query: this.tableConfig.addQuery,
      });
    },
    // 编辑
    toEdit(row, query) {
      this.$router.push({
        path: this.pageInfo.edit,
        query: Object.assign({}, { id: row.id }, query),
      });
    },
    // 查看
    toView(row, query) {
      this.$router.push({
        path: this.pageInfo.view,
        query: Object.assign({}, { id: row.id }, query),
      });
    },
    // 导入
    toImport() {
      this.$router.push({
        path: this.pageInfo.importView,
        query: this.tableConfig.addQuery,
      });
    },
    // 返回
    toBack() {
      this.$router.push({
        path: this.pageInfo.back,
      });
    },
    // 开启、关闭
    open() {},
  },
  computed: {
    tableConfig() {
      return Object.assign({}, this.defaultConfig, this.config);
    },
    pageInfo() {
      const urls = {
        // 操作所需的url地址，和url同路径
        list: this.$route.path,
        edit: this.$route.path.replace("/list", "/edit"),
        save: this.$route.path.replace("/list", "/save"),
        del: this.$route.path.replace("/list", "/delete"),
        add: this.$route.path.replace("/list", "/add"),
        view: this.$route.path.replace("/list", "/view"),
        importView: this.$route.path.replace("/list", "/importView"),
        exclude: this.$route.path.replace("/list", "/list/exclude"),
      };
      return Object.assign({}, urls, this.urls);
    },
  },
  data() {
    return {
      source: axios.CancelToken.source(),
      loadingTimer: null,
      query: this.$route.query, // url-query参数
      selection: [], // 表格内置的多选
      urls: {},
      toString: [],
      defaultConfig: {
        search: [], // 头部搜索配置
        tableName: "table",
        columns: [], // 表格列信息配置
        addQuery: {}, // 新增按钮携带的参数
        buttons: [], // 增加查询区域自定义操作按钮,格式：[{label:'按钮显示名称',isShow:是否显示true/false,loading:true/false,type:'类型',icon:'图标',method:function(){}}]
        methods: {
          handleSelectionChange: this.handleSelectionChange,
          handleRowClick: this.handleRowClick,
          tableRowClassName: this.tableRowClassName,
          handleSpanMethod: this.handleSpanMethod,
          handleSortChange: this.handleSortChange,
          handleIndexMethod: this.handleIndexMethod,
          handleSelectableMethod: this.handleSelectableMethod,
          edit: this.toEdit,
          add: this.toAdd,
          del: this.toBatchDel,
          back: this.toBack,
          importView: this.toImport,
          refresh: this.getData,
        },
      },
      tableData: {
        // 表格数据
        loading: true, // ajax请求状态
        dict: {},
        result: [],
        pageInfo: {},
      },
    };
  },
};
