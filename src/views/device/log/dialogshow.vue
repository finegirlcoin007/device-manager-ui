<template>
    <!-- 弹出框表单 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                            <Field :span="20" label="设备编号" prop="deviceNum" v-model="form.deviceNum" placeholder="请输入设备编号"/>
                            <Field label="设备名称" :span="20" prop="deviceName" v-model="form.deviceName" placeholder="请输入设备名称，设置设备名称。"/>
                            <Field label="日志类型" :span="20" prop="logType" v-model="form.logType" type="radio" :enumData="dict.logType" placeholder="请选择日志类型，"/>
                            <Field label="内容" :rows="4" :span="20" type="textarea"></Field>

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
    import Editor from '@/components/Editor';
    export default {
        mixins: [form],
        components: {
            dialogShow ,
            Editor,
        },
        data() {
            return {
                // 遮罩层
                loading: true,
                // 弹出层标题
                title: "设备日志",
                // 是否显示弹出层
                open: false,
                toString:[
                    "logType",
                ],
                // 表单校验
                rules: {
                    deviceNum: [
                        {required: true,message: "请输入设备编号", trigger: "blur" },
                        {max: 32,message: "最多只能录入32个字符",trigger: "blur",},
                    ],
                    deviceName: [
                        {required: true,message: "请输入设备名称，设置设备名称。", trigger: "blur" },
                        {max: 32,message: "最多只能录入32个字符",trigger: "blur",},
                    ],
                    logType: [
                        {required: true,message: "请输入日志类型，", trigger: "blur" },
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
                this.title = "修改设备日志";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl = this.pageInfo.addUrl;
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增设备日志";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl =this.pageInfo.viewUrl;;
                this.getData();
                this.pageInfo.type="view"
                this.title = "设备日志详细";
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
                    deviceId : null,
                    deviceNum : "",
                    deviceName : "",
                    logType : null,
                    content : "",
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
