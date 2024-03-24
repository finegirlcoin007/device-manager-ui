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
        <Field :span="20" label="角色名" prop="name" v-model="form.name" />
        <!-- <Field
        :span="20"
          label="角色类型"
          prop="roleType"
          v-model="form.roleType"
          :enumData="dict.roleType"
          type="select"
        /> -->
        <Field
          label="备注"
          prop="remark"
          v-model="form.remark"
          type="textarea"
          :span="20"
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
      toString: ["roleType"],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        roleType: [
          { required: true, message: "请选择用户类型", trigger: "blur" },
        ],
      },
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
      this.open = true;
      this.title = "修改角色";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.pageInfo.type = "add";
      this.open = true;
      this.title = "新增角色";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.pageInfo.type = "view";
      this.open = true;
      this.title = "角色详细";
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
       this.form = {};
      this.resetForm("form");
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
  },
};
</script>


