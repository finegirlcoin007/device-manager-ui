<template>
  <span>
    <el-button v-if='!noEdit'  type="text" icon="el-icon-edit"  size='mini' @click='$emit("edit", row)'  title="编辑">编辑</el-button>
    <span>&nbsp;</span>
    <el-button v-if='!noView' type="text" icon="el-icon-view"  size='mini' @click='$emit("view", row)'  title="查看">查看</el-button>
     <span>&nbsp;</span>
    <Confirm @confirm='$emit("del", row.id)' message='确定要删除该条记录吗？'>
      <el-button v-if='!noDel' type="text" icon="el-icon-delete" size='mini'  title="删除">删除</el-button>
    </Confirm>
  </span>
</template>

<script>
import Confirm from '@/components/Confirm.vue';
export default {
  props: {
    noEdit: {
      type: Boolean,
      default: false
    },
    noDel: {
      type: Boolean,
      default: false
    },
    noAdd: {
      type: Boolean,
      default: false
    },
    noView: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      required: true,
      default: () => {}
    },
  },
  components: {
    Confirm,
  },
  methods: {

  },
  data() {
    return {

    }
  }
}
</script>


