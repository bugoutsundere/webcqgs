<template>
  <Module
    class="h-1/2"
    :info="msMeta && msMeta['emplCost']"
    :loading="globalLoading"
    :error="globalError"
  >
    <template #title>{{
      activeCom === 'list' ? '人均利润总额及付现成本' : '利润总额完成情况'
    }}</template>
    <template #end>
      <span>{{ showDate }}</span>
      <Switcher
        class="ml-2"
        v-if="activeCom === 'list'"
        :options="dateOptions"
        v-model="dateType"
      />
    </template>
    <template v-if="!globalLoading">
      <div v-if="activeCom === 'list' && datalist?.length > 0" class="absolute inset-0 flex">
        <div class="w-full relative flex">
          <el-table size="small" class="flex-grow" :data="datalist" height="100%">
            <el-table-column align="center" prop="name" label="公司名称"></el-table-column>
            <el-table-column
              align="center"
              prop="profit"
              label="人均利润(万)"
              sortable
              :width="115"
            >
              <template v-slot="scope">
                <div class="text-right" :style="{ width: '50px' }">
                  {{ formatFix2(scope.row.profit) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="cost" label="人均成本(万)" :width="115" sortable>
              <template v-slot="scope">
                <div class="text-right" :style="{ width: '50px' }">
                  {{ formatFix2(scope.row.cost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="ep" label="人数" :width="80" sortable>
              <template v-slot="scope">
                <div class="text-right" :style="{ width: '30px' }">
                  {{ scope.row.ep }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div
        class="absolute inset-0 flex flex-col"
        v-else-if="activeCom !== 'list' && comDataList?.length > 0"
      >
        <ul class="flex -ml-4 justify-center mt-4" v-if="comNameList?.length > 1">
          <li
            class="cursor-pointer ml-4 transition-all"
            :class="{ 'text-blue-500': index === activeShowIndex }"
            v-for="(name, index) in comNameList"
            @click="activeShowIndex = Number(index)"
            :key="name"
          >
            {{ name }}
          </li>
        </ul>
        <ul
          class="flex h-full overflow-y-hidden overflow-x-scroll"
          :class="{ '-mt-2': comNameList?.length > 1 }"
        >
          <template v-for="(item, index) in comDataList">
            <li
              class="flex-grow my-auto w-full"
              v-if="index === activeShowIndex"
              :key="`com${index}`"
            >
              <div class="comItemItem">
                <div class="keyValueItem" v-if="item.roadName">
                  <span class="label">路段</span>
                  <span class="value">{{ item.roadName }}</span>
                </div>
                <div class="keyValueItem" v-if="item.orgName">
                  <span class="label">项目公司</span>
                  <span>{{ item.orgName }}</span>
                </div>
                <template v-for="(info, tindex) in comItems" :key="`comValues${tindex}`">
                  <div class="keyValueItem" v-if="item.hasOwnProperty(info.key)">
                    <span class="label">{{ info.label }}</span>
                    <span class="value">
                      {{ formatComValue(info, Number(item[info.key])) }}
                    </span>
                  </div>
                </template>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { comInfo } from '@/store/state'

const dateType = ref(true)
const dateOptions = [
  { name: '当月', value: false },
  { name: '年累计', value: true },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const msMeta = computed(() => store.getters.msMeta)
const appDate = computed(() => store.state.appDate)

const showDate = computed(() =>
  activeCom.value === 'list' && dateType.value
    ? appDate.value.getFullYear()
    : formatYearMonth(appDate.value)
)

// 全部公司级别
const { data, loading, error, run } = useRequest<any>(
  () =>
    genConfig(
      `/http-server-kpi/publish/jsc/monthlynew?com=list&accDate=${formatYearMonth(
        appDate.value
      )}&a=1`
    ),
  {
    manual: true,
  }
)

const { data: epData, loading: epLoading, error: epError, run: epRun } = useRequest<any>(
  () =>
    genConfig(
      `/http-server-kpi/publish/jsc/employeenew?com=list&accDate=${formatYearMonth(appDate.value)}`
    ),
  {
    manual: true,
  }
)

watch(
  [appDate, activeCom],
  () => {
    if (activeCom.value === 'list') {
      run()
      epRun()
    }
  },
  {
    immediate: true,
  }
)

const globalLoading = computed(() =>
  activeCom.value === 'list' ? loading.value || epLoading.value : comLoading.value
)
const globalError = computed(() =>
  activeCom.value === 'list' ? error.value || epError.value : comError.value
)

const getRate = (amount: number, num: number) => {
  return Number(Math.round(amount / num / 100) / 100)
}

const valueKey = computed(() => (dateType.value ? 'totalcurval' : 'curval'))

const datalist = computed(() => {
  const monthlyList = data.value?.msgContent
  const epList = epData.value?.msgContent
  if (activeCom.value === 'list' && monthlyList?.length > 0 && epList?.length > 0) {
    const profitList = monthlyList.filter((e: any) => e.prgName === '利润总额')
    const costList = monthlyList.filter((e: any) => e.prgName === '付现成本')
    return comInfo.map(({ name, code }) => {
      const profit = profitList.find((e: any) => e.orgCode === code)
      const cost = costList.find((e: any) => e.orgCode === code)
      const ep = epList
        .filter((e: any) => e.orgCode === code && e.prgName.indexOf('员工数量') !== 0)
        ?.map((e: any) => Number(e.accval))
        .reduce((a: number, b: number) => a + b)
      return {
        name,
        ep: ep || 0 || 0,
        profit: getRate((profit && profit[valueKey.value]) || 0, ep || 0),
        cost: getRate((cost && cost[valueKey.value]) || 0, ep || 0),
      }
    })
  }
  return []
})
// 单个公司下
const comParamsStr = computed(() => {
  const list = [`?accDate=${formatYearMonth(appDate.value)}&com=${activeCom.value}`]
  if (['104', '108'].includes(activeCom.value)) {
    list.push('isRoad=true')
  }
  return list.join('&')
})
const { data: comData, error: comError, loading: comLoading, run: comRun } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/amountFinRate${comParamsStr.value}`),
  {
    manual: true,
  }
)

const activeShowIndex = ref(0)

watch(
  comParamsStr,
  () => {
    if (activeCom.value !== 'list') {
      activeShowIndex.value = 0
      comRun()
    }
  },
  {
    immediate: true,
  }
)

const comItems = [
  { label: '本年KPI', key: 'kpivalue' },
  { label: '当月发生数', key: 'dyfss', round: true },
  { label: '当年累计值', key: 'dnljs', round: true },
  { label: '上年同期发生数', key: 'syfss', round: true },
  { label: '上年同期累计值', key: 'sntqlj', round: true },
  { label: '同比', key: 'tb', rate: true },
  { label: '累计同比', key: 'snljtb', rate: true },
]

const formatComValue = (info: any, value: number) => {
  if (info.round) {
    return formatThousand(formatFix2(Math.round(value * 100) / 100))
  } else if (info.rate) {
    return Math.round(value * 10000) / 100 + '%'
  } else {
    return formatThousand(value)
  }
}

const comDataList = computed(() => {
  const list = comData.value?.msgContent
  if (activeCom.value !== 'list' && list?.length > 0) {
    return list
  }
  return []
})

const comNameList = computed(() => {
  if (comDataList.value?.length > 0) {
    return comDataList.value.map((e: any) => (e.roadName ? e.roadName : e.orgName))
  }
  return []
})
</script>

<style lang="postcss" scoped>
.el-table {
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
    padding: 4px 0;
  }

  & ::v-deep(tr) {
    &:nth-child(even) {
      background: rgba(0, 0, 0, 0.2);
    }
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

.keyValueItem {
  @apply flex justify-between;

  & + .keyValueItem {
    margin-top: 2px;
  }
}

.comItemItem {
  max-width: 300px;
  padding: 10px;
  background: linear-gradient(to left top, rgba(0, 59, 88, 0.3), #004669);
  border: 1px solid rgba(7, 133, 196, 0.4);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);

  @apply mx-auto rounded-sm;
}
</style>
