<template>
  <hoverCommon :loading="loading" :error="error">
    <Ect :options="ectOptions" v-if="datalist?.length > 0" />
    <Empty v-else />
  </hoverCommon>
</template>

<script lang="ts" setup>
import hoverCommon from './common.vue'
import { computed, defineProps } from 'vue'
import { comInfo } from '@/store/state'
import { useGradient } from '@/utils/color'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Error || null,
  },
  keyName: {
    type: String,
    required: true,
  },
})

const datalist = computed(() => {
  const list = props.data?.msgContent
  if (list?.length > 0) {
    return comInfo.map(({ name, code }) => {
      const target = list.find((e: any) => e.orgCode === code)
      return {
        name,
        value: (target && target[props.keyName]) || 0,
      }
    })
  }
  return []
})

const staticOptions = {
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

const seriesStaticOptions = {
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
    borderColor: '#fff',
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
  ...staticOptions,
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
          )} }`
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
        },
      },
      ...seriesStaticOptions,
    },
  ],
}))
</script>
