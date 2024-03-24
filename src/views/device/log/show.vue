<template>
    <layout-form>
        <el-form :model="form" :loading="loading" :rules="rules" size='small' style="width:100%" label-width='120px' ref="form">
            <el-row>
                                    <Field label="设备编号" prop="deviceNum" v-model="form.deviceNum" placeholder="请输入设备编号"/>
                        <Field label="设备名称，设置设备名称。" prop="deviceName" v-model="form.deviceName" placeholder="请输入设备名称，设置设备名称。"/>
                        <Field label="日志类型，" prop="logType" v-model="form.logType" type="select" :enumData="dict.logType" placeholder="请选择日志类型，"/>
                        <Field label="内容"><editor v-model="form.content" :min-height="256"/></Field>
            </el-row>

            <form-buttons @submit='submitForm' :noSaveBtn="pageInfo.type === 'view'"/>
        </el-form>
    </layout-form>
</template>

<script>
    import form from "@/assets/mixins/form";
    import Editor from '@/components/Editor';
    export default {
        mixins: [form],
        components: {
            Editor,
        },
        methods: {


        },
        data() {
            return {
                toString:[
                    "logType",
                ],
                rules: {
                    deviceNum: [
                        {required: true,message: "请输入设备编号", trigger: "blur" },
                        {max: 32,message: "最多只能录入32个字符",trigger: "blur",},
                    ],
                    deviceName: [
                        {required: true,message: "请输入设备名称，设置设备名称。", trigger: "blur" },
                        {max: 32,message: "最多只能录入32个字符",trigger: "blur",},
                    ],
                    logType: [
                        {required: true,message: "请输入日志类型，", trigger: "blur" },
                    ],
                    createTime: [
                        {required: true,message: "请选择创建时间" },
                    ],
                }
            };
        }
    };
</script>