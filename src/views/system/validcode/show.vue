// 用户管理
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
        <Field label="登录名称" prop="loginName" v-model="form.loginName"/>
        <Field label="登录密码" prop="loginPwd" v-model="form.loginPwd" v-if='pageInfo.type === "add"' />
        <Field label="用户昵称" prop="realName" v-model="form.realName" />
        <Field label="手机号码" prop="mobile" v-model="form.mobile" />
        <Field label="用户类型" prop="userType" v-model="form.userType" :enumData='dict.userType' type='select' />
        <Field label="用户状态" prop="status" v-model="form.status" :enumData='dict.status' type='select' />
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
      toString: ['status', 'userType'],
      rules: {
        loginName: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
        ],
        loginPwd: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
        ],
        realName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { required: true, validator: (rule, val, cb)=>{
              if(!/^1[0-9]{10}$/.test(val)){
                return cb(new Error('手机号码格式不正确'))
              }
              cb();
            }, trigger: 'blur' },
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请选择用户状态', trigger: 'blur' },
        ],
      },
    }
  }
}
</script>



