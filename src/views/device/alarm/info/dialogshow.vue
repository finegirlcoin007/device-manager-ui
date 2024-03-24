<template>
  <!-- 弹出框表单 -->
  <el-dialog :title="title" :visible.sync="open" width="90%" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <Field
          label="告警时间"
          prop="alarmTime"
          v-model="form.alarmTime"
          type="date"
        />
        <Field
          label="告警设备"
          prop="alarmDevice"
          v-model="form.alarmDevice"
          placeholder="请输入告警设备"
        />
        <Field
          label="告警类型,"
          prop="alarmType"
          v-model="form.alarmType"
          type="select"
          :enumData="dict.alarmType"
          placeholder="请选择告警类型,"
        />
        <Field
          label="告警级别"
          prop="alarmLevel"
          v-model="form.alarmLevel"
          type="select"
          :enumData="dict.alarmLevel"
          placeholder="请选择告警级别"
        />
        <Field
          label="接收人员[设备管理的责任人]"
          prop="alarmReceivePersonnel"
          v-model="form.alarmReceivePersonnel"
          placeholder="请输入接收人员[设备管理的责任人]"
        />
        <Field
          label="接收人员电话"
          prop="receivePersonnelTelephone"
          v-model="form.receivePersonnelTelephone"
          placeholder="请输入接收人员电话"
        />
        <Field
          label="告警状态,来自工单系统"
          prop="alarmStatus"
          v-model="form.alarmStatus"
          type="select"
          :enumData="dict.alarmStatus"
          placeholder="请选择告警状态,来自工单系统"
        />
        <Field label="告警详细内容"
          ><editor v-model="form.alarmContent" :min-height="256"
        /></Field>
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
import Editor from "@/components/Editor";
export default {
  mixins: [form],
  components: {
    dialogShow,
    Editor,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "设备告警日志",
      // 是否显示弹出层
      open: false,
      toString: ["alarmType", "alarmLevel", "alarmStatus"],
      // 表单校验
      rules: {
        alarmTime: [{ required: true, message: "请选择告警时间" }],
        alarmType: [
          { required: true, message: "请输入告警类型,", trigger: "blur" },
        ],
        alarmLevel: [
          { required: true, message: "请输入告警级别", trigger: "blur" },
        ],
        alarmReceivePersonnel: [
          {
            required: true,
            message: "请输入接收人员[设备管理的责任人]",
            trigger: "blur",
          },
          { max: 32, message: "最多只能录入32个字符", trigger: "blur" },
        ],
        receivePersonnelTelephone: [
          { required: true, message: "请输入接收人员电话", trigger: "blur" },
          { max: 11, message: "最多只能录入11个字符", trigger: "blur" },
        ],
        alarmContent: [
          { required: true, message: "请输入告警详细内容", trigger: "blur" },
          { max: 512, message: "最多只能录入512个字符", trigger: "blur" },
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
      this.title = "修改设备告警日志";
    },
    /** 新增 */
    add(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.addUrl;
      this.getData();
      this.pageInfo.type = "add";
      this.title = "新增设备告警日志";
    },
    /** 查看*/
    view(row) {
      this.reset();
      this.query = { id: row.id };
      this.urls.currUrl = this.pageInfo.viewUrl;
      this.getData();
      this.pageInfo.type = "view";
      this.title = "设备告警日志详细";
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
        alarmTime: null,
        alarmDevice: null,
        alarmType: null,
        alarmLevel: null,
        alarmReceivePersonnel: "",
        receivePersonnelTelephone: "",
        alarmStatus: 0,
        alarmContent: "",
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
