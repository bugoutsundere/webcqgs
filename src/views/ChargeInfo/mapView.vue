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

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const structList = computed(() => store.state.charge?.structList)
const activeFeatureId = computed(() => store.state.charge?.activeFeatureId)
const activeFeature = computed(() => store.getters.activeFeature)

onMounted(async () => {
  await nextTick()
  await createMap()
})

const container: any = ref(null)
const map: any = ref(null)

let Map: any = null

const statStyle = {
  zIndex: 1,
  image: {
    type: 'icon',
    image: {
      imageSrc: statImg,
    },
  },
}
const statStyle_active = {
  zIndex: 1000,
  image: {
    type: 'icon',
    image: {
      imageSrc: active_statImg,
    },
  },
}
const gantryStyle = {
  zIndex: 1,
  image: {
    type: 'icon',
    image: {
      imageSrc: gantryImg,
    },
  },
}
const gantryStyle_active = {
  zIndex: 1000,
  image: {
    type: 'icon',
    image: {
      imageSrc: active_gantryImg,
    },
  },
}

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
    initPointEvent()
    resolve('地图初始化完成')
  })
}

const initPointEvent = () => {
  // 要素的鼠标移出事件
  Map && Map.on('feature:onmouseout', onPointMouseOut)

  // 要素选中事件
  Map && Map.on('feature:onselect', onPointSelect)
}

const highlightActiveFeature = (zoom = true) => {
  if (!activeFeature.value) {
    return
  }
  const { type, orgCode } = activeFeature.value
  const com = comInfo.find((e: any) => e.code == orgCode)
  if (type === 'gantry') {
    const { gantryLat, gantryLon } = activeFeature.value
    if (gantryLat && gantryLon) {
      zoom && zoomAndCenterToFeature([gantryLon, gantryLat], (com?.zoom || 0) + 1)
      highLightPoint(activeFeature.value, [gantryLon, gantryLat])
    }
  } else if (type === 'station') {
    const { statLat, statLon } = activeFeature.value
    if (statLat && statLon) {
      zoom && zoomAndCenterToFeature([statLon, statLat], (com?.zoom || 0) + 1)
      highLightPoint(activeFeature.value, [statLon, statLat])
    }
  }
}

const onPointMouseOut = (evt: any) => {
  unHighLightPoint(evt.value.c)
  if (activeCom.value !== 'list') {
    highlightActiveFeature(false)
  }
}
const onPointSelect = (evt: any) => {
  if (activeFeatureId.value === evt.value.c) {
    store.commit('charge/changeActiveFeatureId', '')
  } else {
    let property = evt.value.getProperties()
    store.commit('charge/changeActiveFeatureId', property.id)
  }
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

const removeOldPoints = () => {
  if (Map) {
    Map.removeFeatureByLayerName('default')
  }
}

const highLightPoint = (point: any, center: any) => {
  if (!point) {
    return
  }
  Map.highLightFeature(point.id)
  let styleCfg = point.type === 'station' ? statStyle_active : gantryStyle_active
  const style = new window.HMap.Style(styleCfg)
  const feature = Map.getFeatureById(point.id)
  if (!feature) {
    return
  }
  feature.setStyle(style)
  openWindow(center)
}

const unHighLightPoint = (pointId: string) => {
  if (!pointId) {
    return
  }
  Map.unHighLightFeature(pointId)
  closeWindow()
}

let popWidow: any = null

const winContent = computed(() => {
  return `<div class="gantryPop ${activeFeature.value.type === 'station' ? 'stat' : 'gantry'}">${
    activeFeature.value[activeFeature.value.type === 'station' ? 'statName' : 'gantryName']
  }</div>`
})

const openWindow = (center: any) => {
  closeWindow()
  popWidow = new window.HMap.Popover(Map.getMap(), {
    showCloser: false,
    showMarkFeature: false,
    showMinimize: false,
    offset: [0, -55],
    layerName: 'default',
    className: `gantryPopper`,
  })
  Map.addOverlay(popWidow)
  let container = document.createElement('div')
  container.innerHTML = winContent.value
  popWidow.show(center, container)
}

const closeWindow = () => {
  if (popWidow && Map) {
    Map.removeOverlay(popWidow)
  }
  popWidow = null
}

const addPoints = (list: Array<any>, style: any) => {
  if (!Map) {
    return
  }

  list.forEach((e: any) => {
    Map.addPoint(
      {
        attributes: {
          ...e,
        },
        geometry: `POINT (${e.lon} ${e.lat})`,
        geometryType: 'Point',
      },
      {
        layerName: 'default',
        style: style,
      }
    )
  })
}

watch(
  activeCom,
  () => {
    removeOldPoints()
    zoomAndCenterToFeature(activeCenter.value, activeZoom.value)
    if (activeCom.value === 'list') {
      return
    }
    const comStructs = structList.value?.filter((e: any) => e.orgCode === activeCom.value)
    const gantryList: any = comStructs
      ?.filter((e: any) => e.gantryLat && e.gantryLon)
      ?.map((e: any) => ({
        ...e,
        lat: e.gantryLat,
        lon: e.gantryLon,
        id: e.gantryCode,
      }))
    const statList: any = comStructs
      ?.filter((e: any) => e.statLon && e.statLat && e.statId)
      ?.map((e: any) => ({
        ...e,
        lat: e.statLat,
        lon: e.statLon,
        id: e.statId,
      }))
    addPoints(gantryList, gantryStyle)
    addPoints(statList, statStyle)
  },
  {
    immediate: true,
  }
)
watch(activeFeature, (newVal, oldVal) => {
  if (oldVal) {
    unHighLightPoint(oldVal.id)
  }
  if (activeFeature.value) {
    highlightActiveFeature()
  } else {
    zoomAndCenterToFeature(activeCenter.value, activeZoom.value)
  }
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
