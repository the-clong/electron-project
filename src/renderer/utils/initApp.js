import store from '../store'
import Vue from 'vue'
import Router from 'vue-router'

export default function initSApp (name) {
  new Vue({
    router: new Router({
      routes: [
        {
          path: '/',
          name: 'Index',
          component: require(`@/plugins/easy/${name}`).default
        }
      ]
    }),
    store,
    template: '<router-view></router-view>'
  }).$mount('#app')
}
