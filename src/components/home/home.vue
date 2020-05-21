<template>
  <el-container class="height100">
    <el-header>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="/static/shop.png" alt="">
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <h2>电商后台管理系统</h2>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-button @click.stop="logout" type="warning">退出</el-button>
        </div>
      </el-col>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-col :span="24">
            <!--             @open="handleOpen"
            @close="handleClose" -->
          <el-menu
            :router="true"
            default-active="2"
            class="el-menu-vertical-demo"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="users">
                  <i class="el-icon-user"></i>
                  用户列表
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="roles">
                  <i class="el-icon-thumb"></i>
                  角色列表
                </el-menu-item>
                <el-menu-item index="rights">
                  <i class="el-icon-set-up"></i>
                  权限列表
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    
  //登录？页面访问
  //利用钩子函数在页面渲染之前
  mounted() {
    // var token = window.localStorage.getItem("token");
    // if (!token) {
    //   this.$message.error("请登录");
    //   this.$router.push({ name: "Login" });
    // }
  },
  methods: {
    logout() {
      window.localStorage.clear("token");
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style>
.height100 {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #fff;
  text-align: center;
  line-height: 20px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>