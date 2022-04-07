export interface State {
  message: string
}

const initialMsg = 'Vite 2 + TypeScript + Vue 3 + TailwindCSS 2 + Element Plus Starter'

const state: State = {
  message: initialMsg,
}

// getters
const getters = {
  message: (state: State) => {
    return state.message
  },
}

// actions
const actions = {
  resetMsg({ commit }: any): void {
    commit('setMsg', initialMsg)
  },
}

// mutations
const mutations = {
  setMsg(state: State, msg: string): void {
    state.message = msg
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
