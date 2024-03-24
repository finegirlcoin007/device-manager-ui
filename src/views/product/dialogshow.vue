<template>
    <!-- 弹出框表单 -->
    <el-dialog :title="title" :visible.sync="open" width="90%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                                            <Field label="产品名称，名称唯一" prop="productName" v-model="form.productName" placeholder="请输入产品名称，名称唯一"/>
                            <Field label="产品编码" prop="productCode" v-model="form.productCode" type="textarea" placeholder="请输入产品编码"/>
                            <Field label="备注" prop="productRemark" v-model="form.productRemark" type="textarea" placeholder="请输入备注"/>

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
                title: "产品",
                // 是否显示弹出层
                open: false,
                toString:[
                ],
                // 表单校验
                rules: {
                    productName: [
                        {required: true,message: "请输入产品名称，名称唯一", trigger: "blur" },
                        {max: 20,message: "最多只能录入20个字符",trigger: "blur",},
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
                this.urls.currUrl ="product/edit";
                this.getData();
                this.pageInfo.type="edit"
                this.title = "修改产品";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.urls.currUrl = "product/add";
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增产品";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl ="product/view";
                this.getData();
                this.pageInfo.type="view"
                this.title = "产品详细";
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
                    platformId : null,
                    productName : "",
                    productCode : "",
                    productRemark : "",
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
