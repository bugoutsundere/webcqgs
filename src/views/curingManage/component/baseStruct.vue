<template>
  <Module :loading="loading" :error="error">
    <template #title>基础设施统计(数量)</template>
    <div class="base-struct-list" v-if="arr">
      <div class="list-item-box" :class="{ single: !item.children }" v-for="item in curingManageBaseStructInfo" :key="item.code">
        <div class="list-item" @click="activeCuringBaseStruct = item.code" :class="{ active: activeCuringBaseStruct === item.code }" v-waves>
          <div class="item-icon">
            <img v-if="activeCuringBaseStruct === item.code" :src="imgslist.value[item.code + 'Act']" />
            <!-- <img v-else :src="`~@/src/assets/images/${item.code}.png`" /> -->
            <img v-else :src="imgslist.value[item.code]" />
          </div>
          <!-- <svg-icon class="icon pointer-events-none" :name="'eq-' +item.code" /> -->
          <template v-if="!childrenData[item.key]">
            <span class="item-title">{{ item.name }}</span>
            <span class="item-value">{{
              arr ? (arr[item.key] || 0) : "-"
            }}</span>
          </template>
          <template v-else>
            <span class="item-title">{{ item.name }}</span>
            <span class="item-value">{{
              arr ? (arr[item.key] || 0) : "-"
            }}</span>
            <ul class="item-subtypes">
              <li class="item-subtype" v-for="subItem in childrenData[item.key]" :key="subItem.key">
                <span class="sub-name">{{ subItem.type }}</span>
                <span class="sub-point" v-if="subItem.type&&subItem.type.length < 4">
                  <span v-for="i in 4" :key="i" class="in_po"></span>
                </span>
                <span class="sub-num">{{(subItem.count)}}</span>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
    <Empty v-else-if="!loading" />
  </Module>
</template>

<script lang="ts" setup>
import { genConfig } from '@/utils/request';
import { useRequest } from 'vue-request';
import { computed, defineProps, watch, reactive } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { curingManageBaseStructInfo } from '@/store/state';
import section from '@/assets/images/baseStruct/stat.png';
import sectionAct from '@/assets/images/baseStruct/stat-active.png';
import roadSide from '@/assets/images/baseStruct/route.png';
import roadSideAct from '@/assets/images/baseStruct/route-active.png';
import sideslope from '@/assets/images/baseStruct/bp.png';
import sideslopeAct from '@/assets/images/baseStruct/bp-active.png';
import bridge from '@/assets/images/baseStruct/brg.png';
import bridgeAct from '@/assets/images/baseStruct/brg-active.png';
import tunnel from '@/assets/images/baseStruct/tunnel.png';
import tunnelAct from '@/assets/images/baseStruct/tunnel-active.png';
import culvert from '@/assets/images/baseStruct/hd.png';
import culvertAct from '@/assets/images/baseStruct/hd-active.png';

import { getTunnelCount, getBridgeCount, getMngSectionLen } from '@/api/businessOverview';
import { getCulvertCount, getRoadsideCount, getSideslopeCount } from '@/api/curingManage';

const imgslist = reactive({
  value: {
    section,
    sectionAct,
    roadSide,
    roadSideAct,
    sideslope,
    sideslopeAct,
    bridge,
    bridgeAct,
    culvert,
    culvertAct,
    tunnel,
    tunnelAct,
  },
});

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);
const bsMeta = computed(() => store.getters.bsMeta);

const activeCuringBaseStruct = computed({
  get: () => store.state.activeCuringBaseStruct,
  set(val: string) {
    store.commit('changeCuringBaseStruct', val);
  },
});
const getValue = (value: any, key: any) => {
  const result = value && (value as Array<any>)[0] && (value as Array<any>)[0][key];
  return result;
};
const tunnelApiData = useRequest<any>(() => getTunnelCount(0, 0));
const bridgeApiData = useRequest<any>(() => getBridgeCount(0, 0));
const sectionLenApiData = useRequest<any>(() => getMngSectionLen(0));
const culvertApiData = useRequest<any>(() => getCulvertCount(0, 0));
const roadsideApiData = useRequest<any>(() => getRoadsideCount());
const sideslopeApiData = useRequest<any>(() => getSideslopeCount(0, 0));

const arr = computed(() => {
  const tunnelCountData = tunnelApiData.data.value?.msgContent;
  const sectionLenData = sectionLenApiData.data.value?.msgContent;
  const culvertData = culvertApiData.data.value?.msgContent;
  const bridgeData = bridgeApiData.data.value?.msgContent;
  const roadsideData = roadsideApiData.data.value?.msgContent;
  const sideslopeData = sideslopeApiData.data.value?.msgContent;
  const result = {
    mngSectionLen: getValue(sectionLenData, 'mngSectionLen'),
    tunnelCount: getValue(tunnelCountData, 'tunnelCount'),
    culvertCount: getValue(culvertData, 'culvertCount'),
    bridgeCount: getValue(bridgeData, 'bridgeCount'),
    faciCount: getValue(roadsideData, 'faciCount'),
    slopeCount: getValue(sideslopeData, 'slopeCount'),
  };
  return result;
});
const tunnelTypeData = useRequest<any>(() => getTunnelCount(0, 1));
const bridgeTypeData = useRequest<any>(() => getBridgeCount(0, 1));
const culvertTypeData = useRequest<any>(() => getCulvertCount(0, 1));
const sideslopeTypeData = useRequest<any>(() => getSideslopeCount(0, 1));
// 子项目数据
const childrenData = computed(() => {
  const tunnelTypeDataValue = tunnelTypeData.data.value?.msgContent;
  const bridgeTypeDataValue = bridgeTypeData.data.value?.msgContent;
  const culvertTypeDataValue = culvertTypeData.data.value?.msgContent;
  const sideslopeTypeDataValue = sideslopeTypeData.data.value?.msgContent;
  const bridgeCount = new Array();
  const tunnelCount = new Array();
  const culvertCount = new Array();
  const slopeCount = new Array();
  tunnelTypeDataValue &&
    (tunnelTypeDataValue as Array<any>).forEach((item: any) => {
      tunnelCount.push({ count: item.tunnelCount, type: item.tunnelType });
    });
  bridgeTypeDataValue &&
    (bridgeTypeDataValue as Array<any>).forEach((item: any) => {
      bridgeCount.push({ count: item.bridgeCount, type: item.bridgeType });
    });
  culvertTypeDataValue &&
    (culvertTypeDataValue as Array<any>).forEach((item: any) => {
      culvertCount.push({ count: item.culvertCount, type: item.culvertType });
    });
  sideslopeTypeDataValue &&
    (sideslopeTypeDataValue as Array<any>).forEach((item: any) => {
      slopeCount.push({ count: item.slopeCount, type: item.riskType });
    });
  return {
    tunnelCount,
    bridgeCount,
    culvertCount,
    slopeCount,
  };
});

const getSum = (dataObj: any, list: any) =>
  list.map((e: any) => Number(dataObj[e.key])).reduce((a: number, b: number) => a + b);
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
