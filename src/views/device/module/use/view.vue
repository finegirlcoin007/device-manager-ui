<template>
    <layout-view>
        <el-descriptions  :title="title" :column="column" :size="size" :colon="false" border>
            <template slot="title">
                <i class="el-icon-tickets"></i>
                基本详细信息
            </template>
            <template slot="extra">
                <el-button type="primary" class="addclass"  @click="$router.go(-1)" size="small">返回</el-button>
            </template>
                                    <el-descriptions-item label="模块名称" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.moduleName}}
                        </el-descriptions-item>
                        <el-descriptions-item label="模块消息编码" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.moduleMsgCode}}
                        </el-descriptions-item>
                        <el-descriptions-item label="所属设备" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.deviceId}}
                        </el-descriptions-item>
                        <el-descriptions-item label="调用次数" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.useNum}}
                        </el-descriptions-item>
        </el-descriptions>

    </layout-view>
</template>

<script>
    import view from "@/assets/mixins/view";
    export default {
        mixins: [view],
        components: {
        },
        methods: {

        },
        data() {
            return {
                size:"small",
                column:2,
                toString:[
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