<template>
    <!-- 弹出框表单 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>

              <Field label="应用名称" :span="20" prop="appCode" type="select" :enumData="dict.appPublish" v-model="form.appCode" placeholder="请选择应用"/>

              <Field :span="20" label="文件路径地址"><fileUpload v-model="form.filePath"  prePath="/file/uploadfile" :canDown="false"/></Field>
                            <Field label="应用类型" :span="20" prop="appType" v-model="form.appType" type="select" :enumData="dict.appType" placeholder="请选择应用类型"/>
                            <Field label="版本号" :span="20" prop="version" type="num" v-model="form.version" placeholder="请输入版本号"/>

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
                title: "应用发布部署",
                // 是否显示弹出层
                open: false,
                toString:[
                    "appType",
                    "distribute",
                    "appCode",
                ],
                // 表单校验
                rules: {
                    appType: [
                        {required: true,message: "请输入应用类型", trigger: "blur" },
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
                this.urls.currUrl ="app/publish/edit";
                this.getData();
                this.pageInfo.type="edit"
                this.title = "修改应用发布部署";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.urls.currUrl = "app/publish/add";
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增应用发布部署";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl ="app/publish/view";
                this.getData();
                this.pageInfo.type="view"
                this.title = "应用发布部署详细";
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
                    appCode : null,
                    appName : null,
                    filePath : null,
                    distributeFilePath : null,
                    appType : null,
                    distribute : null,
                    version : null,
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
