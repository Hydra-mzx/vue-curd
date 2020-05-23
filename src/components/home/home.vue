<template>
  <el-container class="height100">
    <el-header>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="/static/shop.png" alt />
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
          @close="handleClose"-->
          <el-menu :router="true" default-active="2" class="el-menu-vertical-demo">
            <el-submenu v-for="item1 in menuList" :index="item1.path" :key="item1.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item1.authName}} </span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="item2 in item1.children" :index="item2.path" :key="item2.id">
                  <i class="el-icon-menu"></i>
                  {{item2.authName}}
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
    this.getMenuList();
    // var token = window.localStorage.getItem("token");
    // if (!token) {
    //   this.$message.error("请登录");
    //   this.$router.push({ name: "Login" });
    // }
  },
  data () {
    return {
      menuList:[]
    }
  },
  methods: {
    logout() {
      window.localStorage.clear("token");
      this.$router.push({ name: "Login" });
    },
    getMenuList() {
      this.$myHttp({
        url: "menus",
        method: "get"
      }).then(backdata => {
        let { data, meta } = backdata.data;
        this.menuList = data;
      });
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