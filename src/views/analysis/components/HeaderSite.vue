<template>
  <div :trigger="['click']" class="trigger" @click="ontrigger">
    <slot>
      <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
        {{siteName}} <a-icon type="down" />
      </a>
    </slot>
    <div
      slot="overlay"
      class="select-site"
      :style="{ left: `${offsetLeft}px` }"
      v-if="show"
    >
      <div class="flex_row flex_align_c primary-color name">
        <a-icon type="environment" style="margin-right: 10px" />
        <span style="">{{siteName}}</span>
      </div>
      <div class="site-list">
        <span
          v-for="(item, index) in sitelist"
          :key="index"
          :class="{ 'primary-color': item.id == checkid }"
          @click="setSite(item)"
          >{{ item.label }}</span
        >
      </div>
      <div class="check-site">
        <span>您的选择是：</span>
        <span
          v-for="(item, index) in checkarr"
          :key="index"
          @click="updataSite(item)"
          >{{ index > 0 ? ">" : "" }}{{ item.label }}</span
        >
      </div>
      <div class="site-btn">
        <a-button
          type="primary"
          style="margin-right: 10px"
          @click="onSucessSite"
          :disabled="isSite"
          >确定</a-button
        >
        <a-button @click="show = false">取消</a-button>
      </div>
    </div>
  </div>
</template>
<script>
// import {getsiteTree} from "@/services/default"
// import { mapGetters } from "vuex";
// import Cookie from 'js-cookie'
import session from "@/assets/utils/session.js";
export default {
  data() {
    return {
      sitelist: [],
      show: false,
      offsetLeft: 0,
      checkarr: [], //选中站点
      checkid: undefined, //最终选中站点
      siteName:"",
      isSite:true
    };
  },
  // computed: {
  //   ...mapGetters("account", ["user"]),
  // },
  created() {
    this.getwaitedListdata();
  },
  mounted() {
    const { offsetLeft } = this.$el;
    this.offsetLeft = offsetLeft;
  },
  methods: {
    // 确认站点
    onSucessSite() {
      if (this.checkarr.length == 0) return;
      let obj = this.checkarr[this.checkarr.length - 1];
      
      this.clickSite(obj);
    },
    // 选中
    setSite(obj) {
      
      this.checkid = undefined;
      // 为子节点不添加数据
      let data = this.checkarr[this.checkarr.length - 1];
      
      if (data && (data.isLeaf || data.children.length == 0)) {
        // 如果为子节点更新最后一个数据
        this.checkid = obj.id;
        this.checkarr[this.checkarr.length - 1] = obj;
        // 如果选中数据有子集更新站点列表
        if(obj.children && obj.children.length>0){
          this.sitelist = obj.children
        }
      } else {
        this.checkarr.push(obj);
        if(obj.children && obj.children.length>0){
          this.sitelist = obj.children
        }
      }

      if(obj && obj.type == "site"){
        this.isSite = false
      }else{
        this.isSite = true
      }
      
    },
    // 更新选中
    updataSite(row) {
      const {id} = row
      this.checkid = undefined;
      let index = this.checkarr.findIndex((v) => v.id == id);
      
      if(index > -1){
        this.checkarr.splice(index+1,this.checkarr.length-(index+1))
      }
      if(row.children && row.children.length>0){
        this.sitelist = row.children
      }
      
      if(row && row.type == "site"){
        this.isSite = false
      }else{
        this.isSite = true
      }
      // this.getwaitedListdata(id);
    },
    getwaitedListdata() {
      let url =
        process.env.VUE_APP_SITETREE_URL == "undefined"
          ? "http://192.168.0.98:11078/base/site/siteTree"
          : process.env.VUE_APP_SITETREE_URL;
      this.$get(url).then(res=>{
          const {code,data} = res.data
          
          if(code == 1){
              const {siteTree} = data
              this.sitelist = siteTree
              let arr = []
              const treeFn = function(e){
                e.forEach(element => {
                  arr.push(element)
                  if(element.children && element.children.length>0){
                    treeFn(element.children)
                  }
                });
              }
              // const siteid = Cookie.get('siteid')
              const siteid = session.getSession("siteid");
              treeFn(siteTree)
              const siteObj = arr.find(v=>v.id == siteid)
              this.siteName = siteObj?siteObj.label:"请选择站点"
          }
      })
    },
    clickSite(obj) {
      // Cookie.set('siteid', obj.id)
      session.setSession("siteid", obj.id);
      this.show = false
      if(location.href.search(/token/ig) >= 0){
        this.$router.push({path:'/resource/advimg'})
        setTimeout(() => {
          location.reload()
        });
      }else{
        location.reload()
      }
    },
    ontrigger(e) {
      if (e.target && e.target.nodeName == "A") {
        this.show = !this.show;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.trigger {
  display: inline-block;
  position: relative;
}
.ant-dropdown-link {
  color: #fff;
  padding: 0 20px;
  font-size: 16px;
  min-width: 200px;
  display: inline-block;
}
.select-site {
  position: fixed;
  left: 0;
  top: 65px;
  background: #fff;
  border-radius: 6px;
  padding: 10px;
  min-width: 60%;
  max-width: 80%;
  z-index: 9;
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  .name {
    font-size: 20px;
  }
  .site-list {
    // padding: 10px 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    span {
      float: left;
      line-height: 1.5;
      padding: 10px 20px;
      display: inline-block;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    }
  }
  .check-site,
  .site-btn {
    padding: 0 20px;
  }
}
</style>
