// 管理后台通用表格，含：搜索，分页，表格

<template>
  <div class="layout-table" :loading="data.loading">
    <div class="table-head flex flex-pack-justify">
      <div class="table-head-left flex flex-align-center">
        <!-- <slot name="breadcrumb">
          <Breadcrumb />
        </slot> -->
        <div class="buttons">
          <el-row>
          <slot name="table-head-left"></slot>
          <slot name="table-head-center">
            <el-button
              v-if="isShowButton('notAdd')"
              type="primary" class="addclass" 
              icon="el-icon-plus"
              plain
              size="mini"
              @click="config.methods.add"
              title="新增"
              >新增</el-button
            >
            <el-button
              v-if="isShowBtn('import')"
              size="mini"
              plain
              @click="config.methods.importView"
              class="el-icon-upload2"
              title="导入"
            >导入</el-button>

            <!-- <el-button
              v-if="isShowButton('notDel')"
              icon="el-icon-delete"
              type="danger"
              plain
              size="mini"
              @click="config.methods.del"
              title="批量删除"
              >删除</el-button
            > -->
             <Confirm v-if='isShowButton("notDel")' @confirm='config.methods.del' message='确定要删除选中的多条记录吗？'>
            <el-button icon="el-icon-delete" type="danger" size='mini' plain  title="删除">删除</el-button>
          </Confirm>
            <el-button
              @click="item.method"
              size="mini"
              :key="item.label"
              :icon="item.icon"
              :type="item.type"
              :loading="item.loading"
              v-if="item.isShow"
              v-for="item in config.buttons"
              circle
              :title="item.label"
            ></el-button>
            <el-button
              v-if="isShowBtn('back')"
              @click="config.methods.back"
              size="mini"
              icon="el-icon-back"
              circle
              title="返回"
            ></el-button>
          </slot>
          <slot name="table-head-left2"></slot>
          </el-row>
        </div>
        <el-row>
          <slot name="table-head-row2-left"></slot>
        </el-row>
      </div>

      <div class="table-head-right">
        <div class="extend flex flex-pack-justify">
          <slot name="table-head-right"></slot>
          <div>
            <!-- <el-tooltip
              content="查询"
              placement="top"
              v-if="isShowButton('notSearch')"
            >
              <el-button
                icon="el-icon-search"
                circle
                size="mini"
                @click="showSearch = !showSearch"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="刷新"
              placement="top"
              v-if="isShowButton('notFresh')"
            >
              <el-button
                icon="el-icon-refresh"
                circle
                size="mini"
                @click="config.methods.refresh"
              ></el-button>
            </el-tooltip> -->
          </div>
          <el-radio-group v-model="showType" size="mini" v-if="isMobile">
            <el-radio-button label="card"
              ><i class="el-icon-menu"></i
            ></el-radio-button>
            <el-radio-button label="table"
              ><i class="el-icon-tickets"></i
            ></el-radio-button>
            <el-radio-button label="treetable"
              ><i class="el-icon-tickets"></i
            ></el-radio-button>
          </el-radio-group>
          <slot name="table-head-right2"></slot>

          <div class="table-form">
            <slot name="table-search-left"></slot>
            <SearchForm
              :search="config.search"
              v-if="isShowButton('notSearch')"
              :table="data"
              :downloadUrl="config.downloadUrl"
              :areaSelect="config.areaSelect"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 表格查询条件-->
    <!-- <div class="table-form" v-if='!isShowButton("notSearch") ? false : showSearch'> -->
    <!-- <div class="table-form">
      <slot name="table-search-left"></slot>
      <SearchForm
        :search="config.search"
        :table="data"
        :downloadUrl="config.downloadUrl"
        :areaSelect="config.areaSelect"
      />
    </div> -->

    <!-- 表格主体 -->
    <div class="table-body">
      <slot name="table-body-head"></slot>
      <slot>
        <DataTableMobile
          v-if="showType == 'card'"
          :tableData="data.data"
          :columns="config.columns"
          :tableRowClassName="config.methods.tableRowClassName"
          :handleSelectionChange="config.methods.handleSelectionChange"
          :handleRowClick="config.methods.handleRowClick"
        />
        <DataTable
          v-if="showType == 'table'"
          :tableData="data.data"
          :columns="config.columns"
          :tableName="config.tableName"
          :loading="data.loading"
          :tableRowClassName="config.methods.tableRowClassName"
          :handleSpanMethod="config.methods.handleSpanMethod"
          :handleSortChange="config.methods.handleSortChange"
          :handleIndexMethod="config.methods.handleIndexMethod"
          :handleSelectableMethod="config.methods.handleSelectableMethod"
          :handleSelectionChange="config.methods.handleSelectionChange"
          :handleRowClick="config.methods.handleRowClick"
        />

        <DataTableFlow
          v-if="showType == 'tableFlow'"
          :tableData="data.data"
          :columns="config.columns"
          :dict="data.dict"
          :loading="data.loading"
          :tableRowClassName="config.methods.tableRowClassName"
          :handleSpanMethod="config.methods.handleSpanMethod"
          :handleSortChange="config.methods.handleSortChange"
          :handleSelectionChange="config.methods.handleSelectionChange"
          :handleRowClick="config.methods.handleRowClick"
        />

        <DataTreeTable
          v-if="showType == 'treetable'"
          :tableData="data.data"
          :columns="config.columns"
          :loading="data.loading"
          :expand="config.expand"
          :tableRowClassName="config.methods.tableRowClassName"
          :handleSpanMethod="config.methods.handleSpanMethod"
          :handleSortChange="config.methods.handleSortChange"
          :handleSelectionChange="config.methods.handleSelectionChange"
          :handleRowClick="config.methods.handleRowClick"
        />
      </slot>
    </div>

    <!-- 分页器 -->
    <div
      class="table-foot"
      v-if="!isShowButton('notPagination') ? false : data.pageInfo.totalResult"
    >
      <Pagination
        style="float: left"
        :total="data.pageInfo.totalResult"
        :prePageResult="data.pageInfo.prePageResult"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import SearchForm from "@/components/SearchForm.vue";
import Confirm from "@/components/Confirm.vue";
import DataTable from "@/components/DataTable.vue";
import DataTableMobile from "./DataTableMobile.js";
import DataTableFlow from "./DataTableFlow.vue";
import DataTreeTable from "@/components/DataTreeTable.vue";

export default {
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    config: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    SearchForm,
    Pagination,
    Confirm,
    DataTable,
    DataTableMobile,
    DataTableFlow,
    DataTreeTable,
  },
  methods: {
    // 根据url的query参数判断是否展示查询条件
    isShowSearch(query) {
      if (!this.config.showSearch) {
        return false;
      }
      let showSearch = false;
      Object.keys(query).forEach((item) => {
        if (/^query\./.test(item)) {
          showSearch = true;
          return;
        }
      });
      if (this.config.showSearch) {
        showSearch = true;
      }
      return showSearch;
    },
    isShowButton(name) {
      return this.canShow.indexOf(name) === -1;
    },
    isShowBtn(name) {
      return this.canShow.indexOf(name) !== -1;
    },
  },
  watch: {
    $route(route) {
      // this.showSearch = this.isShowSearch(route.query);
    },
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    canShow() {
      this.showType = this.config.showType ? this.config.showType : "table";
      return Object.keys(this.$attrs) || [];
    },
  },
  data() {
    return {
      loading: this.config.loading,
      showSearch: this.isShowSearch(this.$route.query),
      showType: "table",
    };
  },
};
</script>

<style lang="less">
.table-body{
  margin-left: 30px;
}
@media screen and (max-width: 800px) {
  .layout-table {
    .table-head {
      display: block;
      width: 100%;
      .el-button {
        margin-bottom: 5px;
      }
      .table-head-left {
        margin-bottom: 10px;
        display: block;
        width: 100%;
      }
      .el-breadcrumb {
        margin-bottom: 10px;
        display: block;
        width: 100%;
      }
    }
  }
}
.layout-table {
  .table-head {
    margin-left: 10px;
    margin-bottom: 10px;
    //padding-bottom: 12px;
    // padding-top: 7px;
    // border-bottom: 1px solid #ededed;
    .el-breadcrumb {
      margin-right: 30px;
    }
    .table-head-left .buttons {
      button + button {
        margin-left: 10px;
      }
      button + span {
        margin-left: 10px;
      }
      span + span {
        margin-left: 10px;
      }
      span + button {
        margin-left: 10px;
      }
    }
  }
  .table-form {
    padding-top: 10px;
    margin-top: 10px;
    overflow: hidden;
  }
  .search-form-wapper {
    float: left;
  }
  .table-foot {
    width: 100%;
    overflow: auto;
  }

  &[loading] {
    pointer-events: none;
    .my-compontent-switch span,
    .el-button,
    .el-input,
    .el-tag,
    input {
      background: #eee;
      color: transparent;
      border-color: #eee;
    }
    input {
      color: #ccc;
    }
    td,
    th {
      color: #eee;
    }
    .el-pagination {
      color: #eee;
      span,
      input,
      button,
      li {
        color: #eee;
      }
    }
  }
}
</style>
