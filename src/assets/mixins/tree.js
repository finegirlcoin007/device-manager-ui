import axios from 'axios';

export default {
  mounted() {

  },
  beforeDestroy () {
    this.source.cancel('自动取消ajax操作');
    clearTimeout(this.loadingTimer);
  },
  methods: {
    beforeFecth() {
      return Promise.resolve();
    },
    // 表格接收数据前
    beforeRender(data){return data},
    // 表格接收数据后
    afterRender(data){},
    // 默认拉取数据
    async getTreeData() {

    },


    handleNodeClick(node) {

    },
    renderContent: function (h, { node, data, store }) {
      return (
        <span>
          <i style="font-size:16px;color:#409EFF" class={data.icon}></i>
          <span style="padding-left: 2px;font-size:14px">{node.label}({data.siteCount}家)</span>
        </span>
      );
    },

    async loadNode(node, resolve) {

      if (node.level === 0) {
        return;
      }
      resolve(data.result);
    },

    refreshNodeBy(id) {
      let node = this.$refs.areaTree.getNode(this.currentNode.id); // 通过节点id找到对应树节点对象
      node.loaded = false;
      node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
       this.toView(this.currentNode);
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
     }
  }
}



