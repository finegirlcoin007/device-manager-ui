<template>
  <span>
    <!-- 开启confirm时，操作之前会先调动确认窗口 -->
    <el-popover v-if="confirm" placement="top" width="160" v-model="visible">
      <p>确认操作？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false"
          >取消</el-button
        >
        <el-button type="primary" class="addclass"  size="mini" @click="statusClick"
          >确定</el-button
        >
      </div>
      <label slot="reference" class="my-compontent-switch" :checked="checked">
        <span>{{ text }}</span>
      </label>
    </el-popover>

    <!-- 直接操作 -->
    <label
      v-else
      class="my-compontent-switch"
      :checked="checked"
      @click="statusClick"
    >
      <span>{{ text }}</span>
    </label>
  </span>
</template>

<script>
export default {
  props: {
    value: Array,
    row: Object,
    confirm: Boolean,
    on: {
      type: Object,
      default: () => {
        return { value: 1, text: "启用" };
      },
    },
    off: {
      type: Object,
      default: () => {
        return { value: 0, text: "停用" };
      },
    },
    url: String,
  },
  methods: {
    async statusClick() {
      const enabled =
        this.row.enabled === this.on.value ? this.off.value : this.on.value;
      const id = this.row.id;
      //const getTokenUrl = this.url.replace('/save', '/edit');
      // await this.$post(getTokenUrl, {id});
      this.$post(this.url, {
        enabled,
        id,
      })
        .then((res) => {
          // 更新数据
          let table = JSON.parse(JSON.stringify(this.value));
          let { index, data } = this.find(table, id);
          data.enabled = enabled;
          table.splice(index, 1, data);
          this.$emit("input", table);
          this.$emit("change");
        })
        .catch((error) => {
          this.$message.error(error.message);
        })
        .then((data) => {
          this.visible = false;
        });
    },
    find(list, id) {
      let index = -1;
      let data = null;
      list.forEach((item, i) => {
        if (item.id === id) {
          index = i;
          data = Object.assign({}, item);
          return;
        }
      });
      return {
        index,
        data,
      };
    },
  },
  computed: {
    text() {
      return this.row.enabled === this.on.value ? this.on.text : this.off.text;
    },
    checked() {
      return this.row.enabled === this.on.value;
    },
  },
  data() {
    return {
      visible: false,
    };
  },
};
</script>

<style lang="less">
.my-compontent-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 12px;
  line-height: 19px;
  height: 20px;
  vertical-align: middle;
  &[checked] span {
    border-color: #409eff;
    background-color: #409eff;
    padding: 0 23px 0 10px;
    &::after {
      left: 100%;
      margin-left: -17px;
    }
  }
  span {
    margin: 0;
    display: inline-block;
    position: relative;
    height: 20px;
    border: 1px solid #dcdfe6;
    outline: none;
    color: #fff;
    padding: 0 10px 0 23px;
    border-radius: 10px;
    box-sizing: border-box;
    background: #dcdfe6;
    cursor: pointer;
    transition: border-color 0.3s, background-color 0.3s;
    vertical-align: middle;
    &::after {
      content: "";
      position: absolute;
      top: 1px;
      left: 1px;
      border-radius: 100%;
      transition: all 0.3s;
      width: 16px;
      height: 16px;
      background-color: #fff;
    }
  }
}
</style>
