<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="title">后台管理系统</div>
      <el-form class="form" :model="form" :rules="rules" ref="form">
        <el-form-item prop="username">
          <el-input v-model.trim="form.username" placeholder="请输入用户名">
            <el-button slot="prepend" icon="iconfont icon-person"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model.trim="form.password" placeholder="请输入密码" @keyup.enter.native="handleLogin">
            <el-button slot="prepend" icon="iconfont icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-button class="btn-submit" type="primary" @click="handleLogin">{{isAjax ? '登录中，请稍候' : '登录'}}</el-button>
        <div class="tip-box" style="margin-top: 20px; font-size: 12px; color: #f00;">任意非空 用户名 和 密码 即可</div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      isAjax: false
    };
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(async valid => {
        if (!valid || this.isAjax) {
          return;
        }

        try {
          this.isAjax = true;
          let res = await this.$http({
            url: `${this.$api.login}?name=${this.form.username}`,
            data: { logname: this.form.username, password: this.form.password }
          });
          this.isAjax = false;

          if (res.code === 200) {
            this.$store.commit('$handleLogin', 1);
            this.$store.commit('$handleToken', res.data.access_token);
            this.$store.commit('$handleUser', {
              ...res.data.profile,
              authList: res.data.authList
            });
            this.$router.replace({ path: '/' });
          } else {
            this.$message.error(res.msg);
          }
        } catch (e) {
          this.isAjax = false;
          this.$message.error(this.$api.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-wrap {
  @include fcol();
  width: 100vw;
  height: 100vh;
  color: $fswhite;
  background: url(./img/bg.jpg) no-repeat center top;
  background-size: cover;
  .login-box {
    width: 320px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    .title {
      @include frow();
      height: 50px;
      font-size: 20px;
      border-bottom: 1px solid $bdwhite;
    }
    .form {
      padding: 30px;
      .btn-submit {
        width: 100%;
      }
      .note {
        @include frow(flex-start);
        height: 30px;
        font-size: 12px;
        color: $fs333;
      }
    }
  }
}
</style>
