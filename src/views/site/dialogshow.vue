<template>
    <!-- 弹出框表单 -->
    <el-dialog :title="title" :visible.sync="open" width="90%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                                            <Field label="站点名称" prop="siteName" v-model="form.siteName"  placeholder="请输入站点名称"/>
                            <!-- <Field label="站点编号" prop="siteCode" v-model="form.siteCode" placeholder="请输入站点编号"/> -->
                            <Field label="区域编号" disabled prop="areaCode" v-model="form.areaCode" />
                            <Field label="区域名称" disabled prop="areaName" v-model="form.areaName" />
                            <Field label="省编码" prop="proCode" v-model="form.proCode" placeholder="请输入省编码"/>
                            <Field label="市编码" prop="cityCode" v-model="form.cityCode" placeholder="请输入市编码"/>
                            <Field label="区编码" prop="districtCode" v-model="form.districtCode" placeholder="请输入区编码"/>
                            <Field label="站点服务器ip" prop="siteIp" v-model="form.siteIp" placeholder="请输入站点服务器ip"/>
                            <Field label="站点服务器端口" prop="sitePort" v-model="form.sitePort" placeholder="请输入站点服务器端口"/>
                            <Field label="经度" prop="longitude" v-model="form.longitude" placeholder="请输入经度"/>
                            <Field label="纬度" prop="latitude" v-model="form.latitude" placeholder="请输入纬度"/>
                            <Field label="中心联系电话" prop="siteTel" v-model="form.siteTel" placeholder="请输入中心联系电话"/>
                            <Field label="中心详细地址" prop="detailAddress" v-model="form.detailAddress" type="textarea" placeholder="请输入中心详细地址"/>
                            <Field label="中心介绍" prop="siteRemark" v-model="form.siteRemark" type="textarea" placeholder="请输入中心介绍"/>
                            <Field label="上午上班开始时间" prop="amWorkStartTime" v-model="form.amWorkStartTime" type="date" />
                            <Field label="上午上班结束时间" prop="amWorkEndTime" v-model="form.amWorkEndTime" type="date" />
                            <Field label="下午上班开始时间" prop="pmWorkStartTime" mo-model="form.pmWorkStartTime" type="date" />
                            <Field label="下午上班结束时间" prop="pmWorkEndTime" v-model="form.pmWorkEndTime" type="date" />
                            <Field label="周一 " prop="workday1" v-model="form.workday1" type="select" :enumData="dict.workday1" placeholder="请选择周一 "/>
                            <Field label="周二 " prop="workday2" v-model="form.workday2" type="select" :enumData="dict.workday2" placeholder="请选择周二 "/>
                            <Field label="周三 " prop="workday3" v-model="form.workday3" type="select" :enumData="dict.workday3" placeholder="请选择周三 "/>
                            <Field label="周四 " prop="workday4" v-model="form.workday4" type="select" :enumData="dict.workday4" placeholder="请选择周四 "/>
                            <Field label="周五 " prop="workday5" v-model="form.workday5" type="select" :enumData="dict.workday5" placeholder="请选择周五 "/>
                            <Field label="周六 " prop="workday6" v-model="form.workday6" type="select" :enumData="dict.workday6" placeholder="请选择周六 "/>
                            <Field label="周日 " prop="workday7" v-model="form.workday7" type="select" :enumData="dict.workday7" placeholder="请选择周日 "/>
                            <Field label="楼层" prop="level" v-model="form.level" placeholder="请输入楼层"/>
                            <Field label="楼栋" prop="building" v-model="form.building" placeholder="请输入楼栋"/>

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
                title: "站点",
                // 是否显示弹出层
                open: false,
                toString:[
                    "workday1",
                    "workday2",
                    "workday3",
                    "workday4",
                    "workday5",
                    "workday6",
                    "workday7",
                ],
                // 表单校验
                rules: {
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
                this.title = "修改站点";
            },
            /** 新增 */
            add(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl = this.pageInfo.addUrl;
                this.form.areaCode=row.areaCode
                this.form.areaName=row.areaName
                this.getData();
                this.pageInfo.type="add"
                this.title = "新增站点";
            },
            /** 查看*/
            view(row) {
                this.reset()
                this.query = { id: row.id };
                this.urls.currUrl =this.pageInfo.viewUrl;;
                this.getData();
                this.pageInfo.type="view"
                this.title = "站点详细";
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
                    siteName : null,
                    siteCode : null,
                    areaID : null,
                    areaCode : null,
                    areaName : null,
                    proCode : null,
                    cityCode : null,
                    districtCode : null,
                    siteIp : null,
                    sitePort : null,
                    longitude : null,
                    latitude : null,
                    siteTel : null,
                    detailAddress : null,
                    siteRemark : null,
                    amWorkStartTime : null,
                    amWorkEndTime : null,
                    pmWorkStartTime : null,
                    pmWorkEndTime : null,
                    workday1 : 1,
                    workday2 : 1,
                    workday3 : 1,
                    workday4 : 1,
                    workday5 : 1,
                    workday6 : 0,
                    workday7 : 0,
                    level : 1,
                    building : 1,
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
