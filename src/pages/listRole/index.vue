<template>
  <div class="listRole-wrap">
    <el-table class="el-table--border" :data="form.tableList">
      <el-table-column type="selection" width="36"></el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="100"></el-table-column>
      <el-table-column prop="description" label="角色"></el-table-column>
    </el-table>
    <el-pagination class="page-bar" background :disabled="isAjax" :page-size="form.size" :pager-count="form.pager" :layout="form.layout" :total="form.total" @current-change="handlePage" v-if="form.total"></el-pagination>
  </div>
</template>

<script>
import { form } from '@/utils/tools';

export default {
  name: 'ListRole',
  data() {
    return {
      form: { ...form, tableList: [] },
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
          url: `${this.$api.listRole}?p=${this.form.page}&c=${this.form.size}`
        });
        this.isAjax = false;

        if (res.code === 200) {
          this.form.tableList = res.data;
          this.form.total = res.total;
        } else {
          this.$message.error(this.$api.msg);
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
.listRole-wrap {
  .page-bar {
    text-align: right;
    margin: 20px 0;
  }
}
</style>
