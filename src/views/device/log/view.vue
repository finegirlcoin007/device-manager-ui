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
                                    <el-descriptions-item label="设备编号" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.deviceNum}}
                        </el-descriptions-item>
                        <el-descriptions-item label="设备名称，设置设备名称。" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.deviceName}}
                        </el-descriptions-item>
                        <el-descriptions-item label="日志类型，" label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("logType", form.logType) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="内容" label-class-name="labelClass" content-class-name="contentClass">
                            <editor v-model="form.content" :min-height="256"/>
                        </el-descriptions-item>
        </el-descriptions>

    </layout-view>
</template>

<script>
    import view from "@/assets/mixins/view";
    import Editor from '@/components/Editor';
    export default {
        mixins: [view],
        components: {
            Editor,
        },
        methods: {

        },
        data() {
            return {
                size:"small",
                column:2,
                toString:[
                    "logType",
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