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
        <Field label="名称" prop="name" v-model="form.name"/>
        <Field label="权限类型" prop="authType" v-model="form.authType" :enumData='dict.authType' type='select' />
        <Field label="状态" prop="status" v-model="form.status" :enumData='dict.status' type='select' />
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
      toString: ['status'],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
      },
    }
  }
}
</script>

