<template>
  <Module :class="`h-1/${activeCom === 'list' ? 3 : 2}`" :loading="loading" :error="error">
    <template #title>车种分布</template>
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
      <Ect :options="ectOptions" v-if="datalist?.length > 0" />
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
import { formatThousand } from '@/utils/util'

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
  if (activeFeatureId.value && activeCom.value !== 'list' && activeFeature.value) {
    return ''
  }
  return activeCom.value === 'list' ? 'All' : 'Org'
})
const basePath = '/http-server-charge-management/publish'
const path = computed(() => {
  if (activeFeatureId.value && activeFeature.value) {
    return `${basePath}/${activeFeature.value.type}/vehicleclass${type.value}${scope.value}?${params.value}`
  }
  return `${basePath}/${struct.value}/vehicleclass${type.value}${scope.value}?${params.value}`
})

const { data, loading, error, refresh } = useRequest<any>(() => genConfig(path.value))

watch(path, refresh)

const vehicleclassCodes: any = {
  0: '普通',
  8: '军警',
  10: '紧急',
  14: '车队',
  21: '绿通车',
  22: '联合收割机',
  23: '抢险救灾',
  24: '集装箱',
  25: '大件运输',
  26: '应急车',
}

const formatNum = (num: number) => (type.value === 'Trade' ? Math.round(num / 100) : num)

const datalist = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    const arr: any = []
    Object.keys(vehicleclassCodes).forEach((code: any) => {
      const item = list.find(({ vehicleclass }: any) => Number(code) === vehicleclass)
      item && arr.push({ name: vehicleclassCodes[code], value: formatNum(item.num) })
    })
    return arr
  }
  return []
})

const staicOptions = {
  color: [
    useGradient('blue', 'vertical'),
    useGradient('green', 'vertical'),
    useGradient('yellow', 'vertical'),
    useGradient('red', 'vertical'),
    useGradient('blue2', 'vertical'),
    useGradient('yellow2', 'vertical'),
    useGradient('purple', 'vertical'),
    useGradient('red2', 'vertical'),
    useGradient('blueOrange', 'vertical'),
  ],
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: '#000',
    axisPointer: {
      type: 'shadow',
    },
    textStyle: {
      fontSize: 12,
      color: '#fff',
    },
  },
  polar: {},
  angleAxis: {
    interval: 1,
    type: 'category',
    data: [],
    z: 10,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#0B4A6B',
        width: 1,
        type: 'solid',
      },
    },
    axisLabel: {
      interval: 0,
      show: true,
      color: '#0B4A6B',
      margin: 8,
      fontSize: 16,
    },
  },
  radiusAxis: {
    min: 40,
    max: 120,
    interval: 20,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#0B3E5E',
        width: 1,
        type: 'solid',
      },
    },
    axisLabel: {
      formatter: '{value} %',
      show: false,
      padding: [0, 0, 20, 0],
      color: '#0B3E5E',
      fontSize: 16,
    },
    splitLine: {
      lineStyle: {
        color: '#0B3E5E',
        width: 2,
        type: 'solid',
      },
    },
  },
}

const staticSeriesOptions = {
  type: 'pie',
  radius: ['20%', '50%'],
  roseType: 'area',
  labelLine: {
    length: 10,
    length2: 5,
    smooth: true,
  },
  encode: {
    itemName: 'name',
    value: 'value',
  },
  itemStyle: {
    borderColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
  },
}

const decoBg = {
  type: 'pie',
  radius: ['5%', '10%'],
  silent: true,
  label: {
    show: false,
  },
  labelLine: {
    show: false,
  },
  data: [
    {
      name: '',
      value: 0,
      itemStyle: {
        color: '#0B4A6B',
      },
    },
  ],
}

const ectOptions = computed(() => ({
  ...staicOptions,
  dataset: {
    source: datalist.value,
    dimensions: ['name', 'value'],
  },
  series: [
    decoBg,
    {
      label: {
        show: true,
        position: 'outside',
        verticalAlign: 'middle',
        backgroundColor: 'rgba(0,0,0,.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.5)',
        lineHeight: 16,
        fontSize: 14,
        padding: [5, 10],
        color: '#fff',
        formatter: function (e: any) {
          return `{label|${e.data.name}}{perc|(${e.percent}%)}\n{value|${formatThousand(
            e.data.value
          )}}{unit|${type.value === 'Flow' ? '辆' : '元'}}`
        },
        rich: {
          label: {
            align: 'center',
            lineHeight: 20,
            color: '#009BFF',
          },
          value: {
            align: 'center',
            fontSize: 16,
            fontFamily: 'sans-serif',
            color: '#f7c522',
          },
          perc: {
            align: 'center',
            fontSize: 12,
            fontFamily: 'sans-serif',
            color: '#009BFF',
          },
          unit: {
            color: '#009BFF',
            padding: [0, 0, 0, 10],
            fontSize: 12,
          },
        },
      },
      ...staticSeriesOptions,
    },
  ],
}))
</script>

<style lang="postcss" scoped>
.featureName {
  color: rgb(252, 255, 46);
  margin-right: 4px;
  line-height: 12px;
  max-width: 130px;
}
</style>
