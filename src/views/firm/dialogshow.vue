<template>
    <!-- 弹出框表单 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                                            <Field :span="20" label="设备生产厂商名称" prop="firmName" v-model="form.firmName" placeholder="请输入设备生产厂商名称"/>
                            <Field :span="20" label="设备生产商编码" prop="firmCode" v-model="form.firmCode" placeholder="请输入设备生产商编码"/>
                            <Field :span="20" label="备注" prop="firmRemark" type="textarea" v-model="form.firmRemark" placeholder="请输入备注"/>

            </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" class="addclass"  v-if="pageInfo.type !== 'view'" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import form from "@/assets/mixins/formdialog";
    import dialogShow from "./dialogshow";
    export default {
        mixins: [form],
        components: {
            dialogShow ,
        },
        data() {
            return {
                // 遮罩层
                loading: true,
                // 弹出层标题
                title: "设备生产厂商",
                // 是否显示弹出层
                open: false,
                toString:[
                ],
                // 表单校验
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
        },

        methods: {
            /** 编辑 */
            edit(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl =this.pageInfo.editUrl;;
                this.getData();
                this.pageInfo.type="edit"
                this.title = "修改设备生产厂商";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl = this.pageInfo.addUrl;
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增设备生产厂商";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl =this.pageInfo.viewUrl;;
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
