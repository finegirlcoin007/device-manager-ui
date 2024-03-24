<template>
  <div class="page">
    <LayoutTable :data="tableData" :config="tableConfig" notPagination />
    <dialog-show ref="dialogform" @ok="getData" />
  </div>
</template>

<script>
import table from "@/assets/mixins/table";
import dialogShow from "./dialogshow";

export default {
  mixins: [table],
  components: { dialogShow },
  methods: {
    beforeRender(data) {
      this.allMenu = this.sortByGroup(this.util_copy(data.data));
      // 存在查询条件，展开全部
      if (Object.keys(this.$route.query).length) {
        this.select = this.allMenu.filter((i) => !i.parentId).map((i) => i.id);
      }
      return data;
    },
    afterRender() {
      this.showChild();
    },
    // 按parentId排序分组
    sortByGroup(data) {
      return data
        .filter((i) => !i.parentId)
        .reduce((prev, item) => {
          return prev.concat(
            [item],
            data.filter((i) => i.parentId == item.id)
          );
        }, []);
    },
    // 查看下级菜单
    selectHandler({ id }) {
      // 如果已展开，则关闭
      const index = this.select.indexOf(id);
      if (index > -1) {
        this.select.splice(index, 1);
      } else {
        this.select.push(id);
      }
      this.showChild();
    },
    showChild() {
      this.tableData.data = this.allMenu.filter((item) => {
        return !item.parentId || this.select.indexOf(item.parentId) > -1;
      });
    },
    // 展示菜单图标
    showIcon(row, column) {
      return <i class={"el-icon-" + row.imgPath}></i>;
    },
    // 操作菜单状态
    changeStatus(row, column) {
      return (
        <my-switch
          confirm
          url="/menu/save"
          row={row}
          onChange={this.statusChange}
          value={this.tableData.data}
          onInput={(data) => {
            this.tableData.data = data;
          }}
        />
      );
    },
    afterDel(id) {
      this.$store.dispatch("login");
    },
    statusChange() {
      this.$store.dispatch("login");
    },
    handleUp(data) {
      let type = 0;
      let url = "/menu/upOrDown";
      this.switchSort(url, data.id, type);
    },

    handleDown(data) {
      let type = 1;
      let url = "/menu/upOrDown";
      this.switchSort(url, data.id, type);
    },

    switchSort(url, id, type) {
      this.loading = true;
      this.$post(url, {
        id: id,
        type: type,
      })
        .then((res) => {
          if (res && res.code && res.code == 1) {
            this.getData();
            this.loading = false;

            this.$message.success("更新排序成功！");
          }
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error.message);
        });
    },
    /** 重写新增方法 */
    // toAdd(row) {
    //   this.$refs.dialogform.add(row);
    // },
    // /** 重写编辑方法 */
    // toEdit(row) {
    //   this.$refs.dialogform.edit(row);
    // },
    // /** 重写查看方法 */
    // toView(row) {
    //   this.$refs.dialogform.view(row);
    // },

    handAdd(row){
      this.$router.push({
        path: this.pageInfo.add,
        query: {},
      })
    }

  },
  data() {
    return {
      allMenu: [], // 经过分组排序的表格数据
      select: [], // 当前展开的树节点
      query: {
        size: -1,
      },
      config: {
        search: [
          {
            name: "name",
            type: "text",
            label: "菜单名称",
          },
        ],
        columns: [
          {
            type: "selection",
            align: "center",
            reserveSelection: true,
            width: 60,
          },
          {
            width: 60,
            label: "树形展开",
            align: "center",
            formatter: (row) => {
              const icon =
                this.select.indexOf(row.id) === -1 ? "right" : "down";
              return !row.parentId ? (
                <div
                  onClick={() => {
                    this.selectHandler(row);
                  }}
                >
                  <i class={"el-icon-arrow-" + icon}></i>
                </div>
              ) : (
                ""
              );
            },
          },
          { type: "index", label: "序号", align: "center", width: 50 },
          {
            prop: "id",
            align: "center",
            label: "ID",
            width: 60,
          },
          {
            prop: "name",
            align: "center",
            label: "名称",
            width: 160,
          },
          {
            prop: "imgPath",
            align: "center",
            label: "图标",
            width: 120,
            // formatter: this.showIcon,
          },
          {
            prop: "authType",
            align: "center",
            label: "权限类型",
            formatter: this.formatter,
          },
          {
            prop: "parentId",
            align: "center",
            label: "父ID",
          },
          {
            prop: "url",
            align: "center",
            label: "地址",
          },
          {
            prop: "status",
            align: "center",
            label: "状态",
            width: 100,
            formatter: this.changeStatus,
          },
          {
            label: "操作",
            align: "center",
            formatter: (row) => {
              return (
                <div>
                  <el-link
                    style="margin-right:5px;margin-left:5px"
                    icon="el-icon-top"
                    onClick={() => {
                      this.handleUp(row);
                    }}
                  ></el-link>

                  <el-link
                    style="margin-right:5px;margin-left:5px"
                    icon="el-icon-bottom"
                    onClick={() => {
                      this.handleDown(row);
                    }}
                  ></el-link>

                  <table-buttons
                    noView
                    row={row}
                    onEdit={this.toEdit}
                    onDel={this.toDel}
                  />
                </div>
              );
            },
          },
        ],
      },
    };
  },
};
</script>


