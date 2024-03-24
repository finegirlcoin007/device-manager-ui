<template>
    <layout-form>
        <el-form :model="form" :loading="loading" :rules="rules" size='small' style="width:100%" label-width='120px' ref="form">
            <el-row>
                                    <Field label="设备生产厂商名称" prop="firmName" v-model="form.firmName" placeholder="请输入设备生产厂商名称"/>
                        <Field label="设备生产商编码" prop="firmCode" v-model="form.firmCode" placeholder="请输入设备生产商编码"/>
                        <Field label="备注" prop="firmRemark" v-model="form.firmRemark" placeholder="请输入备注"/>
            </el-row>

            <form-buttons @submit='submitForm' :noSaveBtn="pageInfo.type === 'view'"/>
        </el-form>
    </layout-form>
</template>

<script>
    import form from "@/assets/mixins/form";
    export default {
        mixins: [form],
        components: {
        },
        methods: {


        },
        data() {
            return {
                toString:[
                ],
                rules: {
                    firmName: [
                        {required: true,message: "请输入设备生产厂商名称", trigger: "blur" },
                        {max: 128,message: "最多只能录入128个字符",trigger: "blur",},
                    ],
                    createTime: [
                        {required: true,message: "请选择创建时间" },
                    ],
                }
            };
        }
    };
</script>