<template>
  <div class="page">
    <LayoutTable :data="tableData" :config="tableConfig" />
    <dialog-show ref="dialogform" @ok="getData" />
    <el-dialog title="分配权限" :visible.sync="auth.visible">
      <el-form :model="auth.form">
        <el-checkbox-group v-model="auth.checkList">
          <div v-for="(group, key) in allResources" :key="key">
            <h2 style="font-size: 14px; font-weight: bold; margin: 10px 0">
              {{ key }}
              <el-checkbox
                :key="key"
                @change="
                  (e) => {
                    handleChange(e, key);
                  }
                "
                :label="key"
                >全选</el-checkbox
              >
            </h2>
            <el-checkbox
              v-for="item in group.list"
              :key="item.id"
              :label="item.id"
            >
              {{ item.name }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="auth.visible = false">取 消</el-button>
        <el-button size="mini" type="primary" class="addclass"  @click="saveAuth"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <div class="userSaveDiv">
      <el-dialog title="分配用户" :visible.sync="user.visible" width="75%">
        <el-form :model="user.form" size="mini" label-width="80px">
          <el-row>
            <el-col :span="8">
              <span>用户类型：</span>
              <el-select
                placeholder="请选择用户类型"
                v-model="userTypeIdVal"
                size="mini"
                clearable
              >
                <el-option
                  v-for="($label, $value) in userTypeMap"
                  :key="$value"
                  :label="$label"
                  :value="$value"
                >
                </el-option>
              </el-select>
            </el-col>
            <Field
              label="登录账号"
              prop="loginNameVal"
              v-model="loginNameVal"
              placeholder="请输入登录账号"
              :span="8"
            />
            <Field
              label="昵称"
              prop="realNameVal"
              v-model="realNameVal"
              placeholder="请输入昵称"
              :span="8"
            />
            <el-col style="text-align: center">
              <el-button
                type="primary" class="addclass" 
                size="mini"
                icon="el-icon-search"
                @click="searchUserList"
                >查询未分配用户</el-button
              >
              <el-button icon="search" size="mini" plain @click="cleanSearchCon"
                >清空</el-button
              >
            </el-col>
          </el-row>
          <fieldset class="check-user-fieldset">
            <legend>已分配用户</legend>
            <div
              style="
                margin-left: 15px;
                margin-bottem: 10px;
                height: 90%;
                overflow: auto;
              "
            >
              <el-checkbox-group
                v-model="user.checkList"
                style="margin-left: 15px; margin-bottem: 10px"
              >
                <el-checkbox
                  v-for="item in checkedUsers"
                  @change="
                    (e) => {
                      handleUnCheckChangeUser(e, item);
                    }
                  "
                  :key="item.id"
                  :label="item.id"
                  :name="item.realName"
                  >{{ item.realName }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </fieldset>
          <fieldset class="check-user-fieldset">
            <legend>未分配用户</legend>
            <div
              style="
                margin-left: 15px;
                margin-bottem: 10px;
                height: 90%;
                overflow: auto;
              "
            >
              <el-checkbox-group
                v-model="user.checkList"
                style="margin-left: 15px; margin-bottem: 10px"
              >
                <el-checkbox
                  v-for="item in unCheckedUsers"
                  @change="
                    (e) => {
                      handleCheckChangeUser(e, item);
                    }
                  "
                  :key="item.id"
                  :label="item.id"
                  >{{ item.realName }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </fieldset>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="user.visible = false">取 消</el-button>
          <el-button size="mini" type="primary" class="addclass"  @click="saveUser"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import table from "@/assets/mixins/table";
import dialogShow from "./dialogshow";
export default {
  mixins: [table],
  components: { dialogShow },
  created() {},
  methods: {
    beforeRender(data) {
      this.customerMap = data.dict.customerId;
      this.userTypeMap = data.dict.userType;
      return data;
    },
    // 打开弹窗，获取已经选中的权限
    async setAuth({ id }) {
      this.tableData.loading = true;
      try {
        this.auth.form = this.initForm();
        this.allResources = await this.getAuths();
        this.auth.checkList = await this.getRoleAuths(id);
        this.auth.form.roleId = id;
        this.auth.visible = true;
      } catch (error) {
        this.$message.error(error.message);
      }
      this.tableData.loading = false;
    },
    // 获取权限列表
    getAuths() {
      if (Object.keys(this.allResources).length) {
        return this.allResources;
      }
      return new Promise((resolve, reject) => {
        this.$post("/resource/list", { size: -1 })
          .then(({ data }) => {
            resolve(this.groupByAuth(data.data));
          })
          .catch(reject);
      });
    },
    // 权限分组
    groupByAuth(list) {
      let group = {};
      list.forEach((item) => {
        let name = item.name.split("-")[0];
        if (!group[name]) {
          group[name] = {
            selectAll: false,
            list: [],
          };
        }
        group[name].list.push(item);
      });
      return group;
    },
    // 选中权限组
    handleChange(checked, type) {
      const list = this.auth.checkList.slice();
      const selectd = this.allResources[type].list.map((i) => i.id);
      if (checked) {
        this.auth.checkList = [...new Set(list.concat(selectd))];
      } else {
        this.auth.checkList = this.auth.checkList.filter(
          (i) => selectd.indexOf(i) === -1
        );
      }
    },
    // 获取角色权限列表
    getRoleAuths(id) {
      return new Promise((resolve, reject) => {
        this.$post("/role/auth/list", {
          roleId: id,
          size: -1,
        })
          .then(({ data }) => {
            const result = data.data.map((i) => i.resourceId);
            resolve(result);
          })
          .catch(reject);
      });
    },
    // 保存选中的权限
    async saveAuth() {
      try {
        this.auth.form.resourceIdList = this.auth.checkList
          .filter((i) => typeof i === "number");
          //.join(",");
        await this.$post("/role/auth/distributionSource", this.auth.form,
        );
        this.auth.visible = false;
        this.auth.form = this.initForm();
        this.$message.success("操作成功");
      } catch (error) {
        this.$message.error(error.message);
      }
    },

    // 获取用户列表
    getUsers() {
      // if(this.allUsers.length) {
      //   return this.allUsers;
      // }
      return new Promise((resolve, reject) => {
        this.$post("/user/list", { size: -1 })
          .then(({ data }) => {
            resolve(data.data);
          })
          .catch(reject);
      });
    },

    async searchUserList() {
      this.allUsers = await this.getUsersoo(
        this.userTypeIdVal,
        this.loginNameVal,
        this.realNameVal
      );
      this.unCheckedUsers = [];
      if (this.allUsers && this.allUsers.length > 0) {
        this.allUsers.forEach((item, i) => {
          if (!this.user.checkList.includes(item.id)) {
            this.unCheckedUsers.push(item);
          }
        });
      }
    },

    async getUsersoo(userTypeIdVal, loginNameVal, realNameVal) {
      const query = {
        size: -1,
        userType: userTypeIdVal,
        loginName: loginNameVal,
        realName: realNameVal,
      };
      return new Promise((resolve, reject) => {
        this.$post("/user/list", query)
          .then(({ data }) => {
            resolve(data.data);
          })
          .catch(reject);
      });
    },

    cleanSearchCon() {
      this.loginNameVal = "";
      this.userTypeIdVal = "";
      this.realNameVal = "";
    },

    handleCheckChangeUser(checked, item) {
      var checkUserId = item.id;
      if (checked) {
        var tempItem = {};
        tempItem.id = checkUserId;
        tempItem.realName = item.realName;
        this.user.checkList.push(checkUserId);
        this.checkedUsers.push(tempItem);
        this.unCheckedUsers = this.unCheckedUsers.filter(
          (i) => i.id != checkUserId
        );
        this.user.checkList = [...new Set(this.user.checkList)];
      }
    },

    handleUnCheckChangeUser(checked, item) {
      var checkUserId = item.id;
      if (!checked) {
        var tempItem = {};
        tempItem.id = checkUserId;
        tempItem.realName = item.realName;
        this.unCheckedUsers.push(tempItem);
        this.user.checkList = this.user.checkList.filter(
          (i) => i.id != checkUserId
        );
        this.checkedUsers = this.checkedUsers.filter(
          (i) => i.id != checkUserId
        );
      }
    },

    // 获取角色用户列表
    getRoleUsers(id) {
      return new Promise((resolve, reject) => {
        this.$post("/role/user/list", {
          roleId: id,
          size: -1,
        })
          .then(({ data }) => {
            const result = data.data
              .filter((i) => i.userId)
              .map((i) => i.userId);
            this.resultUserDict = data.dict.userReNameMap;
            if (data.data && data.data.length > 0) {
              data.data.forEach((i) => {
                var tempItem = {};
                tempItem.id = i.userId;
                tempItem.realName = this.resultUserDict[i.userId] || i.userId;
                this.checkedUsers.push(tempItem);
              });
            }
            resolve(result);
          })
          .catch(reject);
      });
    },

    // 打开弹窗
    async setUser({ id }) {
      try {
        this.cleanSearchCon();
        this.tableData.loading = true;
        this.user.form = this.initUserForm();
        //        this.allUsers = await this.getUsers();
        this.checkedUsers = [];
        this.user.checkList = await this.getRoleUsers(id);
        this.user.form.roleId = id;
        this.user.visible = true;
        this.unCheckedUsers = [];
      } catch (error) {
        this.$message.error(error.message);
      }

      this.tableData.loading = false;
    },
    // 保存选中的用户
    async saveUser() {
      try {
        //this.user.form.userIdList = this.user.checkList.join(",");
        this.user.form.userIdList = this.user.checkList;
        await this.$post("/role/user/distributionUser", this.user.form);
        this.user.visible = false;
        this.user.form = this.initForm();
        this.$message.success("操作成功");
      } catch (error) {
        this.$message.error(error.message);
      }
    },

    initForm() {
      return {
        resourceIdList: "",
        roleId: "",
      };
    },
    initUserForm() {
      return {
        userIdList: "",
        roleId: "",
      };
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
      customerMap: [],
      userTypeMap: [],
      allResources: {},
      allUsers: {},
      checkedUsers: [],
      unCheckedUsers: [],
      resultUserDict: [],
      realNameVal: "",
      loginNameVal: "",
      userTypeIdVal: "",
      user: {
        visible: false,
        checkList: [],
        form: this.initUserForm(),
      },
      auth: {
        visible: false,
        checkList: [],
        form: this.initForm(),
      },
      config: {
        search: [
          {
            name: "name",
            type: "text",
            label: "角色名",
          },
        ],
        columns: [
          {
            type: "selection",
            align: "center",
            reserveSelection: true,
            width: 60,
          },
          { type: "index", label: "序号", align: "center", width: 50 },

          {
            prop: "name",
            align: "center",
            label: "角色名",
          },
          {
            prop: "remark",
            align: "center",
            label: "备注",
          },
          // {
          //   prop: "roleType",
          //   label: "角色类型",
          //   width: 130,
          //   formatter: this.formatter,
          // },
          {
            prop: "createTime",
            align: "center",
            label: "创建时间",
            formatter: this.formatterDate,
          },

          {
            label: "操作",
            align: "center",
            witdh: 120,
            formatter: (row) => {
              return (
                <div>
                  <table-buttons
                    noView
                    row={row}
                    onEdit={this.toEdit}
                    onDel={this.toDel}
                  />{" "}
                  <el-button
                    icon="el-icon-share"
                    size="mini"
                    type="text"
                    onClick={() => this.setAuth(row)}
                  >
                    分配权限
                  </el-button>
                  {/*
                    <el-button
                      icon="el-icon-goods"
                      size="mini"
                      type="text"
                      onClick={() => this.setUser(row)}
                    >
                      分配用户
                    </el-button>
                    */}
                </div>
              );
            },
          },
        ],
      },
    };
  },
};
</script>

<style>
.userSaveDiv .el-dialog {
  margin: 0 auto !important;
  height: 100%;
  overflow: hidden;
  margin-bottom: 400px;
}
.userSaveDiv .el-dialog__body {
  position: absolute;
  left: 50px;
  top: 54px;
  bottom: 50px;
  right: 0;
  padding: 0;
  z-index: 1;
  overflow: hidden;
  overflow-y: auto;
}
.userSaveDiv .el-dialog__footer {
  position: absolute;
  bottom: 0;
  right: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.userSaveDiv .check-user-fieldset {
  height: 480px;
  border: 1px solid #ededed;
  float: left;
  margin-left: 1%;
  width: 48%;
  margin-top: 20px;
}
</style>


