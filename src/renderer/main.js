import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import initSApp from '@/utils/initSApp'
import { remote } from 'electron'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
// 如果有独立app，走另一个模板
let SAppName = remote.getGlobal('common').SAppName
if (SAppName) {
  initSApp(SAppName)
  SAppName = null
} else {
  /* eslint-disable no-new */
  new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
  }).$mount('#app')
}
