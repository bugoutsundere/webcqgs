import { ComWindowTemplate, cameraInfoWindowTemplate } from './utils/template'
import { informationBoardIcon, redCamera, blueCamera } from './images'
import * as images from './images'
import gantryImg from '@/assets/images/mapGantry.png'
import active_gantryImg from '@/assets/images/gantry_active.png'

const { VITE_URI_HMAP_BASE } = import.meta.env

export const LayerNames = {
  COM_POINT: 'COM_POINT',
  /* 专题图层 */
  CURRENT_ROAD_CONDITION: 'CURRENT_ROAD_CONDITION', // 路况图层
  STAKE: 'STAKE', // 桩号
  BRIDGE_CLUSTER: 'BRIDGE_CLUSTER', // 桥梁
  TUNNEL_CLUSTER: 'TUNNEL_CLUSTER', // 隧道
  TOLL_STATION: 'TOLL_STATION', // 收费站
  SERVICE_AREA: 'SERVICE_AREA', // 服务区

  GANTRY_POINT: 'GANTRY_POINT', // 门架

  /* 自定义打点图层 */
  START_AND_END_POINT: 'START_AND_END_POINT_LAYER', // 起止点
  TJ_POINT: 'TJ_POINT_LAYER', // 途经点
  XC_POINT: 'XC_POINT_LAYER', // 巡查点
  EVENT_POINT: 'EVENT_POINT', // 事件点
  USER_TRACE: 'USER_TRACE_LAYER', // 用户轨迹
  VEHICLE_TRACE: 'VEHICLE_TRACE_LAYER', // 车辆轨迹
  USER_REALTIME_TRACE: 'USER_REALTIME_TRACE_LAYER', // 用户实时轨迹
  VEHICLE_REALTIME_TRACE: 'VEHICLE_REALTIME_TRACE_LAYER', // 车辆实时轨迹
  WEATHER_POINT: 'WEATHER_POINT', // 气象点
  GIS_WEATHER_POINT: 'GIS_WEATHER_POINT', // gis气象点
  DEVICE_POINT: 'DEVICE_POINT', // 设备
  CAMERA_POINT: 'CAMERA_POINT', // 摄像头
  CONSTRUCTION_POINT: 'CONSTRUCTION_POINT', // 施工信息点
  INFOMATION_BOARD_POINT: 'INFOMATION_BOARD_POINT', // 情报板信息
  TARGET_POINT: 'TARGET_POINT', // 任务目标地点
  TRAFFIC_CONTROL_POINT: 'TRAFFIC_CONTROL_POINT', // 有交通管控的收费站
}

export const PointTypes: any = {
  COM_POINT: 'COM_POINT',
  GANTRY_POINT: 'GANTRY_POINT', // 门架
  START_POINT: 'START_POINT', // 起点
  END_POINT: 'END_POINT', // 终点
  TJ_POINT: 'TJ_POINT', // 途经点
  XC_POINT: 'XC_POINT', // 巡查点
  EVENT_POINT: 'EVENT_POINT', // 事件点
  CMG_POINT: 'CMG_POINT', // 待确认事件点
  DHG_POINT: 'DHG_POINT', // 待分派事件点
  DLG_POINT: 'DLG_POINT', // 待处理事件点
  USER_TRACE_POINT: 'USER_TRACE_POINT', // 用户轨迹
  VEHICLE_TRACE_POINT: 'VEHICLE_TRACE_POINT', // 车辆轨迹
  USER_REALTIME_TRACE_POINT: 'USER_REALTIME_TRACE_POINT', // 用户实时轨迹
  VEHICLE_REALTIME_TRACE_POINT: 'VEHICLE_REALTIME_TRACE_POINT', // 车辆实时轨迹
  DEVICE_POINT: 'DEVICE_POINT', // 设备
  CAMERA_POINT: 'CAMERA_POINT', // 摄像头
  CONSTRUCTION_POINT: 'CONSTRUCTION_POINT', // 施工信息点
  INFOMATION_BOARD_POINT: 'INFOMATION_BOARD_POINT', // 情报板信息
  GIS_WEATHER_POINT: 'GIS_WEATHER_POINT', // gis气象点
  WEATHER_POINT: 'WEATHER_POINT', // 气象点
  BRIDGE_POINT: 'BRIDGE_POINT', // 桥梁点
  TUNNEL_POINT: 'TUNNEL_POINT', // 隧道点
  TARGET_POINT: 'TARGET_POINT', // 任务目标地点
  TRAFFIC_CONTROL_POINT: 'TRAFFIC_CONTROL_POINT', // 有交通管控的收费站
}

export const pointStyleOptions = {
  image: {
    type: 'icon',
    image: {
      imageSrc: '',
    },
  },
  text: {
    placement: 'point',
    text: '',
    textFont: '500 14px sans-serif',
    textFill: {
      fillColor: '#fff',
    },
    textOffsetX: 7,
    textOffsetY: -25,
  },
}

export const PointConfigs: any = {
  COM_POINT: {
    type: PointTypes.COM_POINT,
    typeName: '公司',
    layerName: LayerNames.COM_POINT,
    lngKey: 'LON',
    latKey: 'LAT',
    trigger: 'select',
    single: false,
    pointInfoWindowOptions: {
      className: 'comDefault',
      offSetY: 0,
    },
    infoWindowTemplate: ComWindowTemplate,
  },
  INFOMATION_BOARD_POINT: {
    type: PointTypes.INFOMATION_BOARD_POINT,
    typeName: '情报板',
    layerName: LayerNames.INFOMATION_BOARD_POINT,
    pointInfoWindowOptions: {
      offSetY: -50,
    },
    styleOptionsMap: {
      default: {
        image: {
          image: {
            imageSrc: informationBoardIcon,
          },
        },
      },
    },
    autofocus: true,
    trigger: 'select',
    // infoWindowTemplate: informationBoardPointInfoWindowTemplate,
    lngKey: 'positionX',
    latKey: 'positionY',
  },
  GANTRY_POINT: {
    type: PointTypes.GANTRY_POINT,
    typeName: '门架',
    layerName: LayerNames.GANTRY_POINT,
    lngKey: 'gantryLon',
    latKey: 'gantryLat',
    trigger: 'select',
    styleOptionsMap: {
      default: {
        image: {
          image: {
            imageSrc: gantryImg,
          },
        },
      },
      mouseover: {
        image: {
          image: {
            imageSrc: active_gantryImg,
          },
        },
      },
    },
  },
  CAMERA_POINT: {
    type: PointTypes.CAMERA_POINT,
    typeName: '摄像头',
    layerName: LayerNames.CAMERA_POINT,
    lngKey: 'positionX',
    latKey: 'positionY',
    styleOptionsMap: {
      default: {
        image: {
          image: {
            imageSrc: redCamera,
            imageAnchor: [0.5, 1],
          },
        },
      },
      select: {
        image: {
          image: {
            imageSrc: blueCamera,
          },
        },
      },
    },
    pointInfoWindowOptions: {
      className: 'defaultInfoWindow',
      offSetY: -60,
    },
    // autofocus: true,
    trigger: 'select',
    infoWindowTemplate: cameraInfoWindowTemplate,
  },
  // 事件点
  EVENT_POINT: {
    type: PointTypes.EVENT_POINT,
    typeName: '事件',
    layerName: LayerNames.EVENT_POINT,
    trigger: 'select',
    pointInfoWindowOptions: {
      offSetY: -60,
    },
    styleOptionsMap: {
      default: (pointConfig: any, pointInfo: any) => {
        const { status, eventOneType } = pointInfo
        let imgName
        switch (eventOneType) {
          case '1-CLGZ':
            // 车辆故障
            imgName = 'event-type-cheliangguzhang'
            break
          case '1-DLSG':
            // 道路施工
            imgName = 'event-type-daolushigong'
            break
          case '1-JTQX':
            // 交通气象（恶劣天气）
            imgName = 'event-type-elietianqi'
            break
          case '1-JTSG':
            // 交通事故
            imgName = 'event-type-jiaotongshigu'
            break
          case '1-LMZK':
            // 路面状况
            imgName = 'event-type-lumianzhuangkuang'
            break
          case '1-SFSJ':
            // 收费事件
            imgName = 'event-type-shoufeishijian'
            break
          case '1-HD':
            // 活动
            imgName = 'event-type-zhongdahuodong'
            break
          case '1-ZDSJ':
            // 重大事件
            imgName = 'event-type-zhongdashijian'
            break
          case '1-JTGZ':
            // 交通管制
            imgName = 'event-type-jiaotongguanzhi'
            break
          default:
            imgName = 'event-type-qita'
            break
        }
        if (status === 1) {
          imgName += '-red'
        } else if (status === 2) {
          imgName += '-yellow'
        } else if (status === 3) {
          imgName += '-blue'
        }
        imgName += '.png'
        return {
          image: {
            image: {
              imageSrc: require(`./images/${imgName}`),
              imageAnchor: [0.5, 0.8],
              // scale: 0.5,
              // offset: [15, 1.5],
            },
          },
        }
      },
    },
    // infoWindowTemplate: eventPointInfoWindowTemplate,
  },
}

// 专题图层配置
export const SubjectLayerConfigs: any = {
  // 路况图层
  CURRENT_ROAD_CONDITION: {
    layerName: LayerNames.CURRENT_ROAD_CONDITION,
    layerType: 'TileWMS',
    isDefault: true,
    layerUrl: `${VITE_URI_HMAP_BASE}/zsxz_traffic/wms`,
    layers: 'zsxz_traffic',
    tiled: true,
    srs: 'EPSG:4326',
    version: '1.1.0',
    addLayer: true,
    create: true,
    // opacity: 0.5,
    visible: false,
    zIndex: 2,
  },
  // 桩号
  STAKE: {
    layerName: LayerNames.STAKE,
    layerType: 'TileWMS',
    layerUrl: `${VITE_URI_HMAP_BASE}/wms`,
    layers: ['zsxz_map:zsxz_glz'],
    projection: 'EPSG:4326',
    viewparams: 'lx:10010110',
    srs: 'EPSG:4326',
    tiled: true,
    version: '1.1.0',
    tiledsorrigin: '106.571857, 27.43349076',
    isDefault: true,
    create: true,
    addLayer: true,
    visible: true,
    zIndex: 3,
  },
  // 桥梁
  BRIDGE_CLUSTER: {
    layerName: LayerNames.BRIDGE_CLUSTER,
    layerType: 'TileWMS',
    layerUrl: `${VITE_URI_HMAP_BASE}/wms`,
    layers: 'zsxz_map:gis_ql',
    projection: 'EPSG:4326',
    viewparams: 'lx:10010110',
    srs: 'EPSG:4326',
    tiled: true,
    version: '1.1.0',
    tiledsorrigin: '31.7332203148665,106.041351666347',
    isDefault: true,
    create: true,
    addLayer: true,
    visible: true,
    zIndex: 4,
  },
  // 隧道
  TUNNEL_CLUSTER: {
    layerName: LayerNames.TUNNEL_CLUSTER,
    layerType: 'TileWMS',
    layerUrl: `${VITE_URI_HMAP_BASE}/wms`,
    layers: 'zsxz_map:zsxz_zssuidao',
    projection: 'EPSG:4326',
    viewparams: 'lx:10010110',
    srs: 'EPSG:4326',
    tiled: true,
    version: '1.1.0',
    tiledsorrigin: '31.7332203148665,106.041351666347',
    isDefault: true,
    create: true,
    addLayer: true,
    visible: true,
    zIndex: 6,
  },
  // 收费站
  TOLL_STATION: {
    layerName: LayerNames.TOLL_STATION,
    layerType: 'TileWMS',
    layerUrl: `${VITE_URI_HMAP_BASE}/wms`,
    layers: 'zsxz_map:zsxz_zsshoufeizhan',
    projection: 'EPSG:4326',
    viewparams: 'lx:10010110',
    srs: 'EPSG:4326',
    tiled: true,
    version: '1.1.0',
    tiledsorrigin: '31.7332203148665,106.041351666347',
    isDefault: true,
    create: true,
    addLayer: true,
    visible: true,
    zIndex: 7,
  },
  // 服务区
  SERVICE_AREA: {
    layerName: LayerNames.SERVICE_AREA,
    layerType: 'TileWMS',
    layerUrl: `${VITE_URI_HMAP_BASE}/wms`,
    layers: 'zsxz_map:zsxz_zsfuwuqu',
    projection: 'EPSG:4326',
    viewparams: 'lx:10010110',
    srs: 'EPSG:4326',
    tiled: true,
    version: '1.1.0',
    tiledsorrigin: '31.7332203148665,106.041351666347',
    isDefault: true,
    create: true,
    addLayer: true,
    visible: true,
    zIndex: 8,
  },
}
