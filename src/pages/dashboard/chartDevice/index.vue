<template>
  <div class="chartDevice-wrap">
    <el-form class="search-bar" inline>
      <el-form-item>
        <el-date-picker type="month" value-format="yyyy-MM" :editable="false" v-model="form.month" placeholder="选择查看月份"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleFetchData">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="chart-box" style="width: 100%; height: 600px;" ref="echartMonth"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'ChartDevice',
  data() {
    return {
      form: {
        month: '',
        date: ''
      },
      isAjax: false,
      echartsConfigMonth: {
        color: '#409eff',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        title: { left: 'center', text: '' },
        xAxis: {},
        yAxis: {},
        series: []
      }
    };
  },
  mounted() {
    this.handleInitEcharts();
    this.handleFetchData();
  },
  methods: {
    handleInitEcharts() {
      this.$nextTick(
        () => (this._echartMonth = echarts.init(this.$refs.echartMonth))
      );
    },
    async handleFetchData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.3)'
      });
      this.form.month === null && (this.form.month = '');

      try {
        this.isAjax = true;
        let res = await this.$http({
          url: `${this.$api.chartDevice}?month=${this.form.month}`
        });
        this.isAjax = false;

        if (res.code === 200) {
          let config = this.echartsConfigMonth;
          config.xAxis = {
            axisLabel: { rotate: 45 },
            triggerEvent: true,
            data: []
          };
          config.title.text = `${res.data.time}当月柱状图`;
          config.series = [
            {
              type: 'bar',
              name: '在线设备',
              label: { show: true, position: 'top' },
              data: res.data.list.map(item => {
                config.xAxis.data.push(item.date);
                return item.num;
              })
            }
          ];
          // 此属性仅用于当前页面图表缩放
          config.series._resize = true;
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
  },
  watch: {
    'echartsConfigMonth.series'(val, oldVal) {
      this._echartMonth && this._echartMonth.setOption(this.echartsConfigMonth);
      window.onresize = () => {
        if (!val._resize) {
          return;
        }
        this._echartMonth && this._echartMonth.resize();
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.chartDevice-wrap {
  .search-bar {
    text-align: center;
  }
  .chart-box {
    margin: 0 auto;
    overflow: hidden;
  }
}
</style>
