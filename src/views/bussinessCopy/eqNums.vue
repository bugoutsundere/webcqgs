<template>
  <Module class="h-1/3" :loading="loading" :error="error" :info="bsMeta && bsMeta['machine']">
    <template #title>机电设备统计(数量)</template>
    <template #end>
      <!-- <button class="endButton" @click="clickEndButton">机电设备详情</button> -->
      <span class="titbtn" @click="clickEndButton"><i class="el-icon-arrow-right"></i></span>
    </template>
    <ul class="eq-list" v-if="arr">
      <li class="eq-item-box" v-for="eq in arr" :key="eq.systemType">
        <div class="eq-item" :class="{ active: activeEq === eq.systemType }" @click="activeEq = eq.systemType" v-waves>
          <!-- <svg-icon class="icon" :name="'eq-' + eq.key" /> -->
          <span class="eq-value">
            {{ formatThousand(eq.deviceCount)}}
          </span>
          <span class="eq-name mt-1">{{ eq.systemType }}</span>
        </div>
      </li>
    </ul>
    <Empty v-else-if="!loading" />
  </Module>
  <teleport to="body" v-if="winInited">
    <div class="eq-model" :class="{ hide: !panelShow }">
      <div class="absolute z-10 inset-0" @click="panelShow = false"></div>
      <eqListWin class="z-50" :hide="!panelShow" />
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import eqListWin from './eqListWin.vue';

import { eqInfo } from '@/store/state';
import { key } from '@/store';
import { useStore } from 'vuex';
import { computed, watch, defineProps, ref } from 'vue';

import { genConfig } from '@/utils/request';
import { useRequest } from 'vue-request';

import { formatThousand } from '@/utils/util';
import * as businessApi from '@/api/businessOverview';

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);
const bsMeta = computed(() => store.getters.bsMeta);
const activeEq = computed({
  get: () => store.state.activeEq,
  set: (val: string) => store.commit('changeEq', val),
});
const deviceCount = useRequest<any>(() => businessApi.getDeviceCount(0));
const arr = computed(() => {
  const deviceCountData = deviceCount.data.value?.msgContent;
  return deviceCountData;
});
// const { data, loading, error, refresh } = useRequest<any>(() =>
//   genConfig(`/http-server-yonyu/publish/jsc/eqNums${activeCom.value !== 'list' ? '?com=' + activeCom.value : ''}`)
// );

// watch(activeCom, refresh);

// const arr = computed(() => {
//   const obj: any = {};
//   data.value?.msgContent?.forEach((e: any) => {
//     const str: string = e.typeCode;
//     obj[str] = e.eqNums;
//   });
//   return data.value?.msgContent?.length > 0 ? obj : null;
// });

const panelShow = ref(false);
const winInited = ref(false);

const clickEndButton = () => {
  panelShow.value = true;
  winInited.value = true;
};
</script>

<style lang="postcss" scoped>
.eq-list {
  @apply flex flex-wrap w-full h-full p-0.5;
}

.eq-item-box {
  @apply w-1/3 h-1/3 p-0.5;
}

.eq-item {
  /* background: linear-gradient(to left top, rgba(1, 60, 109, 0.2), rgba(0, 70, 105, 1));
  border: 1px solid rgba(7, 133, 196, 0.4); */

  @apply relative p-0.5 w-full h-full cursor-pointer rounded-sm flex flex-col items-center justify-center transition-all duration-300;

  &.active {
    /* border: 1px solid rgba(7, 133, 196, 1); */
    background: linear-gradient(to left top, rgba(0, 59, 88, 0.3), rgb(7, 133, 196));
  }
}

.eq-name {
  font-weight: bold;
  letter-spacing: 1px;
  width: 100%;
  height: 15px;
  line-height: 15px;
  margin: auto;
  text-align: center;
  color: #badeff;
  font-size: 13px;
  background: linear-gradient(to right, transparent, rgba(0, 72, 137, 1), transparent);
}

.icon {
  position: absolute;
  top: 0;
  left: 10px;
  height: 100%;
  color: rgba(255, 255, 255, 0.15);
  font-size: 50px;
}

.eq-value {
  width: 60%;
  height: 60px;
  background: url('@/assets/images/jdsbtj-item-bg.png');
  background-size: 100% 100%;
  font-size: 22px;
  text-align: center;
  line-height: 60px;
}

.endButton {
  border: 1px solid rgba(23, 207, 240, 0.342);
  font-size: 12px;
  line-height: 14px;
  text-shadow: none;
  background: rgba(4, 148, 231, 0.8);
  padding: 4px 6px;

  @apply outline-none transition-all duration-300 rounded-sm;

  &:hover {
    background: #0494e7;
  }
}

.eq-model {
  background: rgba(0, 0, 0, 0.6);

  @apply fixed inset-0 z-50 transition-all ease-in-out duration-300 flex items-center justify-center;

  &.hide {
    background: rgba(0, 0, 0, 0);

    @apply pointer-events-none;
  }
}
.titbtn {
  color: #ffe8c8;
  width: 50px;
  text-align: right;
  cursor: pointer;
}
</style>
