<template>
<div class='page flex flex-1 page-go'>
  <div class="flex flex-1">
    <div>
      <textarea v-model='text' @change='build'></textarea>
    </div>
    <div>
      <textarea :value='table'></textarea>
    </div>
    <div>
      <textarea :value='form'></textarea>
    </div>
  </div>
</div>
</template>



<script>
import parser from './parser';
import form from './form';
import table from './table';

export default {
  methods: {
    build() {
      const data = parser(this.text);
      this.form = form(data)
      this.table = table(data)
    },
  },
  data() {
    return {
      text: '',
      form: '',
      table: '',
    }
  }
}
</script>

<style lang="less">
.page-go{
  .flex>div{
    width: 33.33%;
    height: 100%;
    overflow: auto;
  }
  textarea{
    display: block;
    height: 100%;
    width: 100%;
    border: 1px solid #ccc;
  }
}

</style>


