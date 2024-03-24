<template>
  <!-- 弹出框表单 -->
  <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
    <el-form
      :model="form"
      :rules="rules"
      size="small"
      label-width="100px"
      ref="form"
    >
      <el-row>
        <Field label="参数名称" prop="name" v-model="form.name" />
        <Field
          label="一级组织"
          prop="firstOrganize"
          v-model="form.firstOrganize"
        />
        <Field
          label="二级组织"
          prop="secondOrganize"
          v-model="form.secondOrganize"
        />
        <Field
          label="参数有效状态"
          prop="validStatus"
          v-model="form.validStatus"
          :enumData="dict.validStatus"
          type="select"
        />
        <Field
          label="参数修改状态"
          prop="modStatus"
          v-model="form.modStatus"
          :enumData="dict.modStatus"
          type="select"
        />
        <Field
          label="展现类型"
          prop="displayType"
          v-model="form.displayType"
          :enumData="dict.displayType"
          type="select"
        />
        <Field
          label="参数键"
          prop="paramKey"
          v-model="form.paramKey"
          :span="24"
        />
        <Field
          label="参数值"
          prop="paramValue"
          v-model="form.paramValue"
          :span="24"
          type="textarea"
        />
        <Field label="备注" prop="remark" v-model="form.remark" :span="24" />
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="addclass"  @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import form from "@/assets/mixins/formdialog";
export default {
  mixins: [form],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "站点信息",
      // 是否显示弹出层
      open: false,
      toString: ["validStatus", "modStatus", "displayType"],
      rules: {
        name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
        paramKey: [{ required: true, message: "请输入参数键", trigger: "blur" }],
        paramValue: [{ required: true, message: "请输入参数值", trigger: "blur" }],
      },
     // urls:{list: "/para/file/list"}
    };
  },

  methods: {
    /** 编辑 */
    edit(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.editUrl;
      this.getData();
      this.open = true;
      this.title = "修改站点信息";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.open = true;
      this.title = "新增站点信息";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.open = true;
      this.title = "站点信息详细";
    },
    /**取消按钮 */
    cancel() {
      this.reset();
      this.open = false;
    },

    afterSubmit(data) {
      this.open = false;
      this.$emit("ok");
    },

    // 表单重置
    reset() {
      this.form = {

      };
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
