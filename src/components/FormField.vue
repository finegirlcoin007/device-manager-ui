// 表单节点封装，支持 input textarea select radio checkbox 及slot方式
<template>
  <el-col :span='span'>

    <el-form-item :label="label" :prop="prop" class='my-form-field'>
      <slot>
        <el-input :disabled='disabled' :placeholder='placeholder' v-model="field" @change="emit" @input="emit" v-if='type === "text"' :class="inputClass" :clearable='clearable'></el-input>
        <el-input :disabled='disabled' :placeholder='placeholder' v-model="field" @change="emit" @input="emit" type='password' v-if='type === "password"'></el-input>

        <el-input-number  :disabled='disabled'  v-model="field" size="small" :placeholder='placeholder' @change="emit" @input="emit"  v-if='type === "num"'></el-input-number>


        <el-input :disabled='disabled' :placeholder='placeholder' v-model="field" @change="emit" :rows='rows' @input="emit" v-if='type === "textarea"' type='textarea' :autosize="textareaSize" :class="inputClass"></el-input>

        <el-select :disabled='disabled' v-model="field" @change="emit" :multiple='multiple' :filterable='filterable' :clearable='clearable' v-if='type === "select"'>
          <el-option
            v-for="($label, $value) in enumData"
            :key="$value"
            :label="$label"
            :value="$value"
          ></el-option>
        </el-select>

        <el-radio-group :disabled='disabled' v-model="field" @change="emit" v-if='type === "radio"'>
          <el-radio
            v-for='($label, $value) in enumData'
            :key='$value'
            :label="$value"
          >{{$label}}</el-radio>
        </el-radio-group>

        <el-checkbox-group :disabled='disabled' v-model="field" @change="emit" v-if='type === "checkbox"'>
          <el-checkbox
            v-for='($label, $value) in enumData'
            :key='$value'
            :label="$value"
          >{{$label}}</el-checkbox>
        </el-checkbox-group>

        <el-date-picker :disabled='disabled' type="date" value-format="yyyy-MM-dd HH:mm:ss" v-model="field" @change="emit" @input="emit" placeholder="选择日期" v-if='type === "date"'></el-date-picker>
        <el-date-picker :disabled='disabled' type="datetime" value-format="yyyy-MM-dd HH:mm:ss" v-model="field" @change="emit" @input="emit" placeholder="选择日期" v-if='type === "datetime"'></el-date-picker>

      </slot>
    </el-form-item>
  </el-col>
</template>

<script>
export default {
  props: {
     // 字段值
    value: {
      type: [String, Number, Array],
    },
    // 组件的el-col span宽度 1-24,默认12
    span: {                         
      type: Number,
      default: 12,
    },
    // 字段类型: text,password,textarea,select,radio,checkbox,date,datetime
    type: {                          
      type: String,
      default: 'text',
    },
    // 字段name
    prop: {
      type: String,
      default: '',
    },
    // 字段中文标题
    label: {
      type: String,
      default: '',
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否提示
    placeholder: {
      type: String,
      default: '',
    },

    // 字段所需的枚举类型
    enumData: {
      type: Object,
      default: ()=>{},
    },
    // textarea专用-自适应内容高度
    textareaSize: {
      type: Object,
      default: ()=>{},
    },
    // select专用-是否可搜索
    filterable: {
      type: Boolean,
      default: false,
    },
    // select专用-是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // select专用-是否可取消
    clearable: {
      type: Boolean,
      default: false,
    },
    // 字段所需的枚举类型
    options: {
      type: Array,
      default: ()=>[],
    },
    children: {
      type: Array,
      default: ()=>[],
    },
    inputClass: {
      type: String,
      default: '',
    }
  },
  methods: {
    emit() {
      this.$emit('input', this.newVal)
      this.$emit('change', this.newVal)
    }
  },
  computed: {
    field: {
      get() {
        return this.value
      },
      set(val) {
        this.newVal = val;
      }
    }
  },
  data() {
    return {
      newVal: this.value,
    }
  }
}
</script>

