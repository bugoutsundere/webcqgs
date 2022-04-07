<template>
  <div>
    <BaseInfoMoudle title="基础设施统计(数量)" :moduleList="moduleList" :activeModule="activeModule" :imgList="imgList" :data="data" />
  </div>
</template>

<script lang="ts" setup>
import { genConfig } from '@/utils/request';
import { useRequest } from 'vue-request';
import { computed, defineProps, watch, reactive } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { baseStructInfo } from '@/store/state';
import { formatThousand } from '@/utils/util';
import BaseInfoMoudle from '@/components/baseModule/BaseInfoModule.vue';
import stat from '@/assets/images/baseStruct/stat.png';
import statAct from '@/assets/images/baseStruct/stat-active.png';
import area from '@/assets/images/baseStruct/area.png';
import areaAct from '@/assets/images/baseStruct/area-active.png';
import gantry from '@/assets/images/baseStruct/gantry.png';
import gantryAct from '@/assets/images/baseStruct/gantry-active.png';
import brg from '@/assets/images/baseStruct/brg.png';
import brgAct from '@/assets/images/baseStruct/brg-active.png';
import tunnel from '@/assets/images/baseStruct/tunnel.png';
import tunnelAct from '@/assets/images/baseStruct/tunnel-active.png';
import route from '@/assets/images/baseStruct/route.png';
import routeAct from '@/assets/images/baseStruct/route-active.png';
// import img4 from '@/assets/4.png'
import * as businessApi from '@/api/businessOverview';

const moduleList = reactive([
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
]);
const imgList = reactive({
  stat: stat,
  statAct: statAct,
  area: area,
  areaAct: areaAct,
  gantry: gantry,
  gantryAct: gantryAct,
  brg: brg,
  brgAct: brgAct,
  tunnel: tunnel,
  tunnelAct: tunnelAct,
  route: route,
  routeAct: routeAct,
});

const props = defineProps({
  // 展示模块列表(格式:[{name:'模块名'},{code:'模块唯一标记'},{key:'data的Key值'}])
  activeMoudle: {
    type: Object,
    default() {
      return { code: '' };
    },
  },
});

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);
const bsMeta = computed(() => store.getters.bsMeta);

const activeBaseStruct = computed({
  get: () => store.state.activeBaseStruct,
  set(val: string) {
    store.commit('changeBaseStruct', val);
  },
});
// const { data, loading, error, refresh } = useRequest<any>(() =>
//   genConfig(
//     `/http-server-yygl/publish/jsc/baseStruct${
//       activeCom.value !== 'list' ? '?com=' + activeCom.value : ''
//     }`
//   )
// );
const getValue = (value: any, key: any) => {
  const result = value && (value as Array<any>)[0] && (value as Array<any>)[0][key];
  return result;
};
const stationCount = useRequest<any>(() => businessApi.getStationCount(0));
const serviceAreaCount = useRequest<any>(() => businessApi.getServiceAreaCount(0));
const tunnelCount = useRequest<any>(() => businessApi.getTunnelCount(0, 0));
const bridgeCount = useRequest<any>(() => businessApi.getBridgeCount(0, 0));
const summaryGateorlane = useRequest<any>(() => businessApi.getSummarygateorlane(0));
const data = computed(() => {
  const stationCountValue = stationCount.data.value?.msgContent;
  const serviceAreaCountValue = serviceAreaCount.data.value?.msgContent;
  const tunnelCountValue = tunnelCount.data.value?.msgContent;
  const bridgeCountValue = bridgeCount.data.value?.msgContent;
  const summaryGateorlaneValue = summaryGateorlane.data.value?.msgContent;
  const result = {
    tollStatNums: getValue(stationCountValue, 'stationCount'),
    serviceStatNums: getValue(serviceAreaCountValue, 'areaCount'),
    tunnelCount: getValue(tunnelCountValue, 'tunnelCount'),
    bridgeCount: getValue(bridgeCountValue, 'bridgeCount'),
    gantry: getValue(summaryGateorlaneValue, 'gatesummarysum'),
    lanesSum: getValue(summaryGateorlaneValue, 'lanessum'),
  };
  return result;
});
const tunnelTypeData = useRequest<any>(() => businessApi.getTunnelCount(0, 1));
const bridgeTypeData = useRequest<any>(() => businessApi.getBridgeCount(0, 1));
// 下标数据
const childrenData = computed(() => {
  const tunnelTypeDataValue = tunnelTypeData.data.value?.msgContent;
  const bridgeTypeDataValue = bridgeTypeData.data.value?.msgContent;
  const summaryGateorlaneValue = summaryGateorlane.data.value?.msgContent;
  const bridgeCount = new Array();
  const tunnelCount = new Array();
  const lanesCount = [
    { type: 'ETC', count: getValue(summaryGateorlaneValue, 'etclanessum') },
    { type: '混合车道', count: getValue(summaryGateorlaneValue, 'mixedlanessum') },
  ];
  tunnelTypeDataValue &&
    (tunnelTypeDataValue as Array<any>).forEach((item: any) => {
      tunnelCount.push({ count: item.tunnelCount, type: item.tunnelType });
    });
  bridgeTypeDataValue &&
    (bridgeTypeDataValue as Array<any>).forEach((item: any) => {
      bridgeCount.push({ count: item.bridgeCount, type: item.bridgeType });
    });
  return {
    tunnelCount: tunnelCount,
    bridgeCount: bridgeCount,
    lanesSum: lanesCount,
  };
});

// watch(activeCom, refresh);

// const arr = computed(() => {
//   const msgContent = data.value?.msgContent;
//   const result = msgContent && (msgContent as Array<any>)[0];
//   return result;
// });

// const getSum = (dataObj: any, list: any) =>
//   list.map((e: any) => Number(dataObj[e.key])).reduce((a: number, b: number) => a + b);
</script>

<style lang="postcss" scoped>
.base-struct-list {
  @apply w-full h-full flex flex-wrap p-0.5;
}

.list-item-box {
  /* height: 62%; */

  @apply p-0.5 w-1/3;

  &.single {
    /* height: 38%; */
  }
}

.list-item {
  @apply relative w-full h-full cursor-pointer rounded-sm flex flex-col items-center transition-all duration-300;
  /* @apply relative w-full h-full cursor-pointer rounded-sm flex flex-col items-center justify-center transition-all duration-300; */

  &.active {
    /* border: 1px solid rgba(7, 133, 196, 1);
    background: linear-gradient(
      to left top,
      rgba(0, 59, 88, 0.3),
      rgb(7, 133, 196)
    ); */
  }
}
.active .item-title {
  background: linear-gradient(to right, transparent, rgba(255, 192, 0, 0.45), transparent);
  color: rgba(255, 206, 90, 1);
}
.item-title {
  font-weight: bold;
  letter-spacing: 1px;
  width: 60%;
  height: 15px;
  line-height: 15px;
  margin: auto;
  margin-top: 0;
  margin-bottom: 0.1rem;
  text-align: center;
  color: #badeff;
  font-size: 13px;
  background: linear-gradient(to right, transparent, rgba(0, 72, 137, 1), transparent);
}

.item-value {
  font-size: 20px;
}

.item-subtypes {
  @apply flex flex-col flex-shrink-0 w-full flex-grow px-6 py-1;
}

.item-subtype {
  @apply flex justify-between items-center;
}
.sub-point {
  @apply flex justify-between;
  width: 20px;
  /* width: 43px; */
}
.in_po {
  display: inline-block;
  width: 1px;
  height: 1px;
  border-radius: 1px;
  background: #00b4ff;
}
.sub-name {
  font-size: 13px;
  color: #badeff;
}

.sub-num {
  font-size: 14px;
  color: #60b3ff;
}

.icon {
  position: absolute;
  font-size: 60px;
  top: 0;
  height: 100%;
  color: rgba(255, 255, 255, 0.12);
}
.item-icon {
  width: 50px;
  height: 41px;
  /* margin: auto; */
  margin: 5px;
  /* background: red; */
}
.item-icon img {
  width: 100%;
  height: 100%;
}
</style>
