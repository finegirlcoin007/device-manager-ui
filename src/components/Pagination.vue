// 列表-分页

<template>
  <div class="pagination-wapper flex">
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="currPage"
      :page-size="currSize"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      layout="sizes, total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    prePageResult: {
      type: Number,
      default: 10,
    },
  },
  watch: {
    $route(route) {
      this.initPage(route.query);
    },
  },
  created() {
    this.initPage(this.$route.query);
  },
  methods: {
    initPage(query) {
      this.currPage = parseInt(query["page"]) || 1;
      this.currSize = parseInt(query["size"]) || this.prePageResult;
    },
    changeHash(key, val) {
      let { path, query } = this.$route;
      this.$router.push({
        path: path,
        query: Object.assign({}, query, { [`${key}`]: val }),
      });
    },
    handleSizeChange(currSize) {
      this.changeHash("size", currSize);
    },
    handleCurrentChange(currPage) {
      this.changeHash("page", currPage);
    },
  },
  data() {
    return {
      currPage: 1,
      currSize: 10,
    };
  },
};
</script>

<style lang="less">
.pagination-wapper {
  background: #fff;
  margin-top: 10px;
  .el-pagination {
    margin-left: auto;
  }
}
</style>



