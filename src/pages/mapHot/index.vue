<template>
  <div class="mapHot-wrap">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import AMap from 'AMap';
let MAX = 2;

export default {
  name: 'MapHot',
  data() {
    return {
      list: [],
      heatmap: ''
    };
  },
  computed: {
    _list() {
      return this.list.map(item => {
        return [item.lng, item.lat];
      });
    }
  },
  mounted() {
    this.handleFetchData();
  },
  destroyed() {
    clearInterval(this.timerRandom);
  },
  methods: {
    handleInitMap() {
      this._map = new AMap.Map('map');

      if (!document.createElement('canvas').getContext) {
        return this.$message('当前环境不支持 Canvas');
      }

      this._map.plugin(
        ['AMap.Heatmap'],
        () => (this.heatmap = new AMap.Heatmap(this._map))
      );
    },
    handleRandom() {
      this.timerRandom = setInterval(() => {
        let aData = [];
        for (let i = 0; i < Math.ceil(Math.random() * 100 + 100); i++) {
          aData.push({
            lng: Math.random() * 20 + 98,
            lat: Math.random() * 18 + 22
          });
        }
        this.list = aData;
      }, 5000);
    },
    async handleFetchData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.3)'
      });

      try {
        let res = await this.$http({ url: this.$api.mapHot });

        if (res.code === 200) {
          this.list = res.data.map(item => ({
            lng: item.lng,
            lat: item.lat
          }));
          this.handleInitMap();
        } else {
          window.location.reload();
        }
        loading.close();
      } catch (e) {
        loading.close();
        window.location.reload();
      }
    }
  },
  watch: {
    _list(val, oldVal) {
      if (this.heatmap) {
        // 缩放地图到合适的视野级别
        this._map.setFitView([new AMap.Polyline({ path: this._list })]);
        this.heatmap.setDataSet({ data: this.list, max: MAX });
      }
    },
    heatmap(val, oldVal) {
      this.handleRandom();
    }
  }
};
</script>

<style lang="scss" scoped>
.mapHot-wrap {
  height: 100%;
  .map {
    height: 100%;
  }
}
</style>
