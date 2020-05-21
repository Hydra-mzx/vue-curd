<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <div style="margin: 5px 0;">
      <el-input placeholder="请输入内容" v-model="searchData" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click.stop="searchGet"></el-button>
      </el-input>
      <el-button plain @click.stop="addUserShow = true">添加用户</el-button>
    </div>

    <div>
      <!-- 表格 -->
      <!-- @current-change="handleCurrentChange" -->
      <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="username" label="姓名" width="150"></el-table-column>
        <el-table-column property="email" label="邮箱" width="200"></el-table-column>
        <el-table-column property="mobile" label="电话" width="200"></el-table-column>
        <el-table-column property label="状态" width="100">
          <!-- 需要包含在一个template中，使用另一个组件 -->
          <!-- 开关 需绑定数据库获取的值 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="mgStateChange(scope)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click.stop="editUserisShow(scope)"
              plain
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click.stop="deleteUser(scope.row.id)"
              plain
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              @click="rolesShow(scope)"
              plain
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :total="total"
        :current-page="currentpage"
        :page-sizes="[1, 2, 3, 5, 10]"
        :page-size="sizepage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></el-pagination>

      <!-- 添加用户弹框 -->
      <el-dialog title="添加用户" :visible.sync="addUserShow">
        <el-form :model="userAddData" :rules="rules" ref="userAddData">
          <el-form-item label="用户名" label-width="200px" prop="username">
            <el-input v-model="userAddData.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="200px" prop="password">
            <el-input v-model="userAddData.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="200px">
            <el-input v-model="userAddData.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="200px">
            <el-input v-model="userAddData.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserShow = false">取 消</el-button>
          <el-button type="primary" @click="addUserPost">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改用户弹框 .sync -->
      <el-dialog title="修改用户" :visible="editUserShow">
        <el-form :model="userEditData" :rules="rules" ref="userEditData">
          <el-form-item label="用户名" label-width="200px" prop="username">
            <el-input v-model="userEditData.username" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="200px">
            <el-input v-model="userEditData.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="200px">
            <el-input v-model="userEditData.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserCancle">取 消</el-button>
          <el-button type="primary" @click="editUserPut">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 为用户设置角色弹框 -->
      <el-dialog title="设置角色" :visible="rolePageShow">
        <el-form>
          <el-form-item label="用户名：" label-width="200px">
            <span>{{roleData.username}}</span>
          </el-form-item>
          <el-form-item label="角色：" label-width="200px">
            <el-select v-model="rolevalue" clearable placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="rolePageShow = false">取 消</el-button>
          <el-button type="primary" @click="rolePut">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "Users",
  mounted() {
    //此接口必须设置一个请求头
    this.getUsersList();
  },
  data() {
    return {
      addUserShow: false,
      editUserShow: false,
      rolePageShow: false,
      userAddData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      userEditData: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      roleData: {},
      roleList: [],
      rolevalue: "",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            min: 3,
            max: 8,
            message: "长度在 3 到 8 个字符",
            trigger: "blur"
          }
        ]
      },
      searchData: "",
      tableData: [],
      //分页数据
      total: 0,
      sizepage: 10,
      currentpage: 1
    };
  },
  methods: {
    sizeChange(size) {
      this.sizepage = size;
      this.getUsersList();
    },
    currentChange(page) {
      this.currentpage = page;
      this.getUsersList();
    },
    getUsersList(query = "") {
      if (query == "") {
        var url = `users?pagenum=${this.currentpage}&pagesize=${this.sizepage}`;
      } else {
        var url = `users?pagenum=${this.currentpage}&pagesize=${this.sizepage}&query=${query}`;
      }
      this.$myHttp({
        method: "get",
        //不写默认为get
        url
      }).then(backdata => {
        //console.log(backdata);
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          //console.log(data) total pagenum
          this.total = data.total;
          this.tableData = data.users;
        } else {
        }
      });
    },
    searchGet() {
      this.getUsersList(this.searchData);
    },
    addUserPost() {
      this.$refs.userAddData.validate(res => {
        // 如果有错误，直接停止代码执行
        if (res) {
          return;
        }
      });
      this.$myHttp({
        url: "users",
        method: "post",
        data: this.userAddData
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 201) {
          this.$message({
            message: "添加用户成功",
            type: "success",
            headers: { Authorization: window.localStorage.getItem("token") }
          });
          //关闭弹框
          this.addUserShow = false;
          this.getUsersList();
        }
      });
    },
    mgStateChange(scope) {
      //el-switch 的change
      // elementUI 把template 的所有遍历数据 slot-scope(scope) row 对应页面行元素 且值为页面当前显示的值
      this.$myHttp({
        url: `/users/${scope.row.id}/state/${scope.row.mg_state}`,
        method: "put"
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.$message({
            message: "修改用户状态成功",
            type: "success"
          });
        } else {
          this.$message.error("修改用户状态失败");
          this.tableData[scope.$index].mg_state = !scope.row.mg_state;
        }
      });
    },
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //执行删除
          this.$myHttp({
            url: `users/${id}`,
            method: "delete"
          }).then(backdata => {
            let { data, meta } = backdata.data;
            if (meta.status == 200) {
              this.getUsersList();
              this.$message({
                message: "删除用户成功",
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editUserisShow(scope) {
      this.userEditData = scope.row;
      this.editUserShow = true;
    },
    editUserPut() {
      let id = this.userEditData.id;
      let email = this.userEditData.email;
      let mobile = this.userEditData.mobile;
      this.$myHttp({
        url: `users/${id}`,
        method: "put",
        data: { email, mobile }
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else {
          this.$message.error("修改失败");
          this.getUsersList();
        }
        this.getUsersList();
        this.editUserShow = false;
      });
    },
    editUserCancle() {
      this.getUsersList();
      this.editUserShow = false;
    },
    rolesShow(scope) {
      //获取id属性
      this.roleData = scope.row;
      // scope.row.role_name 去数组找到id
      let rolename = scope.row.role_name;
      //console.log(rolename);
      //获取角色列表，从数据库
      this.$myHttp({
        url: "roles",
        method: "get"
      }).then(backdata => {
        let { data, meta } = backdata.data;
        this.roleList = data;
        //this.rolevalue = '';
        let role = this.roleList.filter(item => {
          return item.roleName == rolename;
        });
        this.rolevalue = role ? role[0].id:undefined;
      });
      //console.log(role);
      this.rolePageShow = true;
      //补充功能：select 菜单默认选中 当前角色
    },
    rolePut() {
      this.$myHttp({
        url: `users/${this.roleData.id}/role`,
        method: "put",
        data: { rid: this.rolevalue }
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.$message({ message: "修改角色成功", type: "success" });
          this.rolePageShow = false;
        }
      });
    }
  }
};
</script>

<style>
.el-main {
  line-height: 30px;
  text-align: left;
}
.el-input-group {
  width: 30%;
}
.el-pagination {
  margin-top: 5px;
}
</style>
