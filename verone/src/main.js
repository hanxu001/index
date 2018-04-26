// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import headers from './components/header/index.vue'
import footers from './components/footer/index.vue'
import ElementUI from 'element-ui';
import VueClipboard from 'vue-clipboard2'


import 'element-ui/lib/theme-chalk/index.css'
import { Swiper, Slide } from 'vue-swiper-component'

Vue.use(ElementUI);
Vue.use(VueClipboard)
Vue.config.productionTip = false

// 注册组件
Vue.component('header-Top', headers)
Vue.component('footer-Bottom', footers)

router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
});
/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  template: '<App/>',
  components: { App }
})
