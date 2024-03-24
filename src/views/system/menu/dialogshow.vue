// 添加，编辑设备
<template>
  <!-- 弹出框表单 -->
  <el-dialog :title="title" :visible.sync="open" width="35%" append-to-body>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      label-position="right"
    >
      <el-row>
        <Field
          :span="22"
          label="ID"
          prop="id"
          v-model="form.id"
          v-if="pageInfo.type !== 'add'"
          disabled
        />
        <Field :span="22" label="名称" prop="name" v-model="form.name" />
        <Field
          :span="22"
          label="权限类型"
          prop="authType"
          v-model="form.authType"
          :enumData="dict.authType"
          type="select"
        />
        <Field
          :span="22"
          label="父级菜单"
          prop="parentId"
          v-model="form.parentId"
          :enumData="menu"
          type="select"
        />
        <Field :span="22" label="访问地址" prop="url" v-model="form.url" />
        <Field
          :span="22"
          label="状态"
          prop="status"
          v-model="form.status"
          :enumData="dict.status"
          type="radio"
        />

        <Field
          :span="22"
          label="图标"
          placeholder="请输入图标名称"
          prop="imgPath"
          v-model="form.imgPath"
        />
        <!-- <Field v-else :span="22" label="图标" prop="imgPath">
          <el-radio-group v-model="form.imgPath" class="form-el-radio-group">
            <el-radio-button label="">不需要图标</el-radio-button>
            <el-radio-button
              v-for="(icon, index) in icons"
              :key="index"
              :label="icon"
            >
              <i :class="'el-icon-' + icon"></i>
              {{ icon }}
            </el-radio-button>
          </el-radio-group>
        </Field> -->
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
  computed: {
    menu() {
      let menu = { 0: "无" };
      this.$store.state.userData.barList.forEach((item) => {
        menu[item.id + ""] = item.name;
      });
      return menu;
    },
  },

  methods: {
    afterSubmit() {
      this.$store.dispatch("login");
      this.$router.go(-1);
    },
    /** 编辑 */
    edit(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.editUrl;
      this.getData();
      this.pageInfo.type = "edit";
      this.title = "修改菜单";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.pageInfo.type = "add";
      this.open = true;
      this.title = "新增菜单";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.pageInfo.type = "view";
      this.open = true;
      this.title = "菜单详细";
    },
    /**取消按钮 */
    cancel() {
      this.open = false;
    },
    /**获取数据后弹框 */
    afterRender(data) {
      this.open = true;
    },

    afterSubmit(data) {
      this.open = false;
      this.$emit("ok");
    },
    // 表单重置
    reset() {
      // this.form={}
      this.resetForm("form");
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
  },

  data() {
    return {
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "菜单",
      // 是否显示弹出层
      open: false,
      toString: ["parentId", "authType", "status"],
      icons: [
        "info",
        "error",
        "success",
        "warning",
        "question",
        "tickets",
        "document",
        "goods",
        "sold-out",
        "news",
        "message",
        "date",
        "printer",
        "time",
        "bell",
        "mobile-phone",
        "service",
        "view",
        "menu",
        "star-on",
        "location",
        "phone",
        "picture",
        "delete",
        "search",
        "edit",
        "rank",
        "refresh",
        "share",
        "setting",
        "upload",
        "upload2",
        "download",
        "loading",
        "reading",
      ],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
};
</script>

<style lang="less">
.el-select {
  width: 100%;
}
.el-date-editor.el-input {
  width: 100%;
}
.form-el-radio-group.label {
  width: 160px;
}
.el-radio-button__inner {
  border: 0;
}
</style>


