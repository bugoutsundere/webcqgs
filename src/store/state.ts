import { State as hello } from './modules/hello'
import { State as auth } from './modules/auth'
import { State as charge } from './modules/charge'
import { State as road } from './modules/road'
import { State as map } from './modules/map'


export interface State {
  appName: string
  appLayout: string
  appDate: Date
  activeCom: string
  activeBaseStruct: string
  activeEq: string
  meta: any
  globalLoading: boolean

  hello?: hello
  auth?: auth
  charge?: charge
  road?: road
  map?: map
  activeCuringBaseStruct: string
}

/*export const comInfo = [
  { name: '京津塘高速', code: '105', center: [116.90485, 39.52525], zoom: 9 },
  { name: '贵黄公司', code: '106', center: [106.794594, 26.519682], zoom: 12 },
  { name: '甬台温高速', code: '101', center: [120.699879, 27.930926], zoom: 9 },
  {
    name: '宁波交通科技',
    code: '102',
    center: [121.643249, 29.790431],
    zoom: 11,
  },
  { name: '九瑞高速', code: '103', center: [115.70544, 29.684725], zoom: 10 },
  { name: '桂林公司', code: '104', center: [110.308324, 25.184422], zoom: 9 },
  { name: '鄂东大桥', code: '107', center: [115.048523, 30.252948], zoom: 12 },
  { name: '重庆公司', code: '108', center: [106.602688, 29.262314], zoom: 8 },
  { name: '亳阜高速', code: '109', center: [115.875878, 33.642651], zoom: 9 },
]*/
export const comInfo = [
  // { name: '建新公司', code: '105', center: [106.40309,29.80243], zoom: 9, type: 'company' },
  // { name: '石黔高速', code: '101', center: [106.403243,29.802354], zoom: 12, type: 'road' },
  // { name: '潼荣高速', code: '102', center: [106.519111,29.620469], zoom: 9, type: 'road' },
  // { name: '渝黔扩能高速', code: '103', center: [115.70544, 29.684725], zoom: 10, type: 'road' },
  // { name: '双合公司', code: '104', center: [110.308324, 25.184422], zoom: 9, type: 'company' },
  // { name: '合璧津高速', code: '106', center: [106.794594, 26.519682], zoom: 11, type: 'road' },
  // { name: '遂渝公司', code: '107', center: [115.048523, 30.252948], zoom: 12, type: 'company' },
  // { name: '遂渝高速', code: '108', center: [106.602688, 29.262314], zoom: 8, type: 'road' },
  // { name: '秀松高速', code: '109', center: [115.875878, 33.642651], zoom: 9, type: 'road' },
  // { name: '永沪高速', code: '109', center: [115.875878, 33.642651], zoom: 9, type: 'road' },

  { name: '潼荣高速', code: '102', center: [106.519111, 29.620469], zoom: 9, type: 'road' },
  // { name: '渝黔扩能高速', code: '103', center: [115.70544, 29.684725], zoom: 10, type: 'road' },

  { name: '合安高速', code: '106', center: [106.794594, 26.519682], zoom: 11, type: 'road' },
  { name: '遂渝高速', code: '108', center: [106.602688, 29.262314], zoom: 8, type: 'road' },
  { name: '秀松高速', code: '109', center: [115.875878, 33.642651], zoom: 9, type: 'road' },
  { name: '永沪高速', code: '110', center: [115.875878, 33.642651], zoom: 9, type: 'road' },
  { name: '石黔高速', code: '101', center: [106.403243, 29.802354], zoom: 12, type: 'road' },
]

export const allComInfo = {
  name: '全部公司',
  code: 'list',
  center: [104.063715, 30.546224],
  zoom: 2,
}

// countKey用于列表判断，值为对应接口数据的key
export const baseStructInfo = [
  { name: '收费站', key: 'tollStatNums', code: 'stat', countKey: 'areaCount' },
  { name: '服务区', key: 'serviceStatNums', code: 'area', countKey: 'areaCount' },
  { name: '门架', key: 'gantry', code: 'gantry', countKey: 'gatesummarysum' },
  {
    name: '桥梁',
    code: 'brg',
    key: 'bridgeCount',
    countKey: 'bridgeCount',
    children: [
      { name: '特大', key: 'wbigBridgeNums' },
      { name: '大', key: 'bigBridgeNums' },
      { name: '中', key: 'midBridgeNums' },
      { name: '小', key: 'smallBridgeNums' },
    ],
  },
  {
    name: '隧道',
    code: 'tunnel',
    key: 'tunnelCount',
    countKey: 'tunnelCount',
    children: [
      { name: '特长', key: 'wlangChunnelNums' },
      { name: '长', key: 'langChunnelNums' },
      { name: '中长', key: 'midChunnelNums' },
      { name: '短', key: 'shortChunnelNums' },
    ],
  },
  {
    name: '车道',
    code: 'route',
    key: 'lanesSum',
    countKey: 'lanessum',
    children: [
      { name: 'ETC', key: 'routeEtc' },
      { name: '混合车道', key: 'routeNetc' },
    ],
  },
]
// key值为对应接口数据的key,code为唯一值,用于判断当前点击
export const curingManageBaseStructInfo = [
  { name: '路段', key: 'mngSectionLen', code: 'section' },
  { name: '沿线设施', key: 'faciCount', code: 'roadSide' },
  { name: '边坡', key: 'slopeCount', code: 'sideslope' },
  {
    name: '桥梁',
    code: 'bridge',
    key: 'bridgeCount'
  },
  {
    name: '隧道',
    code: 'tunnel',
    key: 'tunnelCount'
  },
  {
    name: '涵洞',
    code: 'culvert',
    key: 'culvertCount'
  },
]
export const eqInfo = [
  { name: '专用设备', code: '0301', key: 'stat' },
  { name: '照明设施', code: '0302', key: 'monitor' },
  { name: '监控系统', code: '0303', key: 'connect' },
  { name: '隧道机电系统', code: '0304', key: 'electric' },
]
// export const eqInfo = [
//   { name: '收费系统', code: '0301', key: 'stat' },
//   { name: '监控系统', code: '0302', key: 'monitor' },
//   { name: '通信系统', code: '0303', key: 'connect' },
//   { name: '供配电系统', code: '0304', key: 'electric' },
//   { name: '隧道机电系统', code: '0305', key: 'tunnel' },
//   { name: '照明设施', code: '0306', key: 'light' },
//   { name: '专用设备', code: '0307', key: 'special' },
//   { name: '网络及安全设备', code: '0308', key: 'safe' },
//   { name: '计算机设备及软件', code: '0309', key: 'computer' },
// ]

export const employeeInfo = [
  {
    label: '管理人员数量(含股东派遣等)',
    ref: '管理',
    color: 'red',
  },
  {
    label: '公路业务员工数量(含劳务派遣等)',
    ref: '公路业务',
    color: 'blue',
  },
  {
    label: '服务区业务员工数量(含劳务派遣等)',
    ref: '服务区',
    color: 'yellow',
  },
  {
    label: '清障业务员工数量(含劳务派遣等)',
    ref: '清障',
    color: 'green',
  },
  {
    label: '其他业务员工数量(含劳务派遣等)',
    ref: '其他',
    color: 'purple',
  },
]

export const comCodes = (() => {
  const list = ['list']
  let i = 1
  while (i < 10) {
    list.push('10' + i)
    i++
  }
  return list
})()

export const state: State = {
  appName: 'vite + ts + vue 3 + tailwind 2 Starter',
  appLayout: 'default',
  globalLoading: false,
  // custom
  appDate: new Date(),
  activeCom: 'list',
  // bussiness
  activeBaseStruct: 'stat',
  activeEq: '专用设备',
  meta: {},
  activeCuringBaseStruct: 'section'
}
