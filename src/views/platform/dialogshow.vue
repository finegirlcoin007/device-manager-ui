<template>
    <!-- 弹出框表单 -->
    <el-dialog :title="title" :visible.sync="open" width="90%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                            <Field :span="20" label="平台名称" prop="platformName" v-model="form.platformName" placeholder="请输入平台名称，名称唯一"/>
                            <Field :span="20" label="平台编码" prop="platformSn" v-model="form.platformSn"  placeholder="请输入平台编码，编码唯一"/>
                            <Field :span="20" label="发送地址" prop="sendUrl" v-model="form.sendUrl"  placeholder="请输入发送httpurl地址"/>
                           <!-- <Field :span="20" label="首页地址" prop="homeUrl" v-model="form.homeUrl"  placeholder="请输入首页地址"/> -->
                           
                            <!-- <Field :span="20" label="发送消息类型" prop="sendMsgType" v-model="form.sendMsgType" type="radio" :enumData="dict.sendMsgType" placeholder="请选择发送第三方平台消息类型"/> -->
                             <Field :span="20" label="是否发送消息" prop="sendSwitch" v-model="form.sendSwitch" type="radio" :enumData="dict.sendSwitch" placeholder="请选择是否启用发送消息"/>
                            <Field :span="20" label="备注" prop="platformRemark" v-model="form.platformRemark" type="textarea" placeholder="请输入备注"/>

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
                title: "平台系统",
                // 是否显示弹出层
                open: false,
                toString:[
                    "sendMsgType",
                    "sendSwitch",
                ],
                // 表单校验
                rules: {
                    platformName: [
                        {required: true,message: "请输入平台名称，名称唯一", trigger: "blur" },
                        {max: 20,message: "最多只能录入20个字符",trigger: "blur",},
                    ],
                    platformSn: [
                        {required: true,message: "请输入平台编码，编码唯一", trigger: "blur" },
                        {max: 256,message: "最多只能录入256个字符",trigger: "blur",},
                    ],
                    sendMsgType: [
                        {required: true,message: "请输入发送第三方平台消息类型", trigger: "blur" },
                    ],
                    sendSwitch: [
                        {required: true,message: "请输入是否启用发送消息", trigger: "blur" },
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
                this.title = "修改平台系统";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl = this.pageInfo.addUrl;
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增平台系统";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl =this.pageInfo.viewUrl;;
                this.getData();
                this.pageInfo.type="view"
                this.title = "平台系统详细";
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
                    platformName : "",
                    platformSn : "",
                    sendMsgType : 0,
                    sendConfig : "",
                    sendSwitch : 0,
                    platformRemark : "",
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
