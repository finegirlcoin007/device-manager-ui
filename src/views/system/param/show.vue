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
    
        <Field label="参数名称" prop="name" v-model="form.name"/>
        <Field label="一级组织" prop="firstOrganize" v-model="form.firstOrganize"/>
        <Field label="二级组织" prop="secondOrganize" v-model="form.secondOrganize"/>
        <Field label="参数有效状态" prop="validStatus" v-model="form.validStatus" :enumData='dict.validStatus' type='select' />
        <Field label="参数修改状态" prop="modStatus" v-model="form.modStatus" :enumData='dict.modStatus' type='select' />
        <Field label="展现类型" prop="displayType" v-model="form.displayType" :enumData='dict.displayType' type='select' />
        <Field label="参数键" prop="paramKey" v-model="form.paramKey" :span='24'/>
        <Field label="参数值" prop="paramValue" v-model="form.paramValue" :span='24' type="textarea"/>
        <Field label="备注" prop="remark" v-model="form.remark" :span='24'/>
        
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
      toString: ['validStatus', 'modStatus', 'displayType'],
      rules: {
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' },],
        paramKey: [{ required: true, message: '请输入参数键', trigger: 'blur' },],
        paramValue: [{ required: true, message: '请输入参数值', trigger: 'blur' },],
      },
    }
  }
}
</script>

