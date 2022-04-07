import router from './'
import { get, set, remove } from '@/utils/cookie'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useStore } from 'vuex'
import { store } from '@/store'

NProgress.configure({ showSpinner: false })

const { VITE_AUTH, VITE_TEST_TOKEN, VITE_LOGIN_URL } = import.meta.env

router.beforeEach(async (to, from) => {
  NProgress.start()
  // 地址中存在tokenKey则跳转去掉 同时保存tokenKey到cookie
  if (window.location.href.indexOf('tokenKey') > -1) {
    let searchStr = window.location.search
    searchStr = searchStr.substring(1, searchStr.length)
    // tokenKey
    const tkStr = searchStr.split('&').find((e) => e.indexOf('tokenKey') === 0)
    tkStr && set('tokenKey', tkStr.split('=')[1])
    // token
    const tk = searchStr
      .split('&')
      .find((e) => e.indexOf('token') === 0 && e.indexOf('tokenKey') !== 0)
    tk && set('token', tk.split('=')[1])

    NProgress.done()
    // 开发环境或招路通
    window.location.href = '/'
    // 阿里云
    // window.location.href = '/dirjsc'
  } else {
    /*if (VITE_AUTH === 'FALSE') {*/
      // 设置无权限下的测试token
      VITE_TEST_TOKEN && set('token', VITE_TEST_TOKEN as string)
      if (!store.state.auth?.userInfo) {
        await store.dispatch('auth/getUserInfo')
      }
  /*  } else {
      const tokenKey = get('tokenKey')
      const token = get('token')
      if (token) {
        // 检查用户信息
        if (!store.state.auth?.userInfo) {
          await store.dispatch('auth/getUserInfo')
          if (!store.state.auth?.userInfo) {
            store.dispatch('auth/logout')
          }
        }
      } else if (tokenKey) {
        // 获取token
        await store.dispatch('auth/getToken', tokenKey)
        if (!store.state.auth?.token) {
          store.dispatch('auth/logout')
        } else {
          return to.fullPath
        }
      } else {
        store.dispatch('auth/logout')
      }
    }*/
  }
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})
