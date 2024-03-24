// 添加，编辑设备
<template>
  <!-- 弹出框表单 -->
  <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      label-position="right"
    >
      <el-row>
        <Field
          :span="20"
          label="登录名称"
          prop="loginName"
          v-model="form.loginName"
        />

        <Field :span="20" label="密码" prop="loginPwd">
          <el-input
            v-model.trim="form.loginPwd"
            placeholder="请输入密码"
            :type="passw"
            clearable
            @blur="onBlur"
          >
            <!-- input中加图标必须要有slot="suffix"属性，不然无法显示图标 -->
            <i slot="suffix" :class="icon" @click="showPass"></i>
          </el-input>
        </Field>
        <!-- <Field :span="20" label="登录密码" prop="loginPwd" v-model="form.loginPwd" /> -->
        <Field
          :span="20"
          label="用户名称"
          prop="realName"
          v-model="form.realName"
        />
        <Field
          :span="20"
          label="手机号码"
          prop="mobile"
          v-model="form.mobile"
        />
        <!-- <Field label="用户类型" prop="userType" v-model="form.userType" :enumData='dict.userType' type='select' />
        <Field label="用户状态" prop="status" v-model="form.status" :enumData='dict.status' type='select' /> -->
        <Field
          label="角色分配"
          :span="24"
          v-model="form.roleIds"
          type="checkbox"
          :enumData="dict.roleIds"
        />
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary" class="addclass" 
        v-if="pageInfo.type !== 'view'"
        @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import form from "@/assets/mixins/formdialog";
import dialogShow from "./dialogshow";
export default {
  mixins: [form],
  components: {
    dialogShow,
  },

  data() {
    return {
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "用户",
      // 是否显示弹出层
      open: false,
      toString: ["status", "userType"],
      toArrays: ["roleIds"],
      // 表单校验
      rules: {
        loginName: [
          { required: true, message: "请输入英文的用户名", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              //  校验英文的正则
              if (/[A-Za-z0-9]$/.test(value) == false) {
                callback(new Error("请输入英文"));
              } else {
                //校验通过
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      icon: "el-input__icon el-icon-view",
      passw: "password",
      SPAN: "24",
    };
  },
  methods: {
    /** 编辑 */
    edit(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.editUrl;
      this.getData();
      this.pageInfo.type = "edit";
      this.title = "修改用户";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.pageInfo.type = "add";
      this.title = "新增用户";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.pageInfo.type = "view";
      this.title = "用户详细";
    },
    /**取消按钮 */
    cancel() {
      this.open = false;
    },
    /**获取数据后弹框 */
    afterRender(data) {
      this.open = true;
    },

    beforeSubmit(data) {
      data.roleIds = data.roleIds
        .filter((item) => {
          return item !== "";
        })
        .join(",");
      return data;
    },
    afterSubmit(data) {
      this.open = false;
      this.$emit("ok");
    },
    // 表单重置
    reset() {
      this.form = {roleIds:""};
      this.resetForm("form");
    },

    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
    showPass() {
      //点击图标是密码隐藏或显示
      if (this.passw == "text") {
        this.passw = "password";
        //更换图标
        this.icon = "el-input__icon el-icon-view";
      } else {
        this.passw = "text";
        this.icon = "el-input__icon el-icon-loading";
        setTimeout(() => {
          this.icon = "";
        }, 100);
      }
    },
    //密码失焦事件
    onBlur() {
      this.passw = "password";
      this.icon = "el-input__icon el-icon-view";
    },
  },
};
</script>


