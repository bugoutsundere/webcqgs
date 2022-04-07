/**
 * 静态图层编码
 */
export const layerCode = {
  ROUTE: 'ROUTE', // 路线
  MILESTONE_KM: 'MILESTONE_KM', // 千米桩
  MILESTONE_HM: 'MILESTONE_HM', // 百米桩
  SERVICE_AREA: 'SERVICE_AREA', // 服务区
  TOLL_STATION: 'TOLL_STATION', // 收费站
  BRIDGE: 'BRIDGE', // 桥梁
  TUNNEL: 'TUNNEL', // 隧道
  CULVERT: 'CULVERT', // 涵洞
  GANTRY: 'GANTRY', // 龙门架
  CAMERA: 'CAMERA', // 摄像头
  BOARD: 'BOARD', // 情报板
  TRAFFIC: 'TRAFFIC', // 路况
  DYNAMIC_TRAFFIC: 'DYNAMIC_TRAFFIC', // 动态粒子路况
}

/*
 * 事件图层默认配置
 */
export const eventLayerLayout = {
  visibility: 'visible',
  'icon-image': 'event_type_{eventOneType}_{status}',
  'icon-offset': [0, -26],
  'icon-allow-overlap': true, //表示图标被其他图层盖住依然展示
  'text-allow-overlap': true, //表示文本被其他图层盖住依然展示
}
export const eventLayerPaint = null
export const eventLayerFilter = ['!has', 'cluster']

/*
 * 事件聚合图层默认配置
 */
export const eventClusterLayerLayout = {
  visibility: 'visible',
  'icon-image': 'point_cluster_blue',
  'icon-allow-overlap': true,
  'text-allow-overlap': true,
  'text-field': '{point_count}',
  'text-anchor': 'center',
  'text-size': ['case', ['<', ['get', 'point_count'], 10], 20, 16],
}
export const eventClusterLayerPaint = {
  'text-color': '#fff',
}
export const eventClusterLayerFilter = ['has', 'cluster']

/*
 * 作业车图层默认配置
 */
export const workVehicleLayerLayout = {
  visibility: 'visible',
  'icon-image': [
    'match',
    ['get', 'carType'],
    1,
    'work_vehicle_1',
    2,
    'work_vehicle_2',
    3,
    'work_vehicle_3',
    'work_vehicle',
  ],
  'icon-offset': [0, -26],
  'icon-allow-overlap': true,
  'text-allow-overlap': true,
}
export const workVehicleLayerPaint = null
export const workVehicleLayerFilter = null

/*
 * 用户图层默认配置
 */
export const userLayerLayout = {
  visibility: 'visible',
  'icon-image': 'driver',
  'icon-allow-overlap': true,
  'text-allow-overlap': true,
}
export const userLayerPaint = null
export const userLayerFilter = null

/*
 * 巡查点位图层默认配置
 */
export const patrolPointLayerLayout = {
  visibility: 'visible',
  'icon-image': {
    type: 'categorical',
    property: 'pointType',
    stops: [
      ['T', 'point_orange'],
      ['X', 'point_red'],
    ],
    default: 'point_orange',
  },
  'icon-anchor': 'bottom',
  'icon-offset': [0, 2],
  'icon-allow-overlap': true,
  'text-field': {
    type: 'categorical',
    property: 'pointType',
    stops: [
      ['T', '途'],
      ['X', '巡'],
    ],
    default: '途',
  },
  'text-offset': [0, -2],
  'text-allow-overlap': true,
}
export const patrolPointLayerPaint = {
  'text-color': '#fff',
}
export const patrolPointLayerFilter = ['!has', 'cluster']

/*
 * 巡查点位聚合图层默认配置
 */
export const patrolPointClusterLayerLayout = {
  visibility: 'visible',
  'icon-image': 'point_cluster_blue',
  'icon-allow-overlap': true,
  'text-allow-overlap': true,
  'text-field': '{point_count}',
  'text-size': ['case', ['<', ['get', 'point_count'], 10], 20, 16],
}
export const patrolPointClusterLayerPaint = {
  'text-color': '#fff',
}
export const patrolPointClusterLayerFilter = ['has', 'cluster']

/**
 * 作业车轨迹路线图层默认配置
 */
export const workVehicleTraceLayerLayout = {
  'line-join': 'round',
  'line-cap': 'round',
}
export const workVehicleTraceLayerPaint = {
  'line-width': 3,
  'line-color': '#00f',
  'line-opacity': 0.7,
}
export const workVehicleTraceLayerFilter = null

/**
 * 人的轨迹路线图层默认配置
 */
export const userTraceLayerLayout = {
  'line-join': 'round',
  'line-cap': 'round',
}
export const userTraceLayerPaint = {
  'line-width': 3,
  'line-color': '#0f0',
  'line-opacity': 0.7,
}
export const userTraceLayerFilter = null

/*
 * 气象图层默认配置
 */
export const weatherLayerLayout = {
  visibility: 'visible',
  'icon-image': 'weather_{type}_{value}',
  'icon-size': 0.7,
  'icon-offset': [0, 0],
  'icon-allow-overlap': false, //表示图标被其他图层盖住依然展示
  'text-allow-overlap': false, //表示文本被其他图层盖住依然展示
}
export const weatherLayerPaint = null
export const weatherLayerFilter = ['!has', 'cluster']
