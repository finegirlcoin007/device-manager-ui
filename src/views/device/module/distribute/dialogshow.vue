<template>
    <!-- 弹出框表单 -->
    <el-dialog :title="title" :visible.sync="open" width="90%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                            <Field :span="20" label="产品" prop="productId" v-model="form.productId" :enumData="dict.productId"   type="select" placeholder="请选择产品"/>

                            <Field :span="20"  label="分辨率" prop="imageResolution" v-model="form.imageResolution" :enumData="dict.imageResolution" type="select" placeholder="请选择分辨率"/>


                            <Field :span="20"  label="上传文件"><fileUpload v-model="form.filePath"   prePath="/file/uploadfile"/></Field>

<!--
              <Field :span="20"  label="默认选择" prop="imageResolution" v-model="form.selected" :enumData="dict.selected" type="radio" placeholder="默认选择"/>
-->


              <Field :span="20"  label="版本号" prop="version" v-model="form.version"  placeholder="请输入版本号"/>

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
    import FileUpload from '@/components/FileUpload';
    import session from "@/assets/utils/session";
    export default {
        mixins: [form],
        components: {
            dialogShow ,
            FileUpload,
        },
        data() {
            return {
                // 遮罩层
                loading: true,
                // 弹出层标题
                title: "设备前端模块部署",
                // 是否显示弹出层
                open: false,
                toString:[
                    "distribute",
                      "productId",
                    "imageResolution"
                ],
                // 表单校验
                rules: {
                    productId: [
                        {required: true,message: "请选择产品", trigger: "blur" },
                    ],
                    imageResolution: [
                        {required: true,message: "请输入分辨率", trigger: "blur" },
                        {max: 256,message: "最多只能录入256个字符",trigger: "blur",},
                    ],
                    imageResolutionValue: [
                        {required: true,message: "请输入分辨率值", trigger: "blur" },
                        {max: 256,message: "最多只能录入256个字符",trigger: "blur",},
                    ],
                    distribute: [
                        {required: true,message: "请输入是否部署", trigger: "blur" },
                    ],
                }
            };
        },

        methods: {
            /** 编辑 */
            edit(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl ="device/module/distribute/edit";
                this.getData();
                this.pageInfo.type="edit"
                this.title = "修改设备前端模块部署";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.urls.currUrl = "device/module/distribute/add";
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增设备前端模块部署";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl ="device/module/distribute/view";
                this.getData();
                this.pageInfo.type="view"
                this.title = "设备前端模块部署详细";
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
                this.$emit("ok");
            },

            // 表单重置
            reset() {
                this.form = {
                    siteId:0,
                    productId : null,
                    productCode : "",
                    productName : "",
                    imageResolution : "",
                    imageResolutionValue : "",
                    filePath : "",
                    distributeFilePath : "",
                    version : "",
                    distribute : null,
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
