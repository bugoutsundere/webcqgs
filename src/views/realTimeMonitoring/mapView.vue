<template>
  <div ref="container" class="map-container">
    <div ref="map" class="hmap"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { comInfo, allComInfo } from '@/store/state'
import statImg from '@/assets/images/mapStation.png'
import gantryImg from '@/assets/images/mapGantry.png'
import active_statImg from '@/assets/images/stat_active.png'
import active_gantryImg from '@/assets/images/gantry_active.png'
import { PointConfigs, SubjectLayerConfigs, LayerNames, PointTypes, pointStyleOptions } from './config'
import { merge, isFunction } from 'lodash'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const structList = computed(() => store.state.charge?.structList)
const activeFeatureId = computed(() => store.state.charge?.activeFeatureId)
const activeFeature = computed(() => store.getters.activeFeature)

const activeCenter = computed(() => {
  if (activeCom.value === 'list') {
    return allComInfo.center
  }
  const com = comInfo.find((e: any) => e.code == activeCom.value)
  return com?.center
})

const activeZoom = computed(() => {
  if (activeCom.value === 'list') {
    return allComInfo.zoom
  }
  const com = comInfo.find((e: any) => e.code == activeCom.value)
  return com?.zoom
})

onMounted(async () => {
  await nextTick()
  await createMap()
  MapInited.value = true
})
const container: any = ref(null)
const map: any = ref(null)
const highlightedPointId = ref('')

let Map: any = null
const MapInited = ref(false)

const createMap = async () => {
  return new Promise((resolve, reject) => {
    if (!window.HMap) {
      reject(new Error('不能创建地图服务，请刷新页面重试，或联系管理员!'))
    }
    Map = new window.HMap(map.value, {
      controls: {
        rotate: false,
        zoom: false,
      },
      view: {
        projection: 'EPSG:4326',
        minZoom: 5,
        maxZoom: 20,
        zoom: activeZoom.value,
        center: activeCenter.value,
      },
      maxExtent: [],
      baseLayers: [
        // 新智服务器geoServer wmts地图服务
        {
          layerName: 'HD_BASE_MAP',
          layerType: 'TileWMTS',
          levels: 19,
          isDefault: true,
          layerUrl: `${import.meta.env.VITE_URI_HMAP_BASE}/gwc/service/wmts?`,
          layer: 'zsxz_map',
          opacity: 1,
          matrixSet: 'EPSG:4326',
          projection: 'EPSG:4326',
          visible: true,
          format: 'image/png',
          version: '1.0.0',
          addLayer: true,
          create: true,
        },
      ],
    })
    resolve('地图初始化完成')
  })
}

const zoomAndCenterToFeature = (center: any, zoom: any) => {
  if (!center[0] || !Map) {
    return
  }
  Map.getView().animate({
    center: center || activeCenter.value,
    zoom: zoom || activeZoom.value,
    duration: 500,
    easing: window.ol.easing.easeIn,
  })
}

const comList = computed(() => {
  return comInfo
    .map(e => {
      return {
        name: e.name,
        LAT: e.center[1],
        LON: e.center[0],
      }
    })
})


const getLayerByLayerName = (layerName: string) => Map?.getLayerByLayerName(layerName)

const showLayerByLayerName = (layerName: string) => {
  // 如果图层存在，则显示对应图层,否则创建图层
  if (getLayerByLayerName(layerName)) {
    toggleLayerByLayerName(layerName, true)
  } else {
    createLayerByLayerName(layerName)
  }
}

// 根据图层名称创建对应图层（图层可能是专题图层或者自定义打点图层）
const createLayerByLayerName = (layerName: string) => {
  const isSubjectLayer = !!SubjectLayerConfigs[layerName] // 是否是专题图层，调用不同图层创建方式

  isSubjectLayer
    ? createSubjectLayerByLayerName(layerName)
    : createMarkPointLayerByLayerName(layerName)
}

// 勾选的图层
const checkedLayers: any = computed({
  get: () => store.state.road?.checkedLayers,
  set: (val: any) => store.commit('road/setCheckedLayers', val)
})
const initialLayers: any = [
  'TOLL_STATION',
  'BRIDGE_CLUSTER',
  'TUNNEL_CLUSTER',
  'SERVICE_AREA',
  'EVENT_POINT',
  'VEHICLE_REALTIME_TRACE_POINT',
]

let informationWindowList: any = []

// 切换要素点信息弹窗
const togglePointInfoWindow = (pointConfig: any, pointInfo: any, coord: any) => {
  if (!(pointConfig && pointInfo)) {
    return
  }
  const pointId = getPointId(pointConfig, pointInfo)
  const informationWindow = informationWindowList.find((item: any) => item.pointId === pointId)
  informationWindow
    ? closePointInfoWindow(pointConfig, pointInfo)
    : openPointInfoWindow(pointConfig, pointInfo, coord)
}

const closePointInfoWindow = (pointConfig: any, pointInfo: any) => {
  if (!(pointConfig && pointInfo)) {
    return
  }
  const pointId = getPointId(pointConfig, pointInfo)
  const informationWindowIndex = informationWindowList.findIndex(
    (item: any) => item.pointId === pointId
  )
  if (informationWindowIndex === -1) {
    return
  }
  highlightedPointId.value = ''

  unHighLightPoint(pointId)

  let { pointInfoWindow, template } = informationWindowList[informationWindowIndex]

  pointInfoWindow && pointInfoWindow.hide()

  // 销毁组件并移除容器和弹窗句柄，防止内存泄漏
  // if (template instanceof Vue) {
  //   template.$destroy()
  // }

  pointInfoWindow.container.parentNode &&
    pointInfoWindow.container.parentNode.removeChild(pointInfoWindow.container)

  pointInfoWindow = null

  informationWindowList.splice(informationWindowIndex, 1) // 从列表中移除
}

const openPointInfoWindow = (pointConfig: any, pointInfo: any, coord: any) => {
  if (!(pointConfig && pointInfo)) {
    return
  }
  const {
    layerName,
    pointInfoWindowOptions = {},
    infoWindowTemplate,
    trigger = 'mouseover',
    lngKey = 'lng',
    latKey = 'lat',
    single = true,
  } = pointConfig

  if (single) {
    closeAllPointInfoWindow()
  } else if (trigger === 'mouseover') {
    closePointInfoWindowByTrigger(trigger)
  }

  const pointId = getPointId(pointConfig, pointInfo)

  const pointInfoWindow = initInfoWindow(pointInfoWindowOptions)
  const container = document.createElement('div')
  let text = pointInfo.deviceAlias || `${pointInfo.eventOneTypeText}` || '无模板'
  const template = (infoWindowTemplate && infoWindowTemplate(pointConfig, pointInfo)) || text
  const lng = pointInfo[lngKey]
  const lat = pointInfo[latKey]

  coord = coord || [lng, lat]

  if (!(coord[0] && coord[1] && template)) {
    return
  }

  if (template) {
    pointInfoWindow.show(coord, container) // 先将div插入到文档中
    const instance = template.mount(container)
    pointInfoWindow.updateSize() // 内部API，文档上没有,更新容器样式，修复定位问题
  } else {
    container.innerHTML = template
    pointInfoWindow.show(coord, container)
  }

  // 保存信息窗体句柄，并按照trigger layername pointId 三级进行分类以后续操作进行引用
  informationWindowList.push({
    layerName,
    pointId,
    trigger,
    pointInfoWindow,
    container,
    template,
    // 保留pointConfig以及pointInfo方便后续扩展
    pointConfig,
    pointInfo,
  })
}

const initInfoWindow = (pointInfoWindowOptions: any = {}) => {
  if (!Map) {
    return
  }
  const pointInfoWindow = new window.HMap.Popover(Map.getMap(), {
    showCloser: false,
    showMarkFeature: false,
    showMinimize: false,
    offset: [0, pointInfoWindowOptions.offSetY || -40],
    ...pointInfoWindowOptions,
    className: `${pointInfoWindowOptions.className || 'gantryPop'}`, // 保留原有className：hmap-js-popup
  })

  listenPointInfoWindowContainerClick(pointInfoWindow)

  Map.addOverlay(pointInfoWindow)
  return pointInfoWindow
}

// 监听弹窗容器点击事件，切换层级
const listenPointInfoWindowContainerClick = (pointInfoWindow: any) => {
  pointInfoWindow.container.addEventListener('click', function() {
    informationWindowList.forEach((item: any) => {
      item.pointInfoWindow.container.style.zIndex = 'auto'
    })
  })
}

const closeAllPointInfoWindow = () => {
  if (!(informationWindowList?.length > 0)) {
    return
  }

  informationWindowList.forEach((item: any) => {
    const { pointConfig, pointInfo } = item
    closePointInfoWindow(pointConfig, pointInfo)
  })
}

const closePointInfoWindowByTrigger = (trigger = 'mouseover') => {
  // 如果是mouseover，则在打开前先关闭其他mouseover打开的弹窗
  informationWindowList.forEach((item: any) => {
    const { pointConfig, pointInfo } = item
    item.trigger === trigger && closePointInfoWindow(pointConfig, pointInfo)
  })
}

const unHighLightPoint = (pointId: string) => {
  if (!pointId || !Map) {
    return
  }
  let point = Map.getFeatureById(highlightedPointId.value)
  if (point) {
    let oldP = point.getProperties()
    oldP.pointConfig._type = 'default'
  }
  Map.unHighLightFeature(pointId)
}

const toggleLayerByLayerName = (layerName: string, visible: boolean) => {
  const layer = getLayerByLayerName(layerName)
  if (!layer) {
    return
  }
  const toggleVisible = visible === undefined ? !layer.getVisible() : visible
  layer.setVisible(toggleVisible)
}

const createSubjectLayerByLayerName = (layerName: string) => {
  const subjectLayerConfig = SubjectLayerConfigs[layerName]
  Map && Map.createTileWMSLayer(layerName, subjectLayerConfig)
}

const createMarkPointLayerByLayerName = async (layerName: string) => {
  // const storeState = $store.state
  const pointConfig = PointConfigs[layerName]
  // console.log(layerName)

  switch (layerName) {
    case LayerNames.CAMERA_POINT:
      await store.dispatch('road/getAllCameras')
      markPoints(pointConfig, store.state.road?.camaras || [])
      break
    case LayerNames.GANTRY_POINT:
      await store.dispatch('road/getGantryBase')
      markPoints(pointConfig, store.state.road?.gantryBase || [])
      break
    case LayerNames.INFOMATION_BOARD_POINT:
      await store.dispatch('road/getAllInformationBoards')
      markPoints(pointConfig, store.state.road?.informationBoards || [])
      break
    // case LayerNames.CONSTRUCTION_POINT:
    //   await mutation.getAllConstructions()
    //   markPoints(pointConfig, state.constructions)
    //   break
    case PointTypes.EVENT_POINT:
    await store.dispatch('road/getEvtList')
      markPoints(pointConfig, store.state.road?.evtList || [])
      break
    case PointTypes.COM_POINT:
      markPoints(pointConfig, comList.value)
      break
    case PointTypes.VEHICLE_REALTIME_TRACE_POINT:
      // getAllCarAndShow()
      break
    case PointTypes.USER_REALTIME_TRACE_POINT:
      // showAllUserRealtimeTrace()
      break

    default:
      return
  }
}

const markPoints = (pointConfig: any, pointInfos: Array<any>) => {
  if (!pointConfig || !pointInfos || pointInfos.length < 1) {
    return
  }

  pointInfos.forEach((pointInfo: any) => {
    markPoint(pointConfig, pointInfo)
  })
}

const markPoint = (pointConfig: any, pointInfo: any) => {

  if (!pointConfig || !pointInfo) {
    return
  }

  const { layerName, lngKey = 'lng', latKey = 'lat' } = pointConfig

  const lng = pointInfo[lngKey]
  const lat = pointInfo[latKey]

  const pointId = getPointId(pointConfig, pointInfo)

  if (!pointId || !lng || !lat) {
    return
  }
  const point = Map.getFeatureById(pointId)

  if (point) {
    Map.setPointGeometry(point, `POINT (${lng} ${lat})`)
  } else {
    const mergedStyleOptions = getMergedPointStyleOptions(pointConfig, pointInfo)
    Map.addPoint(
      {
        // 属性格式
        attributes: {
          id: pointId,
          pointConfig,
          pointInfo,
        },
        geometry: `POINT (${lng} ${lat})`,
      },
      {
        layerName,
        // zoomToExtent: true,
        style: mergedStyleOptions,
      }
    )
  }
}

const getMergedPointStyleOptions = (pointConfig: any, pointInfo: any) => {
  if (!pointConfig) {
    return pointStyleOptions
  }

  const getStyleOptions = (styleOptions: any) =>
    isFunction(styleOptions) ? styleOptions(pointConfig, pointInfo) : styleOptions

  const { _type = 'default', styleOptionsMap } = pointConfig

  const mergeStyleOptions = JSON.parse(JSON.stringify(pointStyleOptions)) // 默认为初始值

  // 如果有对应类型的样式，则进行合并。
  // _type 为 default时最终生成的配置为：初始配置(pointStyleOptions) 与 default配置 的合并
  // _type 为 其他时最终生成的配置为：_type为default时的最终配置 与 对应配置的合并
  if (styleOptionsMap && styleOptionsMap[_type]) {
    // 如果当前不是default配置，并且存在default配置，先合并default的配置
    if (_type !== 'default' && styleOptionsMap['default']) {
      const defaultOptions = getStyleOptions(styleOptionsMap['default'])
      merge(mergeStyleOptions, defaultOptions)
    }

    // 合并当前配置
    const styleOptions = getStyleOptions(styleOptionsMap[_type])
    merge(mergeStyleOptions, styleOptions)
  }

  return mergeStyleOptions
}

const getPointId = (pointConfig: any, pointInfo: any) => {
  if (!pointConfig || !pointInfo) {
    return ''
  }
  let id =
    pointInfo.pointId ||
    pointInfo.id ||
    pointInfo.identityCode ||
    pointInfo.gantryCode ||
    pointInfo.name
  return generatePointId(pointConfig, id)
}

const generatePointId = (pointConfig: any, pointId: any) => {
  return `${pointConfig.layerName}.${pointConfig.type}.${pointId}`
}

const hideLayerByLayerName = (layerName: string) => {
  toggleLayerByLayerName(layerName, false)
  switch (layerName) {
    case PointTypes.VEHICLE_REALTIME_TRACE_POINT:
      // this._initTrace(2)
      break
    default:
      break
  }
}

const closePointInfoWindowByLayerName = (layerName: string) => {
  const list = [...informationWindowList]
  list.forEach((item: any) => {
    const { pointConfig, pointInfo } = item
    closePointInfoWindow(pointConfig, pointInfo)
  })
}

watch(
  [activeCom, MapInited],
  async () => {
    if (!MapInited.value) {
      return
    }
    await nextTick()
    zoomAndCenterToFeature(activeCenter.value, activeZoom.value)
    if (activeCom.value === 'list') {
      // 添加公司立牌
      const pointConfig = PointConfigs['COM_POINT']
      comList.value.forEach((e: any) => {
        togglePointInfoWindow(pointConfig, e, [e.LON, e.LAT])
      })
      checkedLayers.value = []
    } else {
      closePointInfoWindowByLayerName('COM_POINT')
      if (!(checkedLayers.value?.length > 0)) {
        checkedLayers.value = JSON.parse(JSON.stringify(initialLayers))
      }
    }
  },
  {
    immediate: true,
  }
)

let oldLayerList: any = []
watch([checkedLayers, MapInited], async (newval, oldval) => {
  if (!MapInited.value) {
    return
  }
  await nextTick()
  const newLayers = newval[0]
  const showCheckedLayers = newLayers.filter((item: any) => !oldLayerList.includes(item)) // 新增勾选的图层名称
  const hideCheckedLayers = oldLayerList.filter((item: any) => !newLayers.includes(item)) // 移除勾选的图层名称
  showCheckedLayers.map((layerName: string) => showLayerByLayerName(layerName)) // 创建"新增勾选的图层名称"对应的图层
  hideCheckedLayers.map((layerName: string) => {
    hideLayerByLayerName(layerName) // 隐藏 “移除勾选的图层名称” 对应的图层
    closePointInfoWindowByLayerName(layerName) // 关闭对应图层弹窗
  })
  oldLayerList = JSON.parse(JSON.stringify(newLayers))
}, {
  immediate: true,
  deep: true
})
</script>

<style lang="postcss" scoped>
.map-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  & .hmap {
    width: 100%;
    height: 100%;
    display: flex;
  }
}
</style>
