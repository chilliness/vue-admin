<template>
  <div class="header-wrap">
    <div class="left-box">
      <div class="icon-box" @click="handleToggleCollapse">
        <el-tooltip placement="bottom" :content="_isCollapse ? '展开菜单' : '收缩菜单'">
          <i class="iconfont icon-menu-collapse" :class="{rotate: _isCollapse}"></i>
        </el-tooltip>
      </div>
      <div class="text">
        <span>后台管理系统</span>
        <span class="small">{{$api.ver}}</span>
      </div>
    </div>
    <div class="right-box">
      <div class="avatar-box">
        <img class="avatar" :src="_user.avatar || './img/avatar.jpg'" alt="用户头像">
      </div>
      <el-dropdown class="user-box" trigger="click" @command="handleUser">
        <div class="el-dropdown-link">
          <span v-once>{{_user.name}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided command="profile">修改信息</el-dropdown-item>
          <el-dropdown-item divided command="password">修改密码</el-dropdown-item>
          <el-dropdown-item divided command="avatar">修改头像</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="screen-box" @click="handleFullScreen">
        <el-tooltip placement="bottom" content="开启/退出全屏">
          <i class="icon el-icon-rank"></i>
        </el-tooltip>
      </div>
    </div>
    <el-dialog title="修改信息" center width="350px" :visible="_user.flag" @close="_user.flag = false">
      <el-form label-width="80px">
        <el-form-item label="登录名">
          <el-input placeholder="请输入登录名" v-model.trim="_user.logname" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input placeholder="请输入姓名" v-model.trim="_user.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input placeholder="请输入手机号" v-model.trim="_user.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input placeholder="请输入邮箱" v-model.trim="_user.email"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="_user.gender">
            <el-radio label="M">男性</el-radio>
            <el-radio label="F">女性</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker class="auto" type="date" value-format="yyyy-MM-dd" :editable="false" v-model="_user.birth" placeholder="请选出生日期"></el-date-picker>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleUpdate(_user)">提交</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="修改密码" center width="350px" :visible="passwordForm.flag" @close="passwordForm.flag = false">
      <el-form>
        <el-form-item>
          <el-input type="password" placeholder="请输入密码" v-model.trim="passwordForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" placeholder="请输入确认密码" v-model.trim="passwordForm.re_password"></el-input>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleUpdatePassword(passwordForm)">提交</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="修改头像" center width="350px" :visible="avatarForm.flag" @close="avatarForm.flag = false">
      <el-form>
        <el-upload action :auto-upload="false" :on-change="handleChange" list-type="picture" accept="image/*" ref="uploadRef">
          <el-button slot="trigger" size="small" type="primary">上传头像</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="handleUpdateAvatar">提交</el-button>
        </el-upload>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { isMobile } from '@/utils/tools';

export default {
  name: 'Header',
  data() {
    return {
      passwordForm: {
        flag: false,
        password: '',
        re_password: ''
      },
      avatarForm: {
        flag: false,
        isAjax: false
      }
    };
  },
  computed: {
    _isCollapse() {
      return this.$store.state.isCollapse;
    },
    _user() {
      return this.$store.state.user;
    }
  },
  methods: {
    handleToggleCollapse() {
      this.$store.commit('$handleToggleCollapse');
    },
    handleFullScreen() {
      /**
       * 取差是为了解决某些显示器全屏后，下面两值不相等问题
       * 当控制台位于浏览器下方，此时全屏切换可能失效，笔者暂时无解
       * 对于f11全屏的，此方法切换无效，笔者暂时无解
       */
      if (window.screen.height - window.innerHeight < 5) {
        if (document.exitFullScreen) {
          document.exitFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        let el = document.documentElement;
        if (el.requestFullScreen) {
          el.requestFullScreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen();
        } else if (el.msRequestFullScreen) {
          el.msRequestFullScreen();
        }
      }
    },
    handleChange(file, fileList) {
      fileList.length > 1 && fileList.shift();
    },
    handleUser(type) {
      switch (type) {
        case 'profile':
          this._user.flag = true;
          break;

        case 'password':
          this.passwordForm.flag = true;
          break;

        case 'avatar':
          this.avatarForm.flag = true;
          break;

        case 'logout':
          this.$store.commit('$handleTagList', []);
          this.$store.commit('$handleLogin', 0);
          this.$router.replace({ name: 'login' });
          break;
      }
    },
    async handleUpdate() {
      let obj = this._user;
      obj.birth === null && (obj.birth = '');

      if (!obj.logname.length) {
        return this.$message.error('请填写登录名');
      }

      if (!obj.name.length) {
        return this.$message.error('请填写姓名');
      }

      if (!isMobile(obj.mobile)) {
        return this.$message.error('请填写正确的手机号');
      }

      if (!obj.email.length) {
        return this.$message.error('请填写邮箱');
      }

      if (!obj.birth.length) {
        return this.$message.error('请填写出生日期');
      }

      try {
        let res = await this.$http({ url: this.$api.profile, data: obj });

        if (res.code === 200) {
          this.$message.success(res.msg);
          this.$store.commit('$handleUser', this._user);
        } else {
          this.$message.error(res.msg);
        }
      } catch (e) {
        this.$message.error(this.$api.msg);
      }
    },
    async handleUpdatePassword() {
      let obj = this.passwordForm;
      if (!obj.password.length) {
        return this.$message.error('请填写新密码');
      }

      if (obj.password !== obj.re_password) {
        return this.$message.error('新密码与确认密码不一致');
      }

      try {
        let res = await this.$http({
          url: this.$api.password,
          data: this.passwordForm
        });

        if (res.code === 200) {
          this.$message.success(res.msg);
          Object.assign(this.$data, this.$options.data());
        } else {
          this.$message.error(res.msg);
        }
      } catch (e) {
        this.$message.error(this.$api.msg);
      }
    },
    async handleUpdateAvatar() {
      let file = this.$refs.uploadRef.uploadFiles[0] || {};
      if (!file.raw) {
        return this.$message.error('请上传头像');
      }

      let fd = new FormData();
      fd.append('avatar', file.raw);

      try {
        this.avatarForm.isAjax = true;
        let res = await axios.post(this.$api.avatar, fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: this.$store.state.token
          }
        });
        this.avatarForm.isAjax = false;

        if (res.code === 200) {
          this.$message.success(res.msg);
          Object.assign(this.$data, this.$options.data());
          this.$store.commit('$handleUser', { ...this._user, ...res.data });
        } else {
          this.$message.error(res.msg);
        }
      } catch (e) {
        this.avatarForm.isAjax = false;
        this.$message.error(this.$api.msg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header-wrap {
  @include frow(space-between);
  width: 100%;
  height: 70px;
  color: $fswhite;
  font-size: 22px;
  background: $bgcolor;
  @media screen and (max-width: 768px) {
    font-size: 16px;
    .left-box {
      .icon-box {
        width: 48px !important;
      }
    }
    .right-box {
      .avatar-box,
      .screen-box {
        display: none !important;
      }
      .user-box {
        margin-right: 15px;
      }
    }
  }
  .left-box {
    @include frow(flex-start);
    height: 100%;
    .icon-box {
      @include frow();
      width: 64px;
      height: 100%;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .iconfont {
        display: inline-block;
        font-size: 20px;
        transition: 0.5s;
        &.rotate {
          transform: rotate(-180deg);
        }
      }
    }
    .small {
      margin-left: 5px;
      font-size: 12px;
    }
  }
  .right-box {
    @include frow(flex-start);
    height: 100%;
    .avatar-box {
      width: 40px;
      height: 40px;
      margin: 0 10px;
      border-radius: 50%;
      overflow: hidden;
      .avatar {
        width: 100%;
        height: 100%;
      }
    }
    .user-box {
      color: $fswhite;
      cursor: pointer;
    }
    .screen-box {
      @include frow();
      width: 70px;
      height: 100%;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .icon {
        font-size: 26px;
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
