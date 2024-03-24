<template>
  <div class='page layout-form'>
    <slot name='breadcrumb'>
      <Breadcrumb />
    </slot>
    <slot></slot>
  </div>
</template>

<style lang="less">
@media screen and (max-width: 800px){
  .layout-form{
    form{
      width: 100%!important;
    }
    .el-col-12{
      width: 100%;
    }
  }
}
.layout-form{
  .el-breadcrumb{
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid #ededed;
  }
  form{
    width: 800px;
    &[loading]{
      pointer-events: none;
      .el-button{
        background: #eee;
        color: transparent;
        border-color: #eee;
      }
      input, 
      textarea{
        background: #eee;
        color: transparent;
        border-color: #eee;
      }
      span, input, button, li, label{
        color: #eee;
      }
    }
    .el-input-group--append{
      .el-select .el-input {
        width: 80px;
      }
    }
    // 自定义的field组件
    .my-form-field{
      .el-select{
        width: 100%;
      }
      .el-date-editor.el-input{
        width: 100%;
      }
      .form-el-radio-group{
        label{
          width: 160px;
        }
        .el-radio-button__inner{
          border: 0;
        }
      }
    }

  }
}
</style>
