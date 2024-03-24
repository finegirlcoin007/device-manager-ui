<template>
    <!-- 弹出框表单 -->
    <el-dialog :title="title" :visible.sync="open" width="90%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                            <Field label="电话号码" prop="mobile" v-model="form.mobile" placeholder="请输入电话号码"/>
                            <Field label="发送内容" prop="sendMess" v-model="form.sendMess" placeholder="请输入发送内容"/>
                            <Field label="发送状态" prop="sendStatus" v-model="form.sendStatus" type="select" :enumData="dict.sendStatus" placeholder="请选择发送状态"/>
                            <Field label="发送时间" prop="sendTime" v-model="form.sendTime" type="date" />
                            <Field label="接收人" prop="receiver" v-model="form.receiver" placeholder="请输入接收人"/>

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
                title: "短信发送记录",
                // 是否显示弹出层
                open: false,
                toString:[
                    "sendStatus",
                ],
                // 表单校验
                rules: {
                    mobile: [
                        {required: true,message: "请输入电话号码", trigger: "blur" },
                        {max: 11,message: "最多只能录入11个字符",trigger: "blur",},
                    ],
                    sendMess: [
                        {required: true,message: "请输入发送内容", trigger: "blur" },
                        {max: 200,message: "最多只能录入200个字符",trigger: "blur",},
                    ],
                    sendStatus: [
                        {required: true,message: "请输入发送状态", trigger: "blur" },
                    ],
                    sendTime: [
                        {required: true,message: "请选择发送时间" },
                    ],
                    createTime: [
                        {required: true,message: "请选择创建时间" },
                    ],
                    receiver: [
                        {required: true,message: "请输入接收人", trigger: "blur" },
                        {max: 200,message: "最多只能录入200个字符",trigger: "blur",},
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
                this.title = "修改短信发送记录";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl = this.pageInfo.addUrl;
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增短信发送记录";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl =this.pageInfo.viewUrl;;
                this.getData();
                this.pageInfo.type="view"
                this.title = "短信发送记录详细";
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
                    mobile : "",
                    sendMess : "",
                    sendStatus : null,
                    sendTime : null,
                    receiver : "",
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
