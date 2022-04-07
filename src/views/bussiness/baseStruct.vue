<template>
  <Module
    :style="{ height: '280px' }"
    :loading="loading"
    :error="error"
    :info="bsMeta && bsMeta['utilities']"
  >
    <template #title>基础设施统计(数量)</template>
    <div class="base-struct-list" v-if="arr">
      <div
        class="list-item-box"
        :class="{ single: !item.children }"
        v-for="item in baseStructInfo"
        :key="item.code"
      >
        <div
          class="list-item"
          @click="activeBaseStruct = item.code"
          :class="{ active: activeBaseStruct === item.code }"
          v-waves
        >
          <svg-icon class="icon pointer-events-none" :name="'eq-' +item.code" />
          <template v-if="!item.children">
            <span class="item-title mt-2 mb-1">{{ item.name }}</span>
            <span class="item-value">{{ arr ? formatThousand(arr[item.key] || 0) : '-' }}</span>
          </template>
          <template v-else>
            <span class="item-title mt-2 mb-1">{{
              `${item.name}(${arr ? formatThousand(getSum(arr, item.children)) : '-'})`
            }}</span>
            <ul class="item-subtypes">
              <li class="item-subtype" v-for="subItem in item.children" :key="subItem.key">
                <span class="sub-name">{{ subItem.name }}</span>
                <span class="sub-num">{{ arr ? formatThousand(arr[subItem.key] || 0) : '-' }}</span>
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
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import { computed, defineProps, watch } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { baseStructInfo } from '@/store/state'
import { formatThousand } from '@/utils/util'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const bsMeta = computed(() => store.getters.bsMeta)

const activeBaseStruct = computed({
  get: () => store.state.activeBaseStruct,
  set(val: string) {
    store.commit('changeBaseStruct', val)
  },
})

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(
    `/http-server-yygl/publish/jsc/baseStruct${
      activeCom.value !== 'list' ? '?com=' + activeCom.value : ''
    }`
  )
)

watch(activeCom, refresh)

const arr = computed(() => {
  const msgContent = data.value?.msgContent
  // const result = msgContent && (msgContent as Array<any>)[0]
  const result = {
  "bigBridgeNums": 0,
  "bridgeNums": 0,
  "chunnelNums": 0,
  "gantry": 0,
  "langChunnelNums": 0,
  "midBridgeNums": 0,
  "midChunnelNums": 0,
  "roadSecNums": 0,
  "routeEtc": 0,
  "routeNetc": 0,
  "serviceStatNums": 0,
  "shortChunnelNums": 0,
  "smallBridgeNums": 0,
  "tollStatNums": 0,
  "tunnelNums": 0,
  "video": null,
  "vms": null,
  "wbigBridgeNums": 0,
  "wlangChunnelNums": null
}
  return result
})

const getSum = (dataObj: any, list: any) =>
  list.map((e: any) => Number(dataObj[e.key])).reduce((a: number, b: number) => a + b)
</script>

<style lang="postcss" scoped>
.base-struct-list {
  @apply w-full h-full flex flex-wrap p-0.5;
}

.list-item-box {
  height: 62%;

  @apply p-0.5 w-1/3;

  &.single {
    height: 38%;
  }
}

.list-item {
  background: linear-gradient(to left top, rgba(1, 60, 109, 0.2), rgba(0, 70, 105, 1));
  border: 1px solid rgba(7, 133, 196, 0.4);

  @apply relative w-full h-full cursor-pointer rounded-sm flex flex-col items-center justify-center transition-all duration-300;

  &.active {
    border: 1px solid rgba(7, 133, 196, 1);
    background: linear-gradient(to left top, rgba(0, 59, 88, 0.3), rgb(7, 133, 196));
  }
}

.item-title {
  font-size: 16px;
}

.item-value {
  font-size: 20px;
}

.item-subtypes {
  @apply flex flex-col flex-shrink-0 w-full flex-grow justify-around px-3 py-1;
}

.item-subtype {
  @apply flex justify-between;
}

.sub-name {
  font-size: 14px;
}

.sub-num {
  font-size: 16px;
}

.icon {
  position: absolute;
  font-size: 60px;
  top: 0;
  height: 100%;
  color: rgba(255, 255, 255, 0.12);
}
</style>
