import { createApp, defineComponent, h, toRef } from 'vue'
import App from './App.vue'

import '@/styles/index.css'
import '@/styles/tailwind.css'

import router from './router'
import './router/helper'
import { store, key } from './store'

import vueWaves from '@/directives/waves/index'
import Module from '@/components/module/index.vue'
import SvgIcon from './components/svgIcon.vue'
import Switcher from '@/components/switcher.vue'
import Empty from '@/components/empty.vue'
import Ect from '@/components/ect.vue'
import Loading from '@/components/Loading.vue'

// import { ElTable, ElTableColumn, ElDatePicker } from 'element-plus'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

import 'animate.css'

import 'vite-plugin-svg-icons/register'

import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 导入本地化语言
// import locale from 'element-plus/lib/locale'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import './assets/font/font.css'

// 设置语言
dayjs.locale('zh-cn')

// import  Socket  from './utils/socket'
// const socket = new Socket({
//     url:'ws://10.104.14.40:60000/api',
//     onOpen(res){
//         console.log('lian', res)
//     },
//     onClose(res){
//       console.log(this, 222222222)
//     },
//     onError(res){
//         console.log(res,23333333333)
//     }
// })
const app = createApp(App)

app.component('Module', Module)
app.component('Switcher', Switcher)
app.component('Empty', Empty)
app.component('Ect', Ect)
app.component('Loading', Loading)

// app.component(ElTable.name, ElTable)
// app.component(ElTableColumn.name, ElTableColumn)
// app.component(ElDatePicker.name, ElDatePicker)
// app.component('ElTable', ElTable)
// app.component('ElTableColumn', ElTableColumn)
// app.component('ElDatePicker', ElDatePicker)

app.use(ElementPlus, { locale })

app.component('SvgIcon', SvgIcon)

app.use(vueWaves)

app.use(router)
app.use(store, key)

app.mount('#app')
