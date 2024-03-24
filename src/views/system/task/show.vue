<template>
  <layout-form>
    <el-form
      :model="form" 
      :loading="loading" 
      :rules="rules" 
      size='small'
      label-width='120px'
      ref="form" 
    >
      <el-row>
        <Field label="任务名称" prop="name" v-model="form.name"/>
        <Field label="关键字" prop="taskKey" v-model="form.taskKey"/>
        <Field label="执行服务" prop="excuteService" v-model="form.excuteService" :enumData='dict.excuteService' type='select' />
        
        <Field label="执行策略" prop="excuteStrategy" @change='excuteStrategyChange' v-model="form.excuteStrategy" :enumData='dict.excuteStrategy' type='select' />
        <Field :label="form.excuteStrategy == 4 ? '执行间隔时间' : '执行日期'" prop="excuteDate">

          <el-input disabled value='每天' v-if='form.excuteStrategy == 1'></el-input>

          <el-select v-model="form.excuteDate" v-if='form.excuteStrategy == 2'>
            <el-option 
              v-for='($label, $value) in dict.week' 
              :key='$value' 
              :label="$label" 
              :value="$value"
            ></el-option>
          </el-select>

          <el-select v-model="form.excuteDate" v-if='form.excuteStrategy == 3'>
            <el-option 
              v-for='($label, $value) in dict.days' 
              :key='$value' 
              :label="$label" 
              :value="$value"
            ></el-option>
          </el-select>

          <el-input v-model="form.excuteDate" v-if='form.excuteStrategy == 4'>
            <template slot="append">秒</template>
          </el-input>
        </Field>
        <Field label="执行时间" prop="excuteTime" v-if='form.excuteStrategy != 4'>
          <el-time-select
            v-model="form.excuteTime"
            :picker-options="{
              start: '00:00',
              step: '00:5',
              end: '23:45'
            }"
            placeholder="选择时间">
          </el-time-select>
        </Field>

        <Field label="执行主机" prop="excuteHost" v-model="form.excuteHost"/>
        <Field label="执行参数" prop="excuteParam" v-model="form.excuteParam" :span='24' type='textarea' textareaSize/>
        <Field label="备注" prop="remark" v-model="form.remark" :span='24' type='textarea' textareaSize/>
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
    afterRender(data) {
      
    },
    beforeRender(data) {
      data.dict = data.dict || {};
      const days = {};
      [...new Array(31)].forEach((i,index)=>{
        let key = index+1;
        days[key] = `${key}号`;
      })
      data.dict.days = days;
      data.dict.week = {
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六',
        7: '星期天',
      };
      data.dict.excuteService = data.excuteService;
      return data;
    },
    excuteStrategyChange(val) {
      this.form.excuteDate = val == 1 ? '0' : '1';
    }
  },
  data() {
    return {
      toString: ['excuteService', 'excuteStrategy', 'excuteDate'],
      rules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' },],
        taskKey: [{ required: true, message: '请输入任务关键字', trigger: 'blur' },],
        excuteService: [{ required: true, message: '请选择任务执行服务', trigger: 'blur' },],
      },
    }
  }
}
</script>

