<template>
    <!-- 抽屉表单 -->
    <el-drawer
        :title="title"
        :visible.sync="open"
        :direction="direction"
        size="50%"
    >
        <el-form ref="form" :model="form" :rules="rules" label-width="160px">
            <el-row>
                             <Field :span="20" label="模块名称" prop="moduleName" v-model="form.moduleName" type="textarea" placeholder="请输入模块名称"/>
                            <Field :span="20" label="模块消息编码" prop="moduleMsgCode" v-model="form.moduleMsgCode" type="textarea" placeholder="请输入模块消息编码，与上报消息头编码一致，唯一"/>

            </el-row>
            <form-buttons @submit="submitForm" noCancelBtn v-if="pageInfo.type != 'view'"/>

        </el-form>
    </el-drawer>
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
                direction: "rtl",
                // 遮罩层
                loading: true,
                // 弹出层标题
                title: "设备模块信息",
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
                    moduleMsgCode: [
                        {required: true,message: "请输入模块消息编码，与上报消息头编码一致，唯一", trigger: "blur" },
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
                this.title = "修改设备模块信息";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl = this.pageInfo.addUrl;
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增设备模块信息";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl =this.pageInfo.viewUrl;;
                this.getData();
                this.pageInfo.type="view"
                this.title = "设备模块信息详细";
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
                    moduleMsgCode : "",
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
