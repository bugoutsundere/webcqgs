<template>
  <Module
    class="h-1/3"
    :loading="loading || listLoading"
    :error="error || listError"
    :info="osMeta && osMeta['contractCalc']"
  >
    <template #title>合同统计</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="dataOptions" v-model="dataType" />
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <template v-if="!(loading || listLoading)">
      <Ect
        :options="typeEctOpts"
        @ectCheck="check"
        v-if="activeCom === 'list' && dataList?.length > 0 && comDataListByType.length > 0"
      />
      <Ect :options="ectOpts" v-else-if="activeCom !== 'list' && dataList?.length > 0" />
      <Empty v-else />
      <div
        class="absolute right-0 bottom-0 w-0 h-0 flex items-end justify-end whitespace-nowrap p-2"
        v-if="dataList?.length > 0"
      >
        <span>{{ `${dataType === 'amount' ? '合同金额' : '合同数'}总计:` }}</span>
        <span class="num">{{ formatThousand(sum) }}</span>
        <span>{{ `${dataType === 'amount' ? '万' : '项'}` }}</span>
      </div>
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { comInfo } from '@/store/state'
import { useGradient } from '@/utils/color'

const formatValue = (num: number) => {
  if (dataType.value === 'amount') {
    const number =
      activeCom.value === 'list' ? Math.round(num / 10000) : formatFix2(Math.round(num / 100) / 100)
    return number
  } else {
    return num
  }
}

const dateType = ref('year')
const dateOptions = [
  { name: '月', value: 'month' },
  { name: '年', value: 'year' },
]

const dataType = ref('amount')
const dataOptions = [
  { name: '合同数', value: 'count' },
  { name: '金额(万)', value: 'amount' },
]

const store = useStore(key)
const appDate = computed(() => store.state.appDate)
const activeCom = computed(() => store.state.activeCom)
const osMeta = computed(() => store.getters.osMeta)

const showDate = computed(() =>
  dateType.value === 'year' ? appDate.value?.getFullYear() : formatYearMonth(appDate.value)
)

// 总的数据
const paramsStr = computed(() => {
  const list = [`accDate=${showDate.value}`]
  activeCom.value !== 'list' && list.push(`com=${activeCom.value}`)
  return '?' + list.join('&')
})

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-yonyu/publish/jsc/contract${paramsStr.value}`)
)

watch(paramsStr, refresh)

const amountKey = computed(() => (activeCom.value === 'list' ? 'amount' : 'contractTotal'))

const countKey = computed(() => (activeCom.value === 'list' ? 'count' : 'contractNums'))

const dataList = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    return list.map((e: any) => {
      const value = dataType.value === 'amount' ? e[amountKey.value] : e[countKey.value]
      return {
        name: e.inout,
        value: formatValue(value),
        selected: activeCom.value === 'list' && activeType.value === e.inout,
      }
    })
  }
  return []
})

const sum = computed(() => {
  const sum = dataList.value
    ?.map((e: any) => Number(e.value))
    ?.reduce((a: number, b: number) => a + b)
  return activeCom.value === 'list' || dataType.value === 'count' ? sum : formatFix2(sum)
})

const staicOptions = {
  color: [
    useGradient('blue2', 'vertical'),
    useGradient('yellow', 'vertical'),
    useGradient('green', 'vertical'),
    useGradient('purple', 'vertical'),
    useGradient('blue', 'vertical'),
    useGradient('red', 'vertical'),
    useGradient('yellow2', 'vertical'),
    useGradient('red2', 'vertical'),
    useGradient('red3', 'vertical'),
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

const ectOpts = computed(() => ({
  dataset: {
    source: dataList.value,
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
      ...staticSeriesOptions,
    },
  ],
  ...staicOptions,
}))

const activeType = ref('支出类合同')
const listParamsStr = computed(() => `?com=list&accDate=${showDate.value}`)

// 分各个公司的数据
const {
  data: listData,
  loading: listLoading,
  error: listError,
  run: listRefresh,
} = useRequest<any>(
  () => genConfig(`/http-server-yonyu/publish/jsc/contract${listParamsStr.value}`),
  {
    manual: true,
  }
)

watch(
  [listParamsStr, activeCom],
  () => {
    if (activeCom.value === 'list') {
      listRefresh()
    }
  },
  {
    immediate: true,
  }
)

watch(listData, () => {
  if (listData.value?.msgContent?.length > 0) {
    const outputType = listData.value?.msgContent.find((e: any) => e.inout === '支出类合同')
    if (outputType) {
      activeType.value = '支出类合同'
    } else {
      activeType.value = listData.value?.msgContent[0].inout
    }
  }
})

const comDataListByType = computed(() => {
  const list = listData.value?.msgContent
  if (list?.length > 0) {
    const typeList = list.filter((e: any) => e.inout === activeType.value)
    return comInfo.map(({ name, code }) => {
      const target = typeList.find((e: any) => e.orgCode === code)
      const value = target && target[dataType.value === 'amount' ? 'contractTotal' : 'contractNums']
      return {
        name,
        value: value ? formatValue(value) : 0,
      }
    })
  }
  return []
})

const typeEctOpts = computed(() => ({
  ...staicOptions,
  series: [
    decoBg,
    {
      type: 'pie',
      selectedMode: 'single',
      radius: [0, '28%'],
      itemStyle: {
        borderColor: 'rgba(255,255,255,0.8)',
        borderWidth: 1,
        color: function (params: any) {
          let colorList = [
            useGradient('blue', 'vertical'),
            useGradient('green', 'vertical'),
            useGradient('red3', 'vertical'),
          ]
          return colorList[params.dataIndex]
        },
      },
      label: {
        normal: {
          position: 'inner',
          fontSize: 16,
          textStyle: {
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
          },
          formatter: function (e: any) {
            if (activeType.value === e.name) {
              return e.name + ': ' + e.value
            } else {
              return ''
            }
          },
        },
      },
      data: dataList.value,
    },
    {
      type: 'pie',
      radius: ['45%', '64%'],
      roseType: 'area',
      itemStyle: {
        borderColor: 'rgba(255,255,255,0.8)',
        borderWidth: 1,
      },
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
      labelLine: {
        length: 2,
        length2: 10,
        smooth: true,
      },
      data: comDataListByType.value,
    },
  ],
}))

const check = (e: any) => {
  e.seriesIndex === 1 && (activeType.value = e.name)
}
</script>

<style lang="postcss" scoped>
.num {
  font-size: 18px;
  line-height: 18px;
  padding: 0 6px;
  color: #f7c522;
}
</style>
