<template>
    <!-- 弹出框表单 -->
    <el-drawer
            :title="title"
            :visible.sync="open"
            :direction="direction"
            size="50%">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                            <Field label="产品类型" :span="20" prop="productId" type="select" :enumData="dict.productId" v-model="form.productId" placeholder="请选择产品"/>
                            <Field label="文件地址" :span="20" prop="filePath"><fileUpload ref="fileUpload" v-model="form.filePath"  :prePath="'/file/uploadfile/'+siteid"/></Field>
                            <Field label="版本号" :span="20" prop="version" type="num" v-model="form.version" placeholder="请输入版本号"/>
                            <Field label="备注信息" :span="20" prop="remark" v-model="form.remark" type="textarea" placeholder="请输入备注信息"/>

            </el-row>

            <form-buttons @submit='submitForm' noCancelBtn v-if="pageInfo.type != 'view'"/>
        </el-form>

    </el-drawer>
</template>

<script>
    import form from "@/assets/mixins/formdialog";
    import session from "@/assets/utils/session";
    export default {
        name: "ProductVersionDetail",
        mixins: [form],
        components: {

        },
        created() {
            this.changePath("product/version")
          this.siteid= session.getSession("siteid")
        },
        data() {
            return {
                 siteid:"",
                // 遮罩层
                loading: true,
                // 弹出层标题
                title: "产品客户端版本",
                // 是否显示弹出层
                open: false,
                direction:"rtl",
                toString:["productId"
                ],
                toDate:[
                ],
                // 表单校验
                rules: {
                    productId: [
                        {required: true,message: "请选择产品类型", trigger: "blur" },
                    ],
                    filePath: [
                        {required: true,message: "请上传文件", trigger: "blur" },
                    ],
                    version: [
                        {required: true,message: "请选择版本信息" },
                    ],
                }
            };
        },

        methods: {
            /** 编辑 */
            edit(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl ="product/version/edit";
                this.getData();
                this.pageInfo.type="edit"
                this.title = "修改产品客户端版本";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.urls.currUrl = "product/version/add";
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增产品客户端版本";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl ="product/version/view";
                this.getData();
                this.pageInfo.type="view"
                this.title = "产品客户端版本详细";
            },
            /**取消按钮 */
            cancel() {
                this.open = false;
            },
            /**获取数据后弹框 */
            afterRender(data) {
              this.form.siteId=session.getSession("siteid")
                this.open = true;
            },

            afterSubmit(data) {
                this.open = false;
                this.reset()
                this.$emit("ok");
            },

            // 表单重置
            reset() {
                this.form = {
                    productId : null,
                    productCode : "",
                    productName : "",
                    filePath : "",
                    version : null,
                    remark : "",
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
