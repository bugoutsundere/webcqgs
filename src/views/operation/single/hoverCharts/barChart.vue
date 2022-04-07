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
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Error || null,
  },
})

const staticOptions = {
  color: [useGradient('red3'), useGradient('red2')],
  xAxis: [
    {
      show: false,
      type: 'value',
      inverse: true,
    },
    {
      gridIndex: 1,
      show: false,
    },
    {
      show: false,
      gridIndex: 2,
    },
  ],
  legend: {
    top: 10,
    right: 10,
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 20,
    icon: 'horizontal',
    textStyle: {
      color: '#ffffff',
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
  grid: [
    {
      left: '20%',
      top: '15%',
      bottom: '0px',
      containLabel: true,
      width: '16%',
    },
    {
      left: '50%',
      top: '15%',
      bottom: '18px',
      width: '0%',
    },
    {
      right: '14%',
      top: '15%',
      bottom: '0px',
      containLabel: true,
      width: '26%',
    },
  ],
}

const seriesStaticOptions = {
  itemStyle: {
    shadowColor: 'rgba(0, 0, 0, .2)',
    shadowBlur: 2,
    shadowOffsetY: 0,
    shadowOffsetX: 2,
    borderColor: '#fff',
    borderWidth: 1,
  },
  animationEasing: 'elasticOut',
  type: 'bar',
  barWidth: '60%',
}

const lastestMonth = computed(() => {
  const list: any = props.data
  if (list?.length > 0) {
    return list[0].lastMonth
  }

  return 0
})

const datalist = computed(() => {
  const list = props.data
  if (list?.length > 0) {
    return comInfo.map(({ name, code }) => {
      const target: any = list.find((e: any) => e.orgCode === code)
      return {
        name,
        actNums: (target && target.actNums) || 0,
        totalNums: (target && target.totalNums) || 0,
      }
    })
  }
  return []
})

const ectOptions = computed(() => {
  if (datalist.value?.length === 0) {
    return {}
  }
  const nameList = datalist.value.map(e => e.name)
  return {
    ...staticOptions,
    dataset: {
      source: datalist.value,
      dimensions: ['name', 'actNums', 'totalNums'],
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#01A3FFc3',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        data: nameList,
      },
      {
        gridIndex: 1,
        type: 'category',
        inverse: true,
        position: 'left',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#ffffff',
            fontSize: 12,
          },
          align: 'center',
        },
        data: nameList,
      },
      {
        gridIndex: 2,
        type: 'category',
        inverse: true,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#01A3FFc3',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        data: nameList,
      },
    ],
    series: [
      {
        name: `当月(${lastestMonth.value})`,
        stack: '1',
        label: {
          show: true,
          position: 'left',
          formatter: function (e: any) {
            return e.data.actNums ? dataFormat(e.data.actNums) : ''
          },
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
        encode: {
          x: 'actNums',
          y: 'name',
        },
        ...seriesStaticOptions,
      },
      {
        name: '年累计',
        stack: '2',
        xAxisIndex: 2,
        yAxisIndex: 2,
        label: {
          show: true,
          position: 'right',
          formatter: function (e: any) {
            return e.data.totalNums ? dataFormat(e.data.totalNums) : ''
          },
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
        encode: {
          x: 'totalNums',
          y: 'name',
        },
        ...seriesStaticOptions,
      },
    ],
  }
})

const dataFormat = (num: number) => {
  return formatThousand(Math.round(num / 10000))
}
</script>
