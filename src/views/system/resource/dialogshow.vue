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
        <Field :span="20" label="名称" prop="name" v-model="form.name" />
        <Field
          :span="20"
          label="权限类型"
          prop="authType"
          v-model="form.authType"
          :enumData="dict.authType"
          type="select"
        />
        <!-- <Field label="用户类型" prop="userType" v-model="form.userType" :enumData='dict.userType' type='select' /> -->
        <Field label="链接地址" prop="url" :span="20">
          <el-button
            icon="el-icon-plus"
            circle
            size="mini"
            @click="addResource"
            v-if="!form.urls.length"
          ></el-button>
          <el-row
            v-for="(url, index) in form.urls"
            :key="index"
            style="width: 400px"
          >
            <el-col :span="16">
              <el-form-item
                label-width="0"
                :prop="'urls.' + index + '.value'"
                :rules="[
                  { required: true, message: '地址不能为空', trigger: 'blur' },
                  { validator: validatorUrl, trigger: 'blur' },
                ]"
              >
                <el-input size="mini" v-model="url.value"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              &nbsp;
              <el-button
                icon="el-icon-minus"
                circle
                size="mini"
                @click="del(index)"
              ></el-button>
              <el-button
                icon="el-icon-plus"
                circle
                size="mini"
                @click="addResource"
                v-if="index === form.urls.length - 1"
              ></el-button>
            </el-col>
          </el-row>
        </Field>
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
import FormButtons from "@/components/tools/FormButtons";
export default {
  mixins: [form],
  components: {
    dialogShow,
    FormButtons,
  },
  methods: {
    beforeRender(data) {
      data.entity.urls = (data.entity.url || "").split(",").map((i) => {
        return { value: i };
      });
      return data;
    },
    beforeSubmit(form) {
      form.url = this.form.urls.map((item) => item.value).join(",");
      return form;
    },
    del(index) {
      this.form.urls.splice(index, 1);
    },
    addResource(index) {
      const urls = this.form.urls;
      const values = urls.map((i) => i.value);
      // 新增前检查前方是否有空行
      if (urls.some((i) => !i.value)) {
        return this.$message.warning("请先完成上一个地址的填写");
      }
      urls.push({ value: "" });
    },
    isRepeat(value) {
      return this.form.urls.filter((i) => value == i.value).length > 1;
    },
    validatorUrl(rule, value, cb) {
      if (this.isRepeat(value)) {
        return cb(new Error(`重复的url地址`));
      }
      cb();
    },
    /** 编辑 */
    edit(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.editUrl;
      this.getData();
      this.pageInfo.type = "edit";
      this.title = "修改资源";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.pageInfo.type = "add";
      this.title = "新增资源";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.pageInfo.type = "view";
      this.title = "资源详细";
    },
    /**取消按钮 */
    cancel() {
      this.open = false;
    },
    /**获取数据后弹框 */
    afterRender(data) {
      // this.form.urls = (data.entity.url || "").split(",").map((i) => {
      //   return { value: i };
      // });
      this.open = true;
    },

    afterSubmit(data) {
      this.open = false;
      this.$emit("ok");
    },
    // 表单重置
    reset() {
      this.form = {
        urls: [],
      };
      //this.resetForm("form");
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
      title: "资源",
      // 是否显示弹出层
      open: false,
      toString: ["userType", "authType"],

      form: {
        urls: [],
      },

      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        url: [
          {required: true, message: '地址不能为空', trigger: 'blur'}
        ]
      },
    };
  },
};
</script>


