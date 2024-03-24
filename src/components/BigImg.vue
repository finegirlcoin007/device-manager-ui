// 鼠标移入，查看大图
<template>
  <el-popover
    :placement="placement"
    :title="alt"
    :width="size"
    trigger="hover">
    <img :src='src' :alt="alt" :width='size' style="max-width: 100%"/>
    <img slot="reference" :src='src' :alt="alt" width='30'/>
  </el-popover>
</template>

<script>
export default {
  props: {
    placement: { // 方向
      type: String,
      default: 'right',
    },
    alt: { // 图片名
      type: String,
      default: '图片',
    },
    src: { // 图片地址
      type: String,
      default: '',
    },
    size: { // 大图宽度
      type: Number,
      default: 500,
    },
  },
}
</script>
