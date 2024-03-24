<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      :to="item.path"
      :key="index"
      v-for="(item, index) in breadcrumb"
    >
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
// 获取多级菜单
const types = {
  list: "列表",
  add: "新增",
  edit: "编辑",
  view: "查看",
  importView: "导入",
  resetPwdView: "重置密码",
};

const findEntity = (list, value, key) => {
  let data = {};
  list.forEach((item, i) => {
    if (item[key] === value) {
      data = item;
      return;
    }
  });
  return data;
};

const find = (list, path, arr) => {
  // 获取二级菜单
  let newList = JSON.parse(JSON.stringify(list));
  let data = findEntity(newList, path, "path");
  let parentId = data.parentId;
  arr.push(data);
  // 获取一级菜单
  if (parentId) {
    let parent = findEntity(newList, parentId, "id");
    arr.unshift(parent);
  }
  return arr;
};

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    $route(route) {
      this.query = route.query;
    },
  },
  computed: {
    breadcrumb() {
      // 如果用户指定面包屑，则使用用户配置
      if (this.list.length) {
        return this.list;
      }
      const path = this.$route.path.replace(
        /\/(list|add|edit|importView|view|resetPwdView)$/,
        "/list"
      );
      const group = find(this.menu, path, []);
      let urlArray = this.$route.path.split("/");
      const type = urlArray.pop();
      if (types[type]) {
        group.push({
          name: types[type],
        });
      }
      return group;
    },
    menu() {
      return this.$store.state.userData.flat || [];
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less">
.el-breadcrumb {
  font-size: 12px;
}
</style>



