<template>
  <div class="page">
    <el-row  :gutter="20" style="margin-top:5px">
      <el-col :span="8" :xs="12" class="mytree">
            <el-card>
                <div slot="header">
    <span>站点结构</span>
  </div>
        <el-scrollbar style="height: 100%">

          <el-tree
            size="mini"
            ref="areaTree"
            :data="areaData"
            id="el-tree"
            node-key="id"
            indent="2"
            :props="treeProps"
            :load="loadNode"
            highlight-current
            lazy
            :render-content="renderContent"
            @node-click="handleNodeClick"
          >
          </el-tree>

        </el-scrollbar>
    </el-card>
      </el-col>
      <el-col :span="16" :xs="12">
           <el-card>
               <el-row>
          <el-tooltip effect="light" content="新增站点">
            <el-button
              circle
              @click="toAdd"
              icon="el-icon-plus"
              size="mini"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="编辑当前产品">
            <el-button
              circle
              @click="toEdit"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
          </el-tooltip>
        </el-row>
        <el-divider></el-divider>
        <!-- <view-show ref="viewform" /> -->
         </el-card>
      </el-col>
    </el-row>

    <!-- <LayoutTable :data="tableData" :config="tableConfig"> </LayoutTable> -->

    <dialog-show ref="dialogform" @ok="refreshNodeBy" />
  </div>
</template>

<script>
/** 表单弹出框模式需引入 */
import dialogShow from "./dialogshow";
import viewShow from "./view";
import tree from "@/assets/mixins/tree";
export default {
  name: "Site",
  components: {dialogShow, viewShow },
  mixins: [tree],
  created() {
     this.$get("/area/getListByParentId", {
        parentId: 0,
      }).then(({ data }) => {
        this.areaData=data.data
      });

  },
  methods: {
    /** 重写新增方法 */
    toAdd(row) {
    if(Object.keys(this.currentNode).length === 0){
        this.$message.info("请选择区域后新增站点!")
        return
    }
     if(this.currentNode.type !== 'area'){
            this.$message.info("请选择区域后新增站点!")
            return
        }

      row.areaCode=this.currentNode.areaCode
      row.areaName=this.currentNode.label
      this.$refs.dialogform.add(row);
    },
    /** 重写编辑方法 */
    toEdit(row) {
         if(Object.keys(this.currentNode).length === 0){
            this.$message.info("请选择站点后再编辑!")
            return
        }
        if(this.currentNode.type !== 'site'){
            this.$message.info("请选择站点后再编辑!")
            return
        }
         row.id=this.currentNode.id
        this.$refs.dialogform.edit(row);
    },
    toView(row) {
      //console.log("toView", this.$refs.viewform);
     // console.log("dialogform", this.$refs.dialogform);
      this.$refs.viewform.handleView(row);
    },
    handleNodeClick(node) {
      this.currentNode=node
      if(node.type=='site'){
        this.toView(this.currentNode);
      }

    },
    renderContent: function (h, { node, data, store }) {
      return (
        <span>
          <i style="font-size:16px;color:#409EFF" class={data.icon}></i>
          <span style="padding-left: 2px;font-size:14px">{node.label}</span>
        </span>
      );
    },

    refreshNodeBy(id) {
      let node = this.$refs.areaTree.getNode(this.currentNode.id); // 通过节点id找到对应树节点对象
      node.loaded = false;
      node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
       this.toView(this.currentNode);
    },

    async loadNode(node, resolve) {
      if (node.level === 0) {
        return;
      }
      this.$get("/area/getListByParentId", {
        parentId: node.data.id,
      }).then(({ data }) => {
        resolve(data.data);
      });
    },

  },
  data() {
    return {
      treeProps: {
        id: "id",
        label: "label",
        areaCode:"areaCode",
        type: "type",
        isLeaf: "isLeaf",
        children: "children",
        icon: "icon",
      },
      areaData:[],
      currentNode:{},
    };
  },
};
</script>
<style>
.el-card__body {
  padding: 10px;
}
.el-calendar-table .el-calendar-day {
  height: 70px;
}
.is-selected {
  color: #fa3b19;
}
</style>

<style lang="scss" scoped>
.mytree ::v-deep {
  .el-tree--highlight-current
    ::v-deep
    .el-tree-node.is-checked
    > .el-tree-node__content {
    background-color: rgb(255, 255, 255);
    color: rgb(64, 158, 255);
  }
  .el-tree--highlight-current
    ::v-deep
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: rgb(255, 255, 255);
    color: rgb(64, 158, 255);
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node {
    position: relative;
    padding-left: 16px;
  }
  //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
  .el-tree-node__children {
    padding-left: 16px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 24px;
  }

}
</style>
