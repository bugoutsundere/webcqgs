<template>
  <Module
    class="h-full"
    :info="msMeta && msMeta['costInfo']"
    :loading="gloablLoading"
    :error="globalError"
  >
    <template #title>公司费用明细</template>
    <template #end>
      <span>{{ appDate }}</span>
    </template>
    <template v-if="!gloablLoading">
      <div class="absolute inset-0 flex" v-if="activeCom === 'list' && datalist?.length > 0">
        <div class="w-full relative flex monthlyTable">
          <el-table class="flex-grow" :data="datalist" height="100%">
            <el-table-column :width="100" align="center" label="公司名称" key="comName">
              <template v-slot="scope">
                <span class="comName">
                  {{ scope.row.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="col in itemList"
              align="center"
              :label="col.name + '(万)'"
              :key="col.name"
            >
              <template v-slot="scope">
                <ul
                  class="infoBlock"
                  @mouseenter="e => mouseenter(e, scope.row[col.key], col.name, scope.row.code)"
                  @mouseleave="mouseleave"
                >
                  <li>
                    <span>当月</span>
                    <span>{{ formatValue(scope.row[col.key].curval) }}</span>
                    <svg-icon
                      :name="
                        scope.row[col.key].curval > scope.row[col.key].befval
                          ? 'trendUpC'
                          : 'trendDownC'
                      "
                      class="icon"
                    />
                  </li>
                  <li>
                    <span>年累计</span>
                    <span>
                      {{ formatValue(scope.row[col.key].totalcurval) }}
                    </span>
                    <svg-icon
                      :name="
                        scope.row[col.key].totalcurval > scope.row[col.key].totalbefval
                          ? 'trendUpC'
                          : 'trendDownC'
                      "
                      class="icon"
                    />
                  </li>
                </ul>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <Empty v-else />
    </template>
  </Module>
  <teleport to="body" v-if="showPanel">
    <div class="mountPoint" :style="mountStyle">
      <div class="hoverPanel">
        <div class="triDeco"></div>
        <div class="panel">
          <ul
            v-if="hoverTarget"
            class="flex absolute mt-2 left-1/2 transform -translate-x-1/2"
            :style="{ color: '#00A6FF' }"
          >
            <li class="flex whitespace-nowrap">
              <span>去年当月:</span>
              <span class="ml-2" :style="{ color: '#FF9700' }">
                {{ formatValue(hoverTarget?.befval) }}
              </span>
            </li>
            <li class="flex ml-4 whitespace-nowrap">
              <span>去年截止当月累计:</span>
              <span class="ml-2" :style="{ color: '#FF9700' }">
                {{ formatValue(hoverTarget?.totalbefval) }}
              </span>
            </li>
          </ul>
          <Loading v-if="preLoading || panelLoading" />
          <Ect :options="ectOptions" v-else-if="panelDatalist?.length > 0" />
          <Empty v-else />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { comInfo } from '@/store/state'
import { useGradient } from '@/utils/color'
import { graphic } from 'echarts'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const msMeta = computed(() => store.getters.msMeta)
const appDate = computed(() => formatYearMonth(store.state.appDate))


// 全部公司级别
const { data, loading, error, run } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/monthlynew?com=list&accDate=${appDate.value}&a=4`),
  {
    manual: true,
  }
)


watch(
  [appDate, activeCom],
  () => {
    if (activeCom.value === 'list') {
      run()
    }
  },
  {
    immediate: true,
  }
)

const gloablLoading = computed(() => (activeCom.value === 'list' ? loading.value : false))

const globalError = computed(() => (activeCom.value === 'list' ? error.value : undefined))

const itemList = [
  { name: '营业收入', key: 'yingye' },
  { name: '拆分收入', key: 'chaifen' },
  { name: '利润总额', key: 'lirun' },
  { name: '管理费用', key: 'guanli' },
  { name: '付现成本', key: 'fuxian' },
]

const datalist = computed(() => {
  const list = data.value?.msgContent
  if (activeCom.value === 'list' && list?.length > 0) {
    return comInfo.map(({ name, code }) => {
      return {
        name,
        code,
        fuxian: list.find((t: any) => t.prgName === '付现成本' && t.orgName === name),
        guanli: list && list.find((t: any) => t.prgName === '管理费用' && t.orgName === name),
        yingye: list && list.find((t: any) => t.prgName === '营业收入' && t.orgName === name),
        lirun: list && list.find((t: any) => t.prgName === '利润总额' && t.orgName === name),
        chaifen: list && list.find((t: any) => t.prgName === '拆分收入' && t.orgName === name),
      }
    })
  }
  return []
})

const formatValue = (num: number | string) => {
  const number = Number(num)
  return formatThousand(formatFix2(Math.round(number / 100) / 100))
}

// 悬浮
const mountStyle = ref('')
const showPanel = ref(false)
let timer: any = null

const hoverTarget: any = ref(null)

const panelParamsStr = ref('')

const preLoading = ref(false)

const { data: panelData, loading: panelLoading, run: panelRun, mutate } = useRequest<any>(
  () =>
    genConfig(
      `/http-server-kpi/publish/jsc/monthlydetail?accDate=${appDate.value}&${panelParamsStr.value}`
    ),
  {
    manual: true,
  }
)

const activePrgName = ref('')

const mouseenter = (e: any, target: any, prgName: string, com: string) => {
  activePrgName.value = prgName
  const bounding = e.target.getBoundingClientRect()
  preLoading.value = true
  panelParamsStr.value = `com=${com}&prgname=${prgName}`
  hoverTarget.value = target
  if (bounding) {
    const { left, bottom } = bounding
    const dist = 10
    mountStyle.value = `left:${left - 10}px;top:${bottom + dist}px;`
  }
  bounding && (showPanel.value = true)

  timer && clearTimeout(timer)
  timer = setTimeout(() => {
    preLoading.value = false
    panelRun()
  }, 200)
}

const mouseleave = () => {
  timer && clearTimeout(timer)
  showPanel.value = false
  hoverTarget.value = null
  preLoading.value = false
}

const monthList = computed(() => {
  const list: any = []
  for (let i = 1; i <= 12; i++) {
    i < 10 ? list.push(`0${i}`) : list.push(i + '')
  }
  return list
})

const panelDatalist = computed(() => {
  const list = panelData.value?.msgContent
  if (showPanel.value && !panelLoading.value && list?.length > 0) {
    const year = Number(store.state.appDate.getFullYear())
    return monthList.value?.map((month: string) => {
      const cTarget = list.find((e: any) => e.accDate === `${year}-${month}`)
      const oTarget = list.find((e: any) => e.accDate === `${year - 1}-${month}`)
      const obj: any = { month }
      cTarget && (obj.cData = Math.round(cTarget.curval / 100) / 100)
      oTarget && (obj.oData = Math.round(oTarget.curval / 100) / 100)
      return obj
    })
  }
  return []
})

const staticOptions = {
  grid: {
    top: 40,
    left: '70px',
    bottom: 30,
    right: 30,
  },
  legend: {
    top: '2px',
    right: '2px',
    position: 'center',
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 20,
    icon: 'horizontal',
    textStyle: {
      color: '#ffffff',
      fontSize: 12,
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
    boundaryGap: false,
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
      textStyle: {
        fontSize: 12,
        fontWeight: '400',
      },
    },
  },
}

const ectOptions = computed(() => {
  if (panelDatalist.value?.length <= 0) {
    return {}
  }
  return {
    ...staticOptions,
    dataset: {
      source: panelDatalist.value,
      dimensions: ['month', 'cData', 'oData'],
    },
    yAxis: {
      name: activePrgName.value + '(万元)',
      type: 'value',
      max: 'dataMax',
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(0, 154, 248,.5)',
          width: '1',
        },
      },
      axisTick: {
        show: true,
      },
      axisLine: {
        lineStyle: {
          color: '#009EFF',
        },
      },
    },
    series: [
      {
        name: '去年',
        encode: {
          x: 'month',
          y: 'oData',
        },
        type: 'line',
        lineStyle: {
          normal: {
            color: useGradient('green', 'vertical'),
            width: 2,
            shadowColor: 'rgba(0,0,0,.5)',
            shadowBlur: 2,
            shadowOffsetY: 5,
            shadowOffsetX: 2,
          },
        },
        label: {
          show: true,
          position: 'top',
          textStyle: {
            color: 'rgba(21, 153, 87,0.9)',
            fontSize: 12,
            fontFamily: 'sans-serif',
          },
        },
        itemStyle: {
          normal: {
            color: useGradient('green', 'vertical'),
            borderColor: '#fff',
            borderWidth: 2,
            shadowColor: 'rgba(0, 0, 0, .8)',
            shadowBlur: 2,
            shadowOffsetY: 1,
            shadowOffsetX: 2,
            lineStyle: {
              color: '#3A84FF',
              width: 1,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(21, 153, 87,0)',
                },
                {
                  offset: 1,
                  color: 'rgba(21, 153, 87,0.9)',
                },
              ]),
            },
          },
        },
        smooth: true,
        symbolSize: 5,
        symbol: 'circle',
        hoverAnimation: false,
      },
      {
        name: '本年',
        encode: {
          x: 'month',
          y: 'cData',
        },
        type: 'line',
        label: {
          show: true,
          position: 'top',
          textStyle: {
            color: 'rgba(195, 70, 20,0.9)',
            fontSize: 12,
            fontFamily: 'sans-serif',
          },
        },
        lineStyle: {
          normal: {
            color: useGradient('red', 'vertical'),
            width: 2,
            shadowColor: 'rgba(0,0,0,.5)',
            shadowBlur: 2,
            shadowOffsetY: 5,
            shadowOffsetX: 2,
          },
        },
        itemStyle: {
          normal: {
            color: useGradient('red', 'vertical'),
            borderColor: '#fff',
            borderWidth: 2,
            shadowColor: 'rgba(0, 0, 0, .8)',
            shadowBlur: 2,
            shadowOffsetY: 1,
            shadowOffsetX: 2,
            lineStyle: {
              color: '#3A84FF',
              width: 1,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(195, 70, 20,0)',
                },
                {
                  offset: 1,
                  color: 'rgba(195, 70, 20,0.9)',
                },
              ]),
            },
          },
        },
        smooth: true,
        symbolSize: 5,
        symbol: 'circle',
        hoverAnimation: false,
      },
    ],
  }
})
</script>

<style lang="postcss" scoped>
.monthlyTable .el-table {
  color: #fff;
  background: transparent;
  text-shadow: none;
  font-size: 12px;

  & ::v-deep(thead) {
    color: #fff;
    font-weight: 500;
  }

  & ::v-deep(table) {
    border-color: transparent;
  }

  & ::v-deep(tr),
  & ::v-deep(th) {
    background-color: transparent;
    padding: 4px 0;

    & .is-leaf {
      border-bottom: none;
    }
  }

  & ::v-deep(td) {
    background-color: transparent;
    border-bottom: none;
    padding: 0 !important;
  }

  & ::v-deep(tr) {
    &:nth-child(even) {
      background: rgba(0, 0, 0, 0.2);
    }
  }

  & ::v-deep(.cell) {
    color: #fff;
    font-weight: 500;
    padding-left: 0;
    padding-right: 0;
  }

  & ::v-deep(.el-table__body) tr:hover > td {
    background-color: rgba(0, 132, 255, 0.2);
  }

  & ::v-deep(.el-table__header-wrapper) {
    background: linear-gradient(to right, rgba(var(--active), 0.3), rgba(var(--active), 0.05));
  }

  &::before {
    height: 0;
  }
}

.infoBlock {
  padding: 8px 25px 8px 20px;
  font-size: 14px;
  background: rgba(var(--active), 0);

  @apply flex flex-col items-stretch justify-center transition-all;

  &:hover {
    background: rgba(var(--active), 0.3);
  }

  & li {
    @apply flex justify-between items-center;

    & + li {
      margin-top: 10px;
    }
  }
}

.icon {
  right: 8px;

  @apply absolute;
}

.mountPoint {
  z-index: 1000;

  @apply fixed w-0 h-0 flex items-start justify-items-start overflow-visible;
}

.hoverPanel {
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.1), -2px 2px 20px rgba(0, 0, 0, 0.1);

  @apply relative rounded;
}

.triDeco {
  position: absolute;
  top: -10px;
  left: 10px;
  height: 0;
  width: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 10px solid #000;
}

.panel {
  width: 600px;
  height: 300px;
  position: relative;
  display: flex;
}
</style>
