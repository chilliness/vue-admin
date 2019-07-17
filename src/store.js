import Vue from 'vue';
import Vuex from 'vuex';
import session from '@/utils/storage';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: session.get('isLogin', 0),
    token: session.get('token', ''),
    user: session.get('user', {}),
    isCollapse: session.get('isCollapse', false),
    tagList: session.get('tagList', [])
  },
  mutations: {
    $handleLogin(state, num) {
      state.isLogin = session.set('isLogin', num);
      !num && session.clear();
    },
    $handleToken(state, str) {
      state.token = session.set('token', `Bearer ${str}`);
    },
    $handleUser(state, obj) {
      state.user = session.set('user', { ...obj, flag: false });
    },
    $handleToggleCollapse(state) {
      state.isCollapse = session.set('isCollapse', !state.isCollapse);
    },
    $handleTagList(state, arr) {
      state.tagList = session.set('tagList', arr);
    }
  }
});
