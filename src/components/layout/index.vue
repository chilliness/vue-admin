<template>
  <div class="layout-wrap">
    <Header></Header>
    <div class="main-box">
      <Menu></Menu>
      <div class="container-box">
        <Tag :tagList="$store.state.tagList"></Tag>
        <div class="router-box" :class="{full: !$store.state.tagList.length}">
          <keep-alive :include="_include">
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './header';
import Menu from './menu';
import Tag from './tag';

export default {
  name: 'Layout',
  components: { Header, Menu, Tag },
  computed: {
    _include() {
      let [aList, aData] = [this.$store.state.tagList, []];

      for (let i = 0; i < aList.length; i++) {
        if (aList[i]._include) {
          aData.push(aList[i]._name);
        }
      }

      return aData;
    }
  },
  watch: {
    $route: {
      handler(val, oldVal = {}) {
        let aList = this.$store.state.tagList.slice();
        let bool = aList.some((item, index) => {
          if (item.path === val.path) {
            return !!(item.fullPath = val.fullPath);
          }
          return false;
        });

        /**
         * 判断当前路由是否已经在缓存路由表中
         * 确保缓存路由表最多存6个
         */
        if (!bool) {
          aList.length >= 6 && aList.shift();

          let index = aList.findIndex(item => item.path === oldVal.path);
          let oItem = {
            path: val.path,
            title: val.meta.title,
            name: val.matched[1].name,
            fullPath: val.fullPath,
            _include: !val.meta.exclude,
            _name: val.name.charAt(0).toUpperCase() + val.name.substr(1)
          };

          // 把由已存在路由打开的文件，插到其前边
          if (index !== -1 && !val.meta.menu && !val.meta.parent) {
            aList.splice(index, 0, oItem);
          } else {
            aList.push(oItem);
          }
        }
        this.$store.commit('$handleTagList', aList);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-wrap {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: $bgf0f;
  .main-box {
    position: absolute;
    left: 0;
    top: 70px;
    right: 0;
    bottom: 0;
    @include frow(flex-start, stretch);
    .container-box {
      position: relative;
      flex: 1;
      overflow: hidden;
      .router-box {
        position: absolute;
        left: 10px;
        top: 50px;
        right: 10px;
        bottom: 10px;
        padding: 20px;
        border-radius: 5px;
        overflow-y: auto;
        background: $bgwhite;
        &.full {
          top: 10px;
        }
      }
    }
  }
}
</style>
