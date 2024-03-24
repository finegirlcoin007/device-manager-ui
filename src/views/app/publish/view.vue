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
                                    <el-descriptions-item label="应用编码" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.appCode}}
                        </el-descriptions-item>
                        <el-descriptions-item label="应用名称" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.appName}}
                        </el-descriptions-item>
                        <el-descriptions-item label="文件路径地址" label-class-name="labelClass" content-class-name="contentClass">
                            <fileUpload v-model="form.filePath"  prePath="/file/uploadfile"/>
                        </el-descriptions-item>
                        <el-descriptions-item label="文件部署路径地址" label-class-name="labelClass" content-class-name="contentClass">
                            <fileUpload v-model="form.distributeFilePath"  prePath="/file/uploadfile"/>
                        </el-descriptions-item>
                        <el-descriptions-item label="应用类型" label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("appType", form.appType) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="是否部署" label-class-name="labelClass" content-class-name="contentClass">
                            {{ util_formatters("distribute", form.distribute) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="版本" label-class-name="labelClass" content-class-name="contentClass">
                            {{form.version}}
                        </el-descriptions-item>
        </el-descriptions>

    </layout-view>
</template>

<script>
    import view from "@/assets/mixins/view";
    import FileUpload from '@/components/FileUpload';
    export default {
        mixins: [view],
        components: {
            FileUpload,
        },
        methods: {

        },
        data() {
            return {
                size:"small",
                column:2,
                toString:[
                    "appType",
                    "distribute",
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