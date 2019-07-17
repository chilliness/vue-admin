<template>
  <div class="listMember-wrap">
    <el-row class="btn-add">
      <el-popover placement="left" v-model="addForm.flag" trigger="click">
        <el-form label-width="80px">
          <el-form-item label="登录名">
            <el-input placeholder="请输入登录名" v-model.trim="addForm.logname" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input placeholder="请输入姓名" v-model.trim="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input placeholder="请输入手机号" v-model.trim="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input placeholder="请输入邮箱" v-model.trim="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="addForm.gender">
              <el-radio label="M">男性</el-radio>
              <el-radio label="F">女性</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker class="auto" type="date" value-format="yyyy-MM-dd" :editable="false" v-model="addForm.birth" placeholder="请选择出生日期"></el-date-picker>
          </el-form-item>
          <el-row type="flex" justify="center">
            <el-button type="primary" @click="handleCreate">立即创建</el-button>
          </el-row>
        </el-form>
        <el-button size="mini" type="primary" slot="reference">添加</el-button>
      </el-popover>
    </el-row>
    <el-table class="el-table--border" :data="form.tableList">
      <el-table-column type="selection" width="36"></el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="姓名" width="60"></el-table-column>
      <el-table-column prop="logname" label="登录名" width="80"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
      <el-table-column label="是否审批通过" width="120" v-if="0">
        <template slot-scope="scope">{{scope.row.is_approved ? '通过' : '未通过'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip content="危险操作，谨慎操作" placement="top">
            <el-button size="mini" type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-bar" background :disabled="isAjax" :page-size="form.size" :pager-count="form.pager" :layout="form.layout" :total="form.total" @current-change="handlePage" v-if="form.total"></el-pagination>
  </div>
</template>

<script>
import { isMobile, form } from '@/utils/tools';
const addForm = JSON.stringify({
  isAjax: false,
  flag: false,
  logname: '',
  name: '',
  mobile: '',
  email: '',
  gender: 'M',
  birth: ''
});

export default {
  name: 'ListMember',
  data() {
    return {
      form: { ...form, tableList: [] },
      addForm: JSON.parse(addForm),
      isAjax: false
    };
  },
  mounted() {
    this.handleFetchData();
  },
  methods: {
    handlePage(index) {
      this.form.page = index;
      this.handleFetchData();
    },
    handleDelete(id) {
      this.form.tableList = this.form.tableList.filter(item => item.id !== id);
      this.form.total = this.form.tableList.length;
    },
    handleCreate() {
      this.addForm.birth === null && (this.addForm.birth = '');

      if (!this.addForm.logname.length) {
        return this.$message.error('请填写登录名');
      }

      if (!this.addForm.name.length) {
        return this.$message.error('请填写姓名');
      }

      if (!isMobile(this.addForm.mobile)) {
        return this.$message.error('请填写正确的手机号');
      }

      if (
        this.form.tableList.filter(
          item => String(item.mobile) === this.addForm.mobile
        ).length
      ) {
        return this.$message.error('手机号已存在');
      }

      if (!this.addForm.email.length) {
        return this.$message.error('请填写邮箱');
      }

      if (
        this.form.tableList.filter(item => item.email === this.addForm.email)
          .length
      ) {
        return this.$message.error('邮箱已存在');
      }

      if (!this.addForm.birth.length) {
        return this.$message.error('请填写出生日期');
      }

      this.form.tableList.unshift({
        ...this.addForm,
        id: this.form.tableList[0].id + 1
      });
      this.form.total = this.form.tableList.length;
      this.addForm = JSON.parse(addForm);
      this.$message('添加成功');
    },
    async handleFetchData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.3)'
      });

      try {
        this.isAjax = true;
        let res = await this.$http({
          url: `${this.$api.listMember}?p=${this.form.page}&c=${this.form.size}`
        });
        this.isAjax = false;

        if (res.code === 200) {
          this.form.tableList = res.data.reverse();
          this.form.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
        loading.close();
      } catch (e) {
        loading.close();
        this.isAjax = false;
        this.$message.error(this.$api.msg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.listMember-wrap {
  .btn-add {
    text-align: right;
    margin-bottom: 15px;
  }
  .page-bar {
    text-align: right;
    margin: 20px 0;
  }
}
</style>
