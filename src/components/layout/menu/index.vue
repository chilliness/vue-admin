<template>
  <el-scrollbar class="menu-wrap">
    <el-menu class="list-box" :collapse="$store.state.isCollapse" :default-active="$route.name" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in menus">
        <template v-if="item.children">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </template>
            <template v-for="_item in item.children">
              <el-submenu :index="_item.index" :key="_item.index" v-if="_item.children">
                <template slot="title">{{_item.title}}</template>
                <el-menu-item v-for="(__item, index) in _item.children" :key="index" :index="__item.index">{{__item.title}}</el-menu-item>
              </el-submenu>
              <el-menu-item :index="_item.index" :key="_item.index" v-else>
                <span style="padding-left: 8px;">{{_item.title}}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { aMenu } from '@/router';

export default {
  name: 'Menu',
  data() {
    return { menus: aMenu };
  }
};
</script>

<style lang="scss" scoped>
.menu-wrap {
  .list-box {
    min-height: 100%;
    &:not(.el-menu--collapse) {
      width: 200px;
    }
  }
}
</style>
