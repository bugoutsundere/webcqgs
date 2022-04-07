import { State } from './state'

export default {
  changeCom: (state: State, code: string) => {
    state.activeCom = code
  },
  changeBaseStruct: (state: State, code: string) => {
    state.activeBaseStruct = code
  },
  changeCuringBaseStruct: (state: State, code: string) => {
    state.activeCuringBaseStruct = code
  },
  changeEq: (state: State, code: string) => {
    state.activeEq = code
  },
  saveMeta: (state: State, { page, meta }: any) => {
    state.meta[page] = meta
  },
  changeDate: (state: State, date: Date) => {
    state.appDate = date
  },
}
