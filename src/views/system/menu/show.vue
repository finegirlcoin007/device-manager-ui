<template>
  <layout-form>
    <el-form
      :model="form"
      :loading="loading"
      :rules="rules"
      size="small"
      label-width="100px"
      ref="form"
    >
      <el-row>
        <Field
          label="ID"
          prop="id"
          v-model="form.id"
          v-if="pageInfo.type !== 'add'"
          disabled
        />
        <Field label="名称" prop="name" v-model="form.name" />
        <Field
          label="权限类型"
          prop="authType"
          v-model="form.authType"
          :enumData="dict.authType"
          type="select"
        />
        <Field
          label="父级菜单"
          prop="parentId"
          v-model="form.parentId"
          :enumData="menu"
          type="select"
        />
        <Field label="访问地址" prop="url" v-model="form.url" />
        <Field
          label="状态"
          prop="status"
          v-model="form.status"
          :enumData="dict.status"
          type="radio"
        />
        <Field label="图标" prop="imgPath" :span="24">
          <el-radio-group v-model="form.imgPath" class="form-el-radio-group">
            <el-radio-button label="">不需要图标</el-radio-button>
            <el-radio-button
              v-for="(icon, index) in icons"
              :key="index"
              :label="icon"
            >
              <i :class="icon"></i>
              {{ icon }}
            </el-radio-button>
          </el-radio-group>
        </Field>
      </el-row>
      <form-buttons @submit="submitForm" />
    </el-form>
  </layout-form>
</template>

<script>
import form from "@/assets/mixins/form";

export default {
  mixins: [form],
  methods: {
    afterSubmit() {
      this.$store.dispatch("login");
      this.$router.go(-1);
    },
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
  data() {
    return {
      toString: ["parentId", "authType", "status"],
      icons: [
        "el-icon-pie-chart",
        "el-icon-data-analysis",
        "el-icon-files",
        "el-icon-shopping-cart-1",
        "el-icon-coin",
        "el-icon-guide",
        "el-icon-position",
        "el-icon-school",
        "el-icon-office-building",
        "el-icon-table-lamp",
        "el-icon-house",
        "el-icon-box",
        "el-icon-guide",
        "el-icon-odometer",
        "el-icon-wallet",
        "el-icon-printer",
        "el-icon-document-remove",
        "el-icon-tickets",
        "el-icon-document-checked",
        "el-icon-date",
        "el-icon-folder",
        "el-icon-search",
        "el-icon-brush",
        "el-icon-message",
        "el-icon-connection",
        "el-icon-sunrise",
        "el-icon-lightning",
        "el-icon-light-rain",
        "el-icon-sunset",
        "el-icon-wind-power",
        "el-icon-monitor",
      ],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
};
</script>

