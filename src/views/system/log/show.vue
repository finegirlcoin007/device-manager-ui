
<template>
    <layout-form>
        <el-form
                :model="form"
                :loading="loading"
                :rules="rules"
                size='small'
                label-width='100px'
                ref="form"
        >
            <el-row>
                <Field label="序号" prop="id" v-model="form.id"/>
                <Field label="平台标识" prop="platformMark" v-model="form.platformMark"/>
                <Field label="用户id" prop="userId" v-model="form.userId"/>
                <Field label="用户名称" prop="userName" v-model="form.userName"/>
                <Field label="用户登录名" prop="loginName" v-model="form.loginName"/>
                <Field label="请求地址" prop="requestUrl" v-model="form.requestUrl"/>
                <Field label="操作内容" prop="content" v-model="form.content" type='textarea' :span='24'/>
                <Field label="操作IP地址" prop="ip" v-model="form.ip"/>
                <Field label="操作时间" prop="logDate" v-model="form.logDate"/>
                <Field label="操作类型" prop="operType" v-model="form.operType" :enumData='dict.operType' type='select' />
            </el-row>
            <form-buttons @submit='submitForm'/>
        </el-form>
    </layout-form>
</template>

<script>
    import form from '@/assets/mixins/form';
    export default {
        mixins: [form],
        data() {
            return {
                toString: ["operType"],
                rules: {id: [{ required: true, message: '请输入序号', trigger: 'blur' },],
                    platformMark: [{ required: true, message: '请输入平台标识', trigger: 'blur' },],
                    userId: [{ required: true, message: '请输入用户id', trigger: 'blur' },],
                    content: [{ required: true, message: '请输入操作内容', trigger: 'blur' },],
                    ip: [{ required: true, message: '请输入操作IP地址', trigger: 'blur' },],
                    logDate: [{ required: true, message: '请输入操作时间', trigger: 'blur' },],
                    operType: [{ required: true, message: '请选择操作类型', trigger: 'blur' },]},
            }
        }
    }
</script>
