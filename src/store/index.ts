// simple mode

// import { reactive } from 'vue'
// export default {
//   debug: false,
//   state: reactive({
//     message:
//       'Vite 2 + TypeScript + Vue 3 + TailwindCSS 2 + Element Plus Starter',
//   }),
//   setMsg(newValue: string) {
//     if (this.debug) {
//       console.log('setMessageAction triggered with', newValue)
//     }

//     this.state.message = newValue
//   },
//   resetMsg() {
//     if (this.debug) {
//       console.log('resetMessage triggered')
//     }

//     this.state.message =
//       'Vite 2 + TypeScript + Vue 3 + TailwindCSS 2 + Element Plus Starter'
//   },
// }

// import 'es6-promise/auto'
import { createStore, createLogger, Store } from 'vuex'
import { InjectionKey } from 'vue'

import hello from './modules/hello'
import auth from './modules/auth'
import charge from './modules/charge'
import road from './modules/road'
import map from './modules/map'

// const debug = import.meta.env.MODE !== 'production'
const debug = false

import { State, state } from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state,
  getters,
  mutations,
  // actions,
  modules: {
    hello,
    auth,
    charge,
    road,
    map,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})
