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
        <Field label="名称" prop="name" v-model="form.name" />
        <Field label="权限类型" prop="authType" v-model="form.authType" :enumData='dict.authType' type='select' />
        <!-- <Field label="用户类型" prop="userType" v-model="form.userType" :enumData='dict.userType' type='select' /> -->
        <Field label="链接地址" prop="url" :span='24'>
          <el-button icon="el-icon-plus" circle size='mini' @click='add' v-if='!form.urls.length'></el-button>
          <el-row v-for='(url, index) in form.urls' :key='index' style="width: 400px">
            <el-col :span='16'>
              <el-form-item label-width="0" 
                :prop="'urls.'+ index +'.value'"
                :rules="[
                  {required: true, message: '地址不能为空', trigger: 'blur'},
                  {validator: validatorUrl, trigger: 'blur'}
                ]"
              >
                <el-input size='mini' v-model="url.value"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              &nbsp;
              <el-button icon="el-icon-minus" circle size='mini' @click='del(index)'></el-button>
              <el-button icon="el-icon-plus" circle size='mini' @click='add' v-if='index === form.urls.length-1'></el-button>
            </el-col>
          </el-row>
        </Field>
      </el-row>

      <form-buttons @submit='submitForm'/>

    </el-form>
  </layout-form>
</template>

<script>
import form from '@/assets/mixins/form';
import FormButtons from '@/components/tools/FormButtons';
export default {
  mixins: [form],
  components: {
    FormButtons,
  },
  methods: {
    beforeRender(data) {
      data.entity.urls = (data.entity.url || '').split(',').map(i=>{return {value: i}});
      return data;
    },
    beforeSubmit(form){
      this.form.url = this.form.urls.map(item=>item.value).join(',');
      return this.form;
    },
    del(index){
      this.form.urls.splice(index, 1);
    },
    add(index){
      const urls = this.form.urls;
      const values = urls.map(i=>i.value);
      // 新增前检查前方是否有空行
      if(urls.some(i=>!i.value)){
        return this.$message.warning('请先完成上一个地址的填写')
      }
      urls.push({value: ''})
    },
    isRepeat(value) {
      return this.form.urls.filter(i=>value == i.value).length > 1;
    },
    validatorUrl(rule, value, cb) {
      if(this.isRepeat(value)){
        return cb(new Error(`重复的url地址`));
      }
      cb();
    },
  },
  data() {
    return {
      toString: ['userType', 'authType'],
      form: {
        urls: [],
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        url: [
          {required: true, message: '地址不能为空', trigger: 'blur'}
        ]
      },
    }
  }
}
</script>



