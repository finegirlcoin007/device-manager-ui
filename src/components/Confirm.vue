<template>
  <!-- 开启confirm时，操作之前会先调动确认窗口 -->
  <el-popover
    placement="top"
    width="160"
    v-model="visible">
    <p>{{message}}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="visible = false">取消</el-button>
      <el-button type="primary" class="addclass"  size="mini" @click="change">确定</el-button>
    </div>
    <label slot="reference">
      <slot></slot>
    </label>
  </el-popover>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '确认操作?',
    }
  },
  methods: {
    change() {
      this.visible = false;
      this.$emit("confirm");
    }
  },
  data() {
    return {
      visible: false,
    }
  }
}
</script>
