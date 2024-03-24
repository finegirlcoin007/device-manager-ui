<template>
    <!-- 弹出框表单 -->
    <el-drawer
            :title="title"
            :visible.sync="open"
            :direction="direction"
            size="50%">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                            <Field :span="22" label="设备生产厂商" prop="firmName" v-model="form.firmName" placeholder="请输入设备生产厂商名称"/>
                            <Field :span="22" label="设备生产商编码" prop="firmCode" v-model="form.firmCode" placeholder="请输入设备生产商编码"/>
                            <Field :span="22" label="备注" prop="firmRemark" type="textarea" v-model="form.firmRemark" placeholder="请输入备注"/>

            </el-row>

            <form-buttons @submit='submitForm' noCancelBtn v-if="pageInfo.type != 'view'"/>
        </el-form>

    </el-drawer>
</template>

<script>
    import form from "@/assets/mixins/formdialog";
    export default {
        name: "FirmDetail",
        mixins: [form],
        components: {

        },
        created() {
            this.changePath("firm")
        },
        data() {
            return {
                // 遮罩层
                loading: true,
                // 弹出层标题
                title: "设备生产厂商",
                // 是否显示弹出层
                open: false,
                direction:"rtl",
                toString:[
                ],
                // toDate:[
                //     "createTime",
                //     "updateTime",
                // ],
                // 表单校验
                rules: {
                    createTime: [
                        {required: true,message: "请选择创建时间" },
                    ],
                }
            };
        },

        methods: {
            /** 编辑 */
            edit(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl ="firm/edit";
                this.getData();
                this.pageInfo.type="edit"
                this.title = "修改设备生产厂商";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.urls.currUrl = "firm/add";
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增设备生产厂商";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl ="firm/view";
                this.getData();
                this.pageInfo.type="view"
                this.title = "设备生产厂商详细";
            },
            /**取消按钮 */
            cancel() {
                this.open = false;
            },
            /**获取数据后弹框 */
            afterRender(data) {
                this.open = true;
            },

            afterSubmit(data) {
                this.open = false;
                this.$emit("ok");
            },

            // 表单重置
            reset() {
                this.form = {
                    firmName : "",
                    firmCode : "",
                    firmRemark : "",
                };
                this.resetForm("form");
            },
            resetForm(refName) {
                if (this.$refs[refName]) {
                    this.$refs[refName].resetFields();
                }
            },
        },
    };
</script>
