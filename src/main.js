import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import nprogress from 'nprogress'
import VueQuillEditor from 'vue-quill-editor'

// import 'nprogress/nprogress.css'
// // require styles
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)

// 导入全局样式表
import './assets/css/global.css'


import axios from 'axios'
import contexts from "less/lib/less/contexts";

axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'
//请求拦截器，每次发送请求时候先添加token头
  axios.interceptors.request.use(config=>{
    config.headers.Authorization = window.sessionStorage.getItem('token')
    nprogress.start()
    //最后必须return config
    return config
  })

  axios.interceptors.response.use(config=>{
    nprogress.done()
    return config
  })
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)



// 全局时间过滤器
Vue.filter('dateFormat',function (originVal) {
    const dt = new Date(originVal*1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate()  +'').padStart(2,'0')

  const hh = (dt.getHours()  + '').padStart(2,'0')
  const mm = (dt.getMinutes()  + '').padStart(2,'0')
  const ss = (dt.getSeconds()  + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
