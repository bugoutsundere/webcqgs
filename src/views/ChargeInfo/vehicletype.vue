<template>
  <Module :class="`h-1/${activeCom === 'list' ? 3 : 2}`" :loading="loading" :error="error">
    <template #title>车型分布</template>
    <template #end>
      <Switcher
        v-if="!activeFeatureId && activeCom !== 'list'"
        :options="structOptions"
        v-model="struct"
      />
      <span class="featureName" v-else-if="activeCom !== 'list'">
        {{
          activeFeature &&
          activeFeature[activeFeature.type === 'gantry' ? 'gantryName' : 'statName']
        }}
      </span>
      <Switcher :options="typeOptions" v-model="type" />
      <Switcher :options="timeOptions" v-model="time" />
    </template>
    <template v-if="!loading">
      <div class="absolute inset-0 flex flex-col" v-if="datalist">
        <div class="flex-grow flex">
          <ul class="w-1/3 block overflow-x-hidden">
            <li class="title">
              <span>客车</span>
              <span class="dataNum">{{ format(busSumFake) }}</span>
            </li>
            <li
              class="liItem animate__animated animate__slideInRight"
              :style="{
                animationDelay: `${index * 100}ms`,
              }"
              v-for="(item, index) in fakeBusList"
              :key="index"
            >
              <span>{{ item.name }}</span>
              <span class="dataNum">{{ format(item.value) }}</span>
            </li>
          </ul>
          <ul class="w-1/3 block overflow-x-hidden">
            <li class="title">
              <span>货车</span>
              <span class="dataNum">{{ format(truckSum) }}</span>
            </li>
            <li
              class="liItem animate__animated animate__slideInRight"
              :style="{
                animationDelay: `${index * 100}ms`,
              }"
              v-for="(item, index) in truckList"
              :key="index"
            >
              <span>{{ item.name }}</span>
              <span class="dataNum">{{ format(item.value) }}</span>
            </li>
          </ul>
          <ul class="flex-grow block overflow-x-hidden">
            <li class="title">
              <span>专车</span>
              <span class="dataNum">{{ format(spCarSum) }}</span>
            </li>
            <li
              class="liItem animate__animated animate__slideInRight"
              :style="{
                animationDelay: `${index * 100}ms`,
              }"
              v-for="(item, index) in spCarList"
              :key="index"
            >
              <span>{{ item.name }}</span>
              <span class="dataNum">
                {{ format(item.value) }}
              </span>
            </li>
          </ul>
        </div>
        <div class="block">
          <div class="title">
            <span>其他</span>
            <span class="dataNum">{{ format(otherSum) }}</span>
          </div>
        </div>
      </div>
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, ref, watch } from 'vue'
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import { useGradient } from '@/utils/color'
import { formatFix2, formatThousand } from '@/utils/util'

const struct = ref('gantry')
const structOptions = [
  { name: '门架', value: 'gantry' },
  { name: '收费站', value: 'station' },
]

const type = ref('Flow')
const typeOptions = [
  { name: '车流量', value: 'Flow' },
  { name: '交易金额', value: 'Trade' },
]

const time = ref('day')
const timeOptions = [
  { name: '今日', value: 'day' },
  { name: '昨日', value: 'yesterday' },
  { name: '本月', value: 'month' },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const activeFeatureId = computed(() => store.state.charge?.activeFeatureId)
const activeFeature = computed(() => store.getters.activeFeature)

const params = computed(() => {
  const list = [`timeDimension=${time.value}`]
  if (activeCom.value !== 'list') {
    list.push(`orgCode=${activeCom.value}`)
    if (activeFeatureId.value && activeFeature.value) {
      list.push(`${activeFeature.value.type}id=${activeFeatureId.value}`)
    }
  }

  return list.join('&')
})

const scope = computed(() => {
  if (activeFeatureId.value && activeFeature.value && activeCom.value !== 'list') {
    return ''
  }
  return activeCom.value === 'list' ? 'All' : 'Org'
})
const basePath = '/http-server-charge-management/publish'
const path = computed(() => {
  if (activeFeatureId.value && activeFeature.value) {
    return `${basePath}/${activeFeature.value.type}/vehicletype${type.value}${scope.value}?${params.value}`
  }
  return `${basePath}/${struct.value}/vehicletype${type.value}${scope.value}?${params.value}`
})

const { data, loading, error, refresh } = useRequest<any>(() => genConfig(path.value))

watch(path, refresh)

const vehicletypeCodes: any = {
  bus1: 1,
  bus2: 2,
  bus3: 3,
  bus4: 4,
  truck1: 11,
  truck2: 12,
  truck3: 13,
  truck4: 14,
  truck5: 15,
  truck6: 16,
  spCar1: 21,
  spCar2: 22,
  spCar3: 23,
  spCar4: 24,
  spCar5: 25,
  spCar6: 26,
}

const codes = (() => {
  let list: any = {}
  Object.keys(vehicletypeCodes).forEach(key => {
    list[vehicletypeCodes[key]] = key
  })
  return list
})()

const getSum = (list: any, arr: Array<number>) => {
  return list
    .filter((e: any) => arr.includes(e.vehicletype))
    .map((e: any) => Number(e.num))
    .reduce((a: number, b: number) => a + b)
}

const datalist = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    const data: any = {}
    list.forEach((e: any) => {
      if (Object.prototype.hasOwnProperty.call(codes, e.vehicletype)) {
        data[codes[e.vehicletype]] = e.num
      }
    })
    return data
  }
  return null
})

const busList = computed(() => [
  { name: '客一', value: datalist.value?.bus1 || 0 },
  { name: '客二', value: datalist.value?.bus2 || 0 },
  { name: '客三', value: datalist.value?.bus3 || 0 },
  { name: '客四', value: datalist.value?.bus4 || 0 },
])

const fakeBusList: any = ref([])

const busSum = computed(() =>
  busList.value?.map((e: any) => e.value).reduce((a: number, b: number) => a + b)
)
const busSumFake = computed(
  () =>
    fakeBusList.value?.length > 0 &&
    fakeBusList.value?.map((e: any) => e.value).reduce((a: number, b: number) => a + b)
)

const truckList = computed(() => [
  { name: '货一', value: datalist.value?.truck1 || 0 },
  { name: '货二', value: datalist.value?.truck2 || 0 },
  { name: '货三', value: datalist.value?.truck3 || 0 },
  { name: '货四', value: datalist.value?.truck4 || 0 },
  { name: '货五', value: datalist.value?.truck5 || 0 },
  { name: '货六', value: datalist.value?.truck6 || 0 },
])
const truckSum = computed(() =>
  truckList.value?.map((e: any) => e.value).reduce((a: number, b: number) => a + b)
)
const spCarList = computed(() => [
  { name: '专一', value: datalist.value?.spCar1 || 0 },
  { name: '专二', value: datalist.value?.spCar2 || 0 },
  { name: '专三', value: datalist.value?.spCar3 || 0 },
  { name: '专四', value: datalist.value?.spCar4 || 0 },
  { name: '专五', value: datalist.value?.spCar5 || 0 },
  { name: '专六', value: datalist.value?.spCar6 || 0 },
])
const spCarSum = computed(() =>
  spCarList.value?.map((e: any) => e.value).reduce((a: number, b: number) => a + b)
)

const left = computed(
  () => Math.round((1 - busSum.value - truckSum.value - spCarSum.value) * 10000) / 10000
)
watch(
  [data],
  () => {
    if (left.value >= 0) {
      fakeBusList.value = busList.value
      return
    }
    let ok = false
    fakeBusList.value = busList.value.map((e: any) => {
      if (e.value + left.value >= 0 && !ok) {
        ok = true
        return {
          name: e.name,
          value: e.value + left.value,
        }
      }
      return {
        ...e,
      }
    })
  },
  {
    immediate: true,
  }
)

const otherSum = computed(() => {
  return left.value >= 0 ? left.value : 0
})

const format = (num: number) => {
  return formatFix2(Math.round(num * 10000) / 100) + '%'
}
</script>

<style lang="postcss" scoped>
.block {
  border: 1px solid rgba(0, 183, 255, 0.3);

  @apply flex-shrink-0;
}

.dataNum {
  color: #fff;
}

.title {
  height: 30px;
  font-size: 14px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));

  @apply flex justify-between items-center px-2;

  & .dataNum {
    color: #e7b307;
  }
}

.liItem {
  height: 28px;
  font-size: 12px;

  @apply flex justify-between items-center px-2;

  &:nth-child(2n + 1) {
    background: rgba(0, 0, 0, 0.2);
  }

  &:hover {
    background-color: rgba(0, 132, 255, 0.2);
  }
}

.featureName {
  color: rgb(252, 255, 46);
  margin-right: 4px;
  line-height: 12px;
  max-width: 130px;
}
</style>
