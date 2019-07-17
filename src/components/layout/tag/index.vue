<template>
  <div class="tag-wrap" v-if="tagList.length">
    <div class="tag-bar">
      <el-scrollbar>
        <div class="item-list">
          <div class="item-box" :class="{active: item.name === $route.name}" v-for="(item, index) in tagList" :key="index" @click="$router.push(item.fullPath)">
            <span class="title">{{item.title}}</span>
            <span @click.stop="handleCloseTag(index)">
              <i class="el-icon-close"></i>
            </span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-dropdown class="close-bar" @command="handleCloseTag">
      <el-button size="mini" type="primary">
        <span>标签选项</span>
        <i class="el-icon-arrow-down"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
        <el-dropdown-item command="all">关闭全部</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    tagList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    handleCloseTag(param) {
      switch (param) {
        case 'other':
          let tempList = this.tagList.filter(
            item => item.fullPath === this.$route.fullPath
          );
          this.$store.commit('$handleTagList', tempList);
          break;

        case 'all':
          this.$store.commit('$handleTagList', []);
          this.$router.push({ path: '/' });
          break;

        default:
          let cloneList = this.tagList.slice();
          let delItem = cloneList.splice(param, 1)[0];
          let item = cloneList[param] || cloneList[param - 1];

          if (item) {
            delItem.fullPath === this.$route.fullPath &&
              this.$router.push(item.fullPath);
          } else {
            this.$router.push({ path: '/' });
          }
          this.$store.commit('$handleTagList', cloneList);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-wrap {
  @include frow(space-between);
  $height: 40px;
  height: $height;
  padding-left: 5px;
  overflow: hidden;
  background: $bgwhite;
  .tag-bar {
    flex: 1;
    height: $height;
    font-size: 12px;
    color: $fs666;
    overflow: hidden;
    border-right: 1px solid $bdeee;
    .item-list {
      @include frow(flex-start);
      min-width: 100%;
      height: $height;
    }
    .item-box {
      @include frow();
      height: 26px;
      margin-right: 5px;
      padding: 0 5px 0 12px;
      cursor: pointer;
      border: 1px solid $bdeee;
      border-radius: 3px;
      background: $bgwhite;
      transition: 0.3s;
      &:not(.active):hover {
        background: $bgf8f;
      }
      &.active {
        color: $fswhite;
        border: 1px solid $bg409;
        background: $bg409;
      }
      .title {
        max-width: 80px;
        margin-right: 5px;
        @include dot();
      }
    }
  }
  .close-bar {
    margin: 5px;
  }
}
</style>
