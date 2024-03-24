<template>
  <div v-if="form.id">
        <el-descriptions class="descClass"  :title="title" :column="column" :size="size" :colon="false" border>
             <template slot="title">
                <i class="el-icon-tickets"></i>
                 基本信息
            </template> 
                                    <el-descriptions-item label="站点名称" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.siteName}}
                        </el-descriptions-item>
                        <el-descriptions-item label="区域编号" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.areaCode}}
                        </el-descriptions-item>

                         <el-descriptions-item label="区域名称" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.areaName}}
                        </el-descriptions-item>
         
                        <el-descriptions-item label="站点编号" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.siteCode}}
                        </el-descriptions-item>
                        <el-descriptions-item label="省编码" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.proCode}}
                        </el-descriptions-item>
                        <el-descriptions-item label="区编码" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.areaCode}}
                        </el-descriptions-item>
                        <el-descriptions-item label="市编码" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.cityCode}}
                        </el-descriptions-item>
                        <el-descriptions-item label="站点服务器ip" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.siteIp}}
                        </el-descriptions-item>
                        <el-descriptions-item label="站点服务器端口" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.sitePort}}
                        </el-descriptions-item>
                        <el-descriptions-item label="经度" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.longitude}}
                        </el-descriptions-item>
                        <el-descriptions-item label="纬度" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.latitude}}
                        </el-descriptions-item>
      
                        <el-descriptions-item label="中心联系电话" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.siteTel}}
                        </el-descriptions-item>
                        <el-descriptions-item label="中心详细地址" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.detailAddress}}
                        </el-descriptions-item>
                        <el-descriptions-item label="中心介绍" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.siteRemark}}
                        </el-descriptions-item>

                        <el-descriptions-item label="楼层" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.level}}
                        </el-descriptions-item>
                        <el-descriptions-item label="楼栋" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.building}}
                        </el-descriptions-item>
                
        </el-descriptions>


        <el-descriptions class="descClass"  :title="title" :column="column" :size="size" :colon="false" border>
             <template slot="title">
                <i class="el-icon-tickets"></i>
                 办公信息
            </template> 
             <el-descriptions-item label="上午上班开始时间" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.amWorkStartTime}}
                        </el-descriptions-item>
                        <el-descriptions-item label="上午上班结束时间" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.amWorkEndTime}}
                        </el-descriptions-item>
                        <el-descriptions-item label="下午上班开始时间" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.pmWorkStartTime}}
                        </el-descriptions-item>
                        <el-descriptions-item label="下午上班结束时间" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.pmWorkEndTime}}
                        </el-descriptions-item>

                         <el-descriptions-item label="周一 " label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("workday1", form.workday1) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="周二 " label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("workday2", form.workday2) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="周三 " label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("workday3", form.workday3) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="周四 " label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("workday4", form.workday4) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="周五 " label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("workday5", form.workday5) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="周六 " label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("workday6", form.workday6) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="周日 " label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("workday7", form.workday7) }}
                        </el-descriptions-item>
  </el-descriptions>

  <el-descriptions class="descClass"  :title="title" :column="column" :size="size" :colon="false" border>
             <template slot="title">
                <i class="el-icon-tickets"></i>
                 部署模块
            </template> 
              <el-descriptions-item label="模块" label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("modelIds", form.modelIds) }}
                        </el-descriptions-item>
  </el-descriptions>

 </div>
</template>

<script>
    import view from "@/assets/mixins/view";
    export default {
        mixins: [view],
        components: {
        },
        methods: {
       /** 查看*/
            handleView(row) {
                this.query = { id: row.id };
                this.urls.currUrl =this.pageInfo.viewUrl;;
                this.getData();
            },
        },
        data() {
            return {
                size:"small",
                column:2,
                toString:[
                    "workday1",
                    "workday2",
                    "workday3",
                    "workday4",
                    "workday5",
                    "workday6",
                    "workday7",
                ],
                toArrays: [

                ],
                toDate: [

                ]
            }
        }
    }
</script>
<style lang="less">
    .descClass{
        margin-top:5px;
         margin-bottom:5px
    }
    .labelClass{
        width: 200px;
    }
    .el-descriptions__body{
        margin-left: 5px;
        margin-right: 5px;
        color: #606266;
        background-color: #FFF;
    }
    .contentClass{
        width: 600px;
    }
</style>