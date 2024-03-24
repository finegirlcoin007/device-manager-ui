export default {
  created() {
    this.getData();
  },
  beforeDestroy() {
    clearTimeout(this.loadingTimer);
  },
  methods: {
    // 渲染前置处理
    beforeRender(data) {
      return data
    },
    // 渲染后置处理
    afterRender(data) {

    },
    // 提交表单的前置处理
    beforeSubmit(data) {
      return data
    },
    // 提交表单的后置处理, 会阻断默认的回退行为
    afterSubmit(data) {
      this.$router.go(-1);
    },
    // 默认拉取数据
    getData() {
      this.loading = true;
      this.$get(this.urls.currUrl || this.pageInfo.currUrl, this.query)
        .then(({ data }) => {
          const res = this.beforeRender(data);
          //转化枚举类型字段的number值为arrays
          res.entity = this.util_toArrays(res.entity, this.toArrays);
          // 转化枚举类型字段的number值为string
          res.entity = this.util_toString(res.entity, this.toString);
          //
          res.entity = this.util_toDateStr(res.entity, this.toDate);
          this.form = Object.assign({}, this.form, res.entity);
          this.dict = Object.assign({}, this.dict, res.dict);
          this.afterRender(res);
        })
        .catch(error => {
          console.error(error)
          this.$message.error(error.message);
        })
        .then(data => {
          clearTimeout(this.loadingTimer);
          this.loadingTimer = setTimeout(() => {
            this.loading = false;
          }, 300);
        })
    },
    // 提交表单
    submitForm(ref) {
      const el = this.$refs.form;
      el.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        this.$post(this.urls.saveUrl || this.pageInfo.saveUrl, 
            this.beforeSubmit(this.form)
        )
          .then(res => {
            this.$message.success(res.msg);
            this.afterSubmit(res);
          })
          .catch(error => {
            this.$message.error(error.message);
          })
          .then(data => {
            clearTimeout(this.loadingTimer);
            this.loadingTimer = setTimeout(() => {
              this.loading = false;
            }, 200);
          })
      });
    },
    // 复制一个数组或对象
    util_copy(data) {
      return JSON.parse(JSON.stringify(data))
    },
    // 工具方法，把数字转化为字符串
    util_toString(data, array) {
      //原始数据
      const dataCopy = Object.assign({}, data);
      array.forEach(item => {
        //如果相等做操作
        dataCopy[item] = dataCopy[item] === undefined ? '' : dataCopy[item] + '';
      })
      return dataCopy;
    },
    // 工具方法，把字符串转化为数组
    util_toArrays(data, array) {
      const dataCopy = Object.assign({}, data);
      array.forEach(item => {
        dataCopy[item] = dataCopy[item] === undefined ? [] : dataCopy[item].split(",");
      })
      return dataCopy;
    },
    // 工具方法，把字符串转化为格式化日期
    util_toDateStr(data, array) {
      const dataCopy = Object.assign({}, data);
      array.forEach(item => {
        dataCopy[item] = dataCopy[item] === undefined ? '' : this.util_formatterDate(dataCopy[item]);
      })
      return dataCopy;
    },
    util_formatterDate(time) {
      let date = new Date(Number(time));
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = this.panLeft(date.getDate()) + ' ';
      let h = this.panLeft(date.getHours()) + ':';
      let m = this.panLeft(date.getMinutes()) + ':';
      let s = this.panLeft(date.getSeconds());
      return Y+M+D+h+m+s;
    },
    panLeft(num){
      return num < 10 ? '0'+num : num;
    },

    // 从dict字段暴力取值，取不到则返回原值
    util_formatter(key, val) {
      try {
        return this.dict[key][val]
      } catch (error) {
        return val;
      }
    },
    resetForm(refName) {
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs[refName]) {
            this.$refs[refName].resetFields();
          }
        });
      }, 0);
    }
  },
  computed: {
    pageInfo() {
      let currUrl = this.$route.path;
      let urlArray = currUrl.split('/');
      let type = urlArray.pop();
      urlArray.push('save');
      let saveUrl = urlArray.join('/');
      urlArray.pop();
      urlArray.push('edit');
      let editUrl = urlArray.join('/');
      urlArray.pop();
      urlArray.push('add');
      let addUrl = urlArray.join('/');
      urlArray.pop();
      urlArray.push('view');
      let viewUrl = urlArray.join('/');
      return {
        type,
        currUrl,
        saveUrl,
        editUrl,
        addUrl,
        viewUrl,
      };
    },
  },
  data() {
    return {
      loadingTimer: null,
      loading: false, // ajax请求状态
      query: this.$route.query, // ajax请求参数
      urls: {}, // 用户自定义的请求地址，内容和pageInfo等同
      form: {}, // 表单数据
      extendFormData: {}, // 额外的表单数据
      rules: {}, // 表单验证规则
      dict: {}, // 数据字典
      toString: [], // 需要把number转化为string的表单字段name数组
      toArrays: [], // 需要把number转化为arrays的表单字段name数组
      toDate: [], // 需要把number转化为date的表单字段name数组
    }
  }
}



