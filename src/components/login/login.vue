<template>
  <div class="login-wrap">
    <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
    并将 Form-Item 的 prop 属性设置为需校验的字段名即可。-->
    <!-- :model="form" 绑定元素数据
    :rules="rules" 设置验证规则 -->
    <el-form
      status-icon
      :model=form
      :rules="rules"
      ref="form"
      label-width="100px"
      class="demo-ruleForm login-from"
    >
      <h2>用户登录</h2>
      <!-- 使用prop验证 -->
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loginClick" class="login-btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'Login',
  data() {
    return {
      form:{
          username:'',
          password:''
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    loginClick() {
      //输入校验
        this.$refs.form.validate((res)=>{
            // 如果有错误，直接停止代码执行
            if(res){
                return;
            }
        })
      //发送post请求 到接口地址 验证登录
      this.$myHttp
        .post("login", this.form)
        .then(backdata => {
          //console.log(backdata);
          if (backdata.data.meta.status == 200) {
            //localStorage保存登录信息 token
            window.localStorage.setItem('token',backdata.data.data.token);
            // 弹框消息
            this.$message({
              message: "恭喜你登录成功",
              type: "success"
            });
            // 跳转到 home 编程式导航
            this.$router.push("/");
            // this.$router.push({name:'home'});
            // name对应 router
          }
        });
    }
  }
};
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-from {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-from .login-btn {
  width: 100%;
}
</style>