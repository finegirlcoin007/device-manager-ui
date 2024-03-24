<template>
  <div class="page">
    <LayoutTable :data="tableData" :config="tableConfig" />
    <dialog-show ref="dialogform" @ok="getData" />

    <el-dialog title="用户已分配的角色" :visible.sync="role.visible">
      <el-form :model="role.form">
        <el-checkbox-group v-model="role.checkList" :min="500">
          <el-checkbox
            v-for="item in allRoles"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="role.visible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="userRoleDialog.title"
      :visible.sync="userRoleDialog.open"
      width="60%"
      append-to-body
    >
      <el-form label-width="100px">
        <Field
          label="角色分配"
          :span="24"
          v-model="roles"
          type="checkbox"
          :enumData="tableData.dict.roleIds"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="addclass"  @click="userRoleConfirm">确 定</el-button>
        <el-button @click="userRoleDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialogShow from "./dialogshow";
import table from "@/assets/mixins/table";

export default {
  mixins: [table],
  components: { dialogShow },
  methods: {
    // 打开弹窗
    async findRole({ id }) {
      try {
        this.tableData.loading = true;
        this.allRoles = await this.getUserRoles(id);
        this.role.checkList = await this.getRoleUsers(id);
        this.role.visible = true;
      } catch (error) {
        this.$message.error(error.message);
      }

      this.tableData.loading = false;
    },

    // 获取角色列表与当前用户角色列表
    userRoleConfirm(row) {
      let data = this.userRoleDialog.data;

      this.$post("/user/save", {
        "id": data.id,
        "mobile": data.mobile,
        "lastLoginAddress":"127.0.0.1",
        "roleIds": this.roles.join(","),
      }).then((res) => {
        if (res && res.code == 1) {
          this.userRoleDialog.data = {};
          this.$message.success("分配角色成功！");
          this.getData();
        }

        this.userRoleDialog.open = false;
      });
    },

    async distributeRole(row) {
      try {
        this.tableData.loading = true;
        this.roles = await this.getRoleUsers(row.id);

        this.userRoleDialog.data = row;
        this.userRoleDialog.open = true;
      } catch (error) {
        this.$message.error(error.message);
      }

      this.tableData.loading = false;
    },

    // 获取用户角色列表
    getUserRoles(id) {
      return new Promise((resolve, reject) => {
        this.$post("/role/roleNameByUserId", { userId: id })
          .then(({ data }) => {
            resolve(data);
          })
          .catch(reject);
      });
    },
    getRoleUsers(id) {
      return new Promise((resolve, reject) => {
        this.$post("/role/user/list", {
          userId: id,
          size: -1,
        })
          .then(({ data }) => {
            const result = data.data
              .filter((i) => i.roleId + "")
              .map((i) => i.roleId + "");
            resolve(result);
          })
          .catch(reject);
      });
    },
    /** 重写新增方法 */
    toAdd(row) {
      this.$refs.dialogform.add(row);
    },
    /** 重写编辑方法 */
    toEdit(row) {
      this.$refs.dialogform.edit(row);
    },
    /** 重写查看方法 */
    toView(row) {
      this.$refs.dialogform.view(row);
    },
  },
  data() {
    return {
      allRoles: {},
      roles: [],
      userRoleDialog: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "选择角色",
        data: {},
      },
      role: {
        checkList: [],
        visible: false,
      },
      config: {
        columns: [
          { type: "selection", reserveSelection: true, width: 60 },
          { type: "index", label: "序号", align: "center", width: 50 },
          {
            prop: "loginName",
            label: "登录名称",
            align: "center",
          },
          {
            prop: "realName",
            label: "用户名称",
            align: "center",
          },
          {
            prop: "mobile",
            label: "手机号码",
            align: "center",
          },
          {
            prop: "roleIds",
            label: "所属角色",
            formatter: this.formatters,
            align: "center",
          },

          // {
          //   prop: "userType",
          //   label: "用户类型",
          //   width: 130,
          //   formatter: this.formatter,
          // },
          {
            prop: "status",
            label: "状态",
            width: 80,
            align: "center",
            formatter: this.formatter,
          },
          {
            label: "操作",
            width: 280,
            align: "center",
            formatter: (row) => {
              return (
                <div>
                  <table-buttons
                    noView
                    row={row}
                    onEdit={this.toEdit}
                    onDel={this.toDel}
                  />
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-share"
                    onClick={() => this.distributeRole(row)}
                  >
                    分配角色
                  </el-button>
                </div>
              );
            },
          },
        ],
        search: [
          {
            name: "loginName",
            type: "text",
            label: "登录名",
          },
          {
            name: "realName",
            type: "text",
            label: "用户名称",
          },
          {
            name: "mobile",
            type: "text",
            label: "手机号",
          },
        ],
      },
    };
  },
};
</script>


