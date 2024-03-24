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
        <Field label="角色名" prop="name" v-model="form.name" />
        <Field label="角色类型" prop="roleType" v-model="form.roleType" :enumData='dict.roleType' type='select' />
        <Field label="备注" prop="remark" v-model="form.remark" type='textarea' :span='24'/>
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
      toString: ['roleType'],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        roleType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' },
        ],
      },
    }
  }
}
</script>



