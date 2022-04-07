<template>
  <Module class="h-1/2" :loading="redisLoading">
    <template #title>今日实时交易金额</template>
    <template #end>
      <!--<Switcher :options="structOptions" v-model="struct" />-->
    </template>
    <template v-if="!redisLoading">
      <!--<Ect :options="ectOptions" v-if="comChargeData" />-->
      <!--<Empty v-else />-->
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, ref } from 'vue'
import { formatFix2 } from '@/utils/util'
import { useGradient } from '@/utils/color'

const struct = ref('ETC')
const structOptions = [
  { name: 'ETC', value: 'ETC' },
  { name: '其他', value: 'other' },
]

const store = useStore(key)
const comChargeData = computed(() => store.getters.comChargeData)
const redisLoading = computed(() => store.state.charge.redisLoading)

const keyDic: any = computed(() => {
  const type = struct.value === 'ETC' ? 'ETC' : '其他'
  return {
    feeSum: `${type}交易金额`,
    payFeeSum: `${type}应收金额`,
    discountFeeSum: `${type}优惠金额`,
  }
})

const datalist = computed(() => {
  if (!comChargeData.value) {
    return []
  }
  const list = ['feeSum', 'payFeeSum', 'discountFeeSum']

  return Object.keys(comChargeData.value).map((key: string) => {
    const obj: any = {}
    list.forEach((e: any) => {
      const data = comChargeData.value[key][e + (struct.value === 'ETC' ? '1' : '2')]
      obj[e] = data && formatFix2(Math.round(data / 100) / 100)
    })
    return {
      type: key === 'gantry' ? '收费门架' : '出口收费站',
      ...obj,
    }
  })
})

const staticOptions = {
  color: [
    useGradient('blue', 'vertical'),
    useGradient('red2', 'vertical'),
    useGradient('green', 'vertical'),
  ],
  grid: {
    top: 40,
    left: 34,
    right: 34,
    bottom: 30,
  },
  legend: {
    right: '18px',
    top: '10px',
    icon: 'diamond',
    itemWidth: 12,
    itemHeight: 12,
    padding: [6, 10],
    itemGap: 20,
    textStyle: {
      color: '#fff',
      fontSize: 12,
    },
  },
  tooltip: {
    trigger: 'axis',
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
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#01A3FF',
        width: '1',
      },
    },
    axisTick: {
      alignWithLabel: true,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 154, 248,.5)',
        width: '1',
      },
    },
    axisLabel: {
      fontSize: 12,
      fontWeight: 400,
    },
  },
  yAxis: {
    name: '单位(万元)',
    type: 'value',
    splitNumber: 3,
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 154, 248,.5)',
        width: '1',
      },
    },
    axisLine: {
      lineStyle: {
        color: '#009EFF',
      },
    },
    axisLabel: {
      show: true,
      fontSize: 10,
    },
  },
}

const ectOptions = computed(() => ({
  ...staticOptions,
  dataset: {
    source: datalist.value,
    dimensions: ['type', 'feeSum', 'payFeeSum', 'discountFeeSum'],
  },
  series: Object.keys(keyDic.value).map((key: string) => ({
    name: keyDic.value[key],
    type: 'bar',
    barWidth: '18%',
    encode: {
      x: 'type',
      y: key,
    },
    itemStyle: {
      borderColor: '#fff',
      borderWidth: 1,
      shadowColor: 'rgba(0, 0, 0, .8)',
      shadowBlur: 4,
      shadowOffsetY: 1,
      shadowOffsetX: 2,
    },
    label: {
      show: true,
      position: 'top',
      color: '#fff',
      lineHeight: 12,
      fontSize: 12,
      fontFamily: 'sans-serif',
      verticalAlign: 'middle',
      borderRadius: 2,
      borderWidth: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: [2, 4],
      borderColor: 'rgba(0,0,0,0.8)',
      offset: [0, -10],
    },
  })),
}))
</script>
