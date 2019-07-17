<template>
  <div class="mapCar-wrap">
    <div class="map-box">
      <div id="map" class="map"></div>
    </div>
    <div class="info-box" v-if="info.data_time">
      <div class="uptime-box">{{'更新时间：' + info.data_time}}</div>
      <ul class="top-box">
        <li class="item-box">
          <div class="num">{{info.online_today}}</div>
          <div class="text">今日在线</div>
        </li>
        <li class="item-box">
          <div class="num">{{info.passenger_today}}</div>
          <div class="text">今日乘客</div>
        </li>
        <li class="item-box">
          <div class="num">{{info.interact_today}}</div>
          <div class="text">今日互动</div>
        </li>
        <li class="item-box">
          <div class="num">{{info.online_yesterday}}</div>
          <div class="text">昨日在线</div>
        </li>
        <li class="item-box">
          <div class="num">{{info.passenger_yesterday}}</div>
          <div class="text">昨日乘客</div>
        </li>
        <li class="item-box">
          <div class="num">{{info.interact_yesterday}}</div>
          <div class="text">昨日互动</div>
        </li>
      </ul>
      <div class="bottom-box">
        <div class="item-outer">
          <div class="item-inner">
            <div class="title-bar">
              <div class="item-box normal">
                <div class="num">{{info.ad.audience}}</div>
                <div class="text">广告受众</div>
              </div>
              <div class="item-box" :class="{active: adIndex === 0}" @click="adIndex = 0">
                <div class="num">{{info.ad.today_count}}</div>
                <div class="text">今日展示</div>
              </div>
              <div class="item-box" :class="{active: adIndex === 1}" @click="adIndex = 1">
                <div class="num">{{info.ad.yesterday_count}}</div>
                <div class="text">昨日展示</div>
              </div>
            </div>
            <div class="list-box" v-if="adIndex === 0">
              <div class="item-box" v-for="(item, index) in info.ad.today" :key="index">
                <div class="text">{{item.name}}</div>
                <div class="number">{{item.num}}</div>
              </div>
            </div>
            <div class="list-box" v-else-if="adIndex === 1">
              <div class="item-box" v-for="(item, index) in info.ad.yesterday" :key="index">
                <div class="text">{{item.name}}</div>
                <div class="number">{{item.num}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-outer">
          <div class="item-inner">
            <div class="title-bar">
              <div class="item-box" :class="{active: bindIndex === 0}" @click="bindIndex = 0">
                <div class="num">{{info.bind_today.count}}</div>
                <div class="text">今日绑定预期</div>
              </div>
              <div class="item-box" :class="{active: bindIndex === 1}" @click="bindIndex = 1">
                <div class="num">{{info.bind_yesterday.count}}</div>
                <div class="text">昨日绑定预期</div>
              </div>
            </div>
            <div class="list-box" v-if="bindIndex === 0">
              <div class="item-box" v-for="(item, index) in info.bind_today.cities" :key="index">
                <div class="text">{{item.city}}</div>
                <div class="number">{{item.count}}</div>
              </div>
            </div>
            <div class="list-box" v-else-if="bindIndex === 1">
              <div class="item-box" v-for="(item, index) in info.bind_yesterday.cities" :key="index">
                <div class="text">{{item.city}}</div>
                <div class="number">{{item.count}}</div>
              </div>
            </div>
          </div>
          <div class="item-inner">
            <div class="title-bar">
              <div class="item-box" :class="{active: onlineIndex === 0}" @click="onlineIndex = 0">
                <div class="num">{{info.online.today_count}}</div>
                <div class="text">今日在线预期</div>
              </div>
              <div class="item-box" :class="{active: onlineIndex === 1}" @click="onlineIndex = 1">
                <div class="num">{{info.online.yesterday_count}}</div>
                <div class="text">昨日在线预期</div>
              </div>
            </div>
            <div class="list-box" v-if="onlineIndex === 0">
              <div class="item-box" v-for="(item, index) in info.online.today" :key="index">
                <div class="text">{{item.city}}</div>
                <div class="number">{{item.num}}</div>
              </div>
            </div>
            <div class="list-box" v-else-if="onlineIndex === 1">
              <div class="item-box" v-for="(item, index) in info.online.yesterday" :key="index">
                <div class="text">{{item.city}}</div>
                <div class="number">{{item.num}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap';

export default {
  name: 'MapCar',
  data() {
    return {
      list: [],
      map: '',
      info: {},
      adIndex: 0,
      onlineIndex: 0,
      bindIndex: 0
    };
  },
  computed: {
    _list() {
      let [nW, nH] = [14, 28];

      return this.list.map(item => {
        let marker = new AMap.Marker({
          id: item.id,
          icon: new AMap.Icon({
            size: new AMap.Size(nW, nH),
            image:
              'https://webapi.amap.com/ui/1.0/ui/misc/PathSimplifier/examples/imgs/car.png',
            imageSize: new AMap.Size(nW, nH)
          }),
          position: item.loc.split(','),
          title: `车辆id为${item.id}`,
          offset: new AMap.Pixel(-nW / 2, -nH / 2),
          angle: item.loc.split(',')[2]
        });
        return marker;
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
    handleRandom() {
      this.timerRandom = setInterval(() => this.handleFetchData(true), 10000);
    },
    async handleFetchData(bool) {
      if (!document.createElement('canvas').getContext) {
        return this.$message('当前环境不支持 Canvas');
      }

      if (!bool) {
        this._loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.3)'
        });
      }

      try {
        let res = await this.$http({ url: this.$api.chartOnline });

        if (res.code === 200) {
          this.list = res.data.online_list;
          this.info = { ...res.data };
          !this.map && (this.map = new AMap.Map('map'));
        } else {
          window.location.reload();
        }
        !bool && this._loading.close();
      } catch (e) {
        !bool && this._loading.close();
        window.location.reload();
      }
    }
  },
  watch: {
    _list(val, oldVal) {
      if (this.map) {
        this.map.clearMap();
        this.map.add(this._list);
        this.map.setFitView();
      }
    },
    map(val, oldVal) {
      this.handleRandom();
    }
  }
};
</script>

<style lang="scss" scoped>
.mapCar-wrap {
  @include frow(space-between);
  height: 100%;
  .map-box {
    flex: 1;
    height: 100%;
    .map {
      height: 100%;
    }
  }
  .info-box {
    position: relative;
    @include fcol(space-between, stretch);
    $width: 660px;
    width: $width;
    height: 100%;
    margin-left: 20px;
    color: $fswhite;
    font-size: 14px;
    @media screen and (max-width: 768px) {
      display: none;
    }
    .uptime-box {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 12px;
      color: $fs333;
      transform: translateY(130%);
    }
    .num {
      font-size: 34px;
      margin-bottom: 10px;
    }
    .top-box {
      @include frow(flex-start);
      flex-shrink: 0;
      .item-box {
        @include fcol();
        width: $width / 6;
        height: ($width - 20px) / 6;
        &:nth-of-type(4n) {
          margin-left: 20px;
        }
        &:nth-of-type(3n - 2) {
          background: #ce2673;
        }
        &:nth-of-type(3n - 1) {
          background: #6db535;
        }
        &:nth-of-type(3n) {
          background: #5391f6;
        }
      }
    }
    .bottom-box {
      @include frow(space-between);
      flex: 1;
      margin-top: 20px;
      .item-outer {
        @include fcol(flex-start, stretch);
        $width: calc((#{$width} - 20px) / 2);
        $height: 80px;
        width: $width;
        height: 100%;
        .item-inner {
          position: relative;
          flex: 1;
          border-radius: 4px;
          overflow: hidden;
          background: #1daffc;
          &:nth-of-type(n + 2) {
            margin-top: 20px;
          }
          .title-bar {
            @include frow(space-between, stretch);
            height: $height;
            border-bottom: 1px solid $bdwhite;
            .item-box {
              @include fcol();
              flex: 1;
              cursor: pointer;
              &.normal {
                cursor: default;
              }
              &.active {
                background: rgba(0, 0, 0, 0.2);
              }
              &:nth-of-type(n + 2) {
                border-left: 1px solid $bdwhite;
              }
              .num {
                font-size: 24px;
              }
            }
          }
          .list-box {
            position: absolute;
            left: 0;
            top: $height;
            bottom: 0;
            right: -40px;
            overflow-y: scroll;
            .item-box {
              @include frow(space-between);
              width: $width;
              height: 40px;
              padding: 0 10px;
              box-sizing: border-box;
              &:nth-of-type(odd) {
                background: rgba(0, 0, 0, 0.2);
              }
              .text {
                @include dot();
              }
              .number {
                width: 60px;
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
}
</style>
