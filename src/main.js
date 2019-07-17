import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
import App from './App';
import router from './router';
import store from './store';
import api from './utils/api';
import sesstion from './utils/storage';
import 'element-ui/lib/theme-chalk/index.css';
import './common/scss/index.scss';

Vue.config.productionTip = false;
Vue.use(ElementUI, { size: 'small' });
// axios请求拦截器
axios.interceptors.request.use(req => {
  // 请求头设置
  req.headers['Authorization'] = store.state.token;
  req.data && (req.method = 'post');
  return req;
});
// axios响应拦截器
axios.interceptors.response.use(res => res.data);
Vue.prototype.$http = axios;
Vue.prototype.$sesstion = sesstion;
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
