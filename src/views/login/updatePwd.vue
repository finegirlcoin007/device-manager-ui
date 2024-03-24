<template>
  <layout-form>
    <!-- <Breadcrumb slot='breadcrumb' :list='breadcrumbList'></Breadcrumb> -->
    <el-form :model="extendFormData" :rules="rules" ref="form" label-width="100px" size='small'>
      <el-row><Field label="旧密码" prop="oldPwd" v-model="extendFormData.oldPwd" type='password'/></el-row>
      <el-row>
        <el-tooltip class="item" effect="dark" content="要求：长度不少于8位，可由大小写字母、数字、特殊字符组成，最近三次内密码不能重复" placement="top">
          <Field label="新密码" prop="newPwd" v-model="extendFormData.newPwd" type='password'/>
        </el-tooltip>
        </el-row>
      <el-row>
        <el-tooltip class="item" effect="dark" content="要求：长度不少于8位，可由大小写字母、数字、特殊字符组成，最近三次内密码不能重复" placement="top">
          <Field label="重复密码" prop="reNewPwd" v-model="extendFormData.reNewPwd" type='password'/>
        </el-tooltip>
        </el-row>
      <form-buttons @submit='submitForm'/>
    </el-form>
  </layout-form>
</template>

<script>
import form from '@/assets/mixins/form';
export default {
  mixins: [form],
  methods: {
    afterSubmit() {
      this.$message.success('修改密码成功，请重新登录');
      this.$store.dispatch('logout');
      this.$router.replace('/login');
    },
    // 替换原始的请求方法
    getData() {},
  },
  data() {
    return {
      extendFormData: {
        oldPwd: '',
        newPwd: '',
        reNewPwd: '',
      },
      urls: {
        saveUrl: '/login/updatePwd',
      },
      // breadcrumbList: [
      //   {name: '系统管理',},
      //   {name: '修改密码',},
      // ],
      rules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        reNewPwd: [
          { required: true, message: '请再次输入新密码!', trigger: 'blur' },
          { required: true, validator: (rule, val, cb)=>{
              if(this.extendFormData.newPwd !== val){
                return cb(new Error('重复密码与新密码不一致'))
              }
              cb();
            }, trigger: 'blur' },
        ],
      },
    }
  }
}
</script>



