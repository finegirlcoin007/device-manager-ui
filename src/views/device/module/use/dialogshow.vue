<template>
    <!-- 弹出框表单 -->
    <el-dialog :title="title" :visible.sync="open" width="90%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                                            <Field label="模块名称" prop="moduleName" v-model="form.moduleName" type="textarea" placeholder="请输入模块名称"/>
                            <Field label="模块消息编码" prop="moduleMsgCode" v-model="form.moduleMsgCode" placeholder="请输入模块消息编码"/>
                            <Field label="所属设备" prop="deviceId" v-model="form.deviceId" placeholder="请输入所属设备"/>
                            <Field label="调用次数" prop="useNum" v-model="form.useNum" placeholder="请输入调用次数"/>

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
                title: "设备模块使用频率",
                // 是否显示弹出层
                open: false,
                toString:[
                ],
                // 表单校验
                rules: {
                    moduleName: [
                        {required: true,message: "请输入模块名称", trigger: "blur" },
                        {max: 256,message: "最多只能录入256个字符",trigger: "blur",},
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
                this.title = "修改设备模块使用频率";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl = this.pageInfo.addUrl;
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增设备模块使用频率";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl =this.pageInfo.viewUrl;;
                this.getData();
                this.pageInfo.type="view"
                this.title = "设备模块使用频率详细";
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
                    moduleName : "",
                    moduleMsgCode : null,
                    deviceId : null,
                    useNum : null,
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
