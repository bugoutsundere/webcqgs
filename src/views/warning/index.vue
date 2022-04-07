<template>
  <div class="absolute inset-0 flex flex-col items-center overflow-x-hidden overscroll-y-auto">
    <div class="header">
      <ul class="flex">
        <template v-if="countSum">
          <li class="countItem" v-for="item in countList" :key="item.name" :class="item.color">
            <span>{{ item.name }}</span>
            <span class="countNum">{{ countSum[item.color] }}</span>
          </li>
        </template>
      </ul>
      <span class="ml-auto">{{ appDate }}</span>
      <button class="idxButton ml-10" v-if="idxMeta" @click="clickButton">
        <i class="el-icon-tickets mr-2" />
        指标说明
      </button>
    </div>
    <div class="blockList">
      <template v-for="(block,index) in datalist" :key="block.key">
        <panelBlock :block="block" @setCount="setCount" v-if="index <= 10" />
      </template>
      <div class="panelBlockBox" v-if="appYear === 2021" style="width: 500px;"></div>
      <template v-for="(block,index) in datalist" :key="block.key">
        <panelBlock
          :class="{
            'mgToTop': index === 13 && appYear === 2021
          }"
          :block="block"
          @setCount="setCount"
          v-if="index > 10"
        />
      </template>
    </div>
    <teleport to="body" v-if="idxMetaList?.length > 0">
      <div class="infoModel" :class="{ hide: !panelShow }" @click="panelShow = false">
        <ul
          class="flex flex-col animate__animated metaList"
          v-if="panelInited"
          :class="{
            animate__fadeIn: panelShow,
            animate__fadeOut: !panelShow,
          }"
        >
          <li class="flex flex-col" v-for="(item, index) in idxMetaList" :key="index">
            <span class="name">{{ item.name }}</span>
            <pre>{{ item.value }}</pre>
          </li>
        </ul>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref, reactive } from 'vue'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { indexList } from './list'
import panelBlock from './panelBlock.vue'

import { useFetchMeta } from '@/compositions/meta'
useFetchMeta('idxdesc')

const store = useStore(key)
const appDate = computed(() => formatYearMonth(store.state.appDate))
const activeCom = computed(() => store.state.activeCom)
const idxMeta = computed(() => store.getters.idxMeta)
const appYear = computed(() => {
  return store.state.appDate.getFullYear()
})

const list = computed(() => appYear.value === 2021 ? indexList.filter((e: any) => e.key !== 'personAmount') : indexList)

const multiIndex = {
  keys: ['newIncomeComf', 'newProfitComf', 'netProfitComf'],
  // comList: ['107', '108', '109', 'list'],
  comList: ['105', '105', '105', 'list'],
}

const datalist = computed(() => {
  if (!multiIndex.comList.includes(activeCom.value)) {
    return list.value.filter((e: any) => !multiIndex.keys.includes(e.key))
  }
  return list.value
})

const countList = computed(() => [
  { name: '正常', color: 'default' },
  { name: '黄灯', color: 'YELLOW' },
  { name: '红灯', color: 'RED' },
])

const count: any = reactive({})

const setCount = (payload: any) => {
  count[payload.key] = payload.count
}

const countSum: any = computed(() => {
  if (datalist.value?.length > 0) {
    const obj = {
      RED: 0,
      YELLOW: 0,
      default: 0,
    }
    datalist.value.forEach(({ key }: any) => {
      if (count[key]) {
        const { default: defaultVal, RED, YELLOW } = count[key]
        obj.RED += RED
        obj.YELLOW += YELLOW
        obj.default += defaultVal
      }
    })
    return obj
  }
  return null
})

const panelShow = ref(false)
const panelInited = ref(false)
const idxMetaList = computed(() => {
  if (idxMeta.value) {
    return Object.keys(idxMeta.value).map((key: string) => {
      const target = list.value.find((e: any) => e.key === key)
      return {
        name: target?.name || '未知指标名称',
        value: idxMeta.value[key],
      }
    })
  }
  return []
})

const clickButton = () => {
  panelShow.value = true
  panelInited.value = true
}
</script>

<style lang="postcss" scoped>
.content {
  min-width: 1000px;

  @apply flex flex-col items-center;
}

.header {
  height: 60px;
  margin: 50px 0 30px 0;
  max-width: 1660px;
  padding: 0 100px;

  @apply w-full flex justify-between items-center;
}

.blockList {
  padding-bottom: 50px;
  max-width: 1660px;

  @apply flex flex-wrap justify-center;
}

.countItem {
  &.default {
    color: #139ae9c5;
  }

  &.RED {
    color: #ff4040d5;
  }

  &.YELLOW {
    color: #e9ec33d5;
  }

  & + .countItem {
    margin-left: 20px;
  }
}

.countNum {
  font-size: 20px;
  padding: 0 10px;

  @apply font-mono;
}

.idxButton {
  border: 1px solid rgba(23, 207, 240, 0.342);
  font-size: 12px;
  line-height: 14px;
  text-shadow: none;
  background: rgba(35, 174, 255, 0.8);
  padding: 4px 6px;

  @apply outline-none transition-all duration-300 rounded-sm flex items-center;

  &:hover {
    background: #00a2ff;
  }
}

.infoModel {
  background: rgba(0, 0, 0, 0.6);

  @apply fixed inset-0 z-50 transition-all ease-in-out duration-300 overflow-x-hidden overflow-y-auto;

  &.hide {
    background: rgba(0, 0, 0, 0);

    @apply pointer-events-none;
  }
}

.metaList {
  animation-duration: 300ms;
  max-width: 1000px;
  padding: 40px;

  @apply mx-auto;

  & li {
    & .name {
      font-size: 18px;
      color: rgb(16, 180, 230);
    }

    & + li {
      margin-top: 20px;
    }
  }
}

.mgToTop {
  position: relative;
  top: -256px;
}
</style>
