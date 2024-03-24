<template>
  <!-- 弹出框表单 -->
  <el-dialog :title="title" :visible.sync="open" width="90%" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <Field
          label="站点Id，来源基础服务平台"
          prop="siteId"
          v-model="form.siteId"
          placeholder="请输入站点Id，来源基础服务平台"
        />
        <Field
          label="站点编号，来源基础服务平台"
          prop="siteCode"
          v-model="form.siteCode"
          type="textarea"
          placeholder="请输入站点编号，来源基础服务平台"
        />
        <Field
          label="站点名称"
          prop="siteName"
          v-model="form.siteName"
          type="textarea"
          placeholder="请输入站点名称"
        />
        <Field
          label="设备总数"
          prop="deviceTotal"
          v-model="form.deviceTotal"
          placeholder="请输入设备总数"
        />
        <Field
          label="在线数量"
          prop="onlineCount"
          v-model="form.onlineCount"
          placeholder="请输入在线数量"
        />
        <Field
          label="离线数量"
          prop="offlineCount"
          v-model="form.offlineCount"
          placeholder="请输入离线数量"
        />
        <Field
          label="停用数量"
          prop="stopCount"
          v-model="form.stopCount"
          placeholder="请输入停用数量"
        />
        <Field
          label="待激活数量"
          prop="unActiveCount"
          v-model="form.unActiveCount"
          placeholder="请输入待激活数量"
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
      title: "站点统计",
      // 是否显示弹出层
      open: false,
      toString: [],
      // 表单校验
      rules: {
        unActiveCount: [
          { required: true, message: "请输入待激活数量", trigger: "blur" },
        ],
        createTime: [{ required: true, message: "请选择创建时间" }],
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
      this.title = "修改站点统计";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.pageInfo.type = "add";
      this.title = "新增站点统计";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.pageInfo.type = "view";
      this.title = "站点统计详细";
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
      this.form = {
        siteId: null,
        siteCode: "",
        siteName: "",
        deviceTotal: null,
        onlineCount: null,
        offlineCount: null,
        stopCount: null,
        unActiveCount: null,
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
