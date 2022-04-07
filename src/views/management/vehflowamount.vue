<template>
  <Module
    class="h-1/2"
    :info="msMeta && msMeta['passFlow']"
    :loading="globalLoading"
    :error="globalError"
  >
    <template #title>
      {{ activeCom === 'list' ? '折算全程收费总车流量(万辆)' : '折算全程收费车流量及拆分收入' }}
    </template>
    <template #end>
      <span>{{ showDate }}</span>
      <Switcher
        v-if="activeCom === 'list'"
        class="ml-2"
        :options="dateOptions"
        v-model="dateType"
      />
    </template>
    <template v-if="!globalLoading">
      <div
        class="absolute inset-0 overflow-x-hidden overscroll-y-auto flex flex-col p-2 pt-5"
        v-if="activeCom === 'list' && datalist?.length > 0"
      >
        <ul class="w-full flex flex-col">
          <li class="text-xs w-full flex absolute top-1">
            <span class="absolute" :style="{ right: '130px' }">占比</span>
            <span class="absolute" :style="{ right: '20px' }">同比</span>
          </li>
          <li
            class="listItem w-full flex items-center"
            v-for="(item, index) in datalist"
            :key="item.name"
          >
            <div class="index">{{ Number(index) + 1 }}</div>
            <div class="flex-shrink-0" :style="{ width: '100px' }">
              {{ item.name }}
            </div>
            <div
              class="w-full flex justify-end relative px-2 items-center"
              :style="{ height: '6px' }"
            >
              <div class="h-full flex justify-end" :style="{ width: getMaxB(Number(item.value)) }">
                <div class="barContent"></div>
              </div>
              <div class="zb text-xs absolute">
                {{ getZb(Number(item.value), sum) }}
              </div>
            </div>
            <div class="text-right flex-shrink-0" :style="{ width: '50px', fontSize: '12px' }">
              {{ item.value }}
            </div>
            <div
              class="text-right text-blue-400 flex-shrink-0"
              :style="{ width: '50px', fontSize: '12px' }"
            >
              {{ item.tb }}
            </div>
          </li>
        </ul>
      </div>
      <div
        class="absolute inset-0 flex flex-col"
        v-else-if="activeCom !== 'list' && comDatalist?.length > 0"
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
          <template v-for="(item, index) in comDatalist">
            <li
              class="flex-grow my-auto w-full"
              v-if="index === activeShowIndex"
              :key="`com${index}`"
            >
              <div class="comItemItem flex flex-col">
                <div class="flex justify-end text-xs mb-2">
                  <span>车流量(万辆)</span>
                  <span class="ml-4">通行费收入(万元)</span>
                </div>
                <div class="keyValueItem" v-for="row in item.list" :key="row?.label">
                  <div class="whitespace-nowrap flex-shrink-0" :style="{ width: '120px' }">
                    {{ row.label }}
                  </div>
                  <div class="value" :style="{ width: '80px' }">
                    {{ row.flow }}
                  </div>
                  <div class="value flex-grow">{{ row.income }}</div>
                </div>
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
import { state } from '@/store/state'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { comInfo } from '@/store/state'
import { formatThousand, formatYearMonth, formatFix2, formatFix1 } from '@/utils/util'

const dateType = ref(true)
const dateOptions = [
  { name: '当月', value: false },
  { name: '年累计', value: true },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const msMeta = computed(() => store.getters.msMeta)
const appDate = computed(() => store.state.appDate)

const showDate = computed(() => {
  return activeCom.value === 'list'
    ? dateType.value
      ? appDate.value.getFullYear()
      : formatYearMonth(appDate.value)
    : formatYearMonth(appDate.value)
})

const activeUrl = computed(
  () => `/http-server-kpi/publish/jsc/${dateType.value ? 'vehflow' : 'vehflowmonth'}?com=list`
)


// 全部公司级别
const { data, loading, error, run } = useRequest<any>(
  () => genConfig(`${activeUrl.value}&accDate=${showDate.value}`),
  {
    manual: true,
  }
)

const { data: oData, loading: oLoading, error: oError, run: oRun } = useRequest<any>(
  () =>
    genConfig(
      `${activeUrl.value}&accDate=${
        dateType.value
          ? Number(showDate.value) - 1
          : `${Number(appDate.value.getFullYear()) - 1}-${String(showDate.value).split('-')[1]}`
      }`
    ),
  {
    manual: true,
  }
)

watch(
  [activeCom, dateType],
  () => {
    if (activeCom.value === 'list') {
      run()
      oRun()
    }
  },
  {
    immediate: true,
  }
)

const valueKey = computed(() => (dateType.value ? 'totalNums' : 'actNums'))

const datalist = computed(() => {
  const list = data.value?.msgContent?.sort(
    (a: any, b: any) => b[valueKey.value] - a[valueKey.value]
  )
  const oList = oData.value?.msgContent
  if (list?.length > 0) {
    return list.map((e: any) => {
      const oldData = oList?.length > 0 && oList?.find((t: any) => t.orgName === e.orgName)
      const value = e[valueKey.value]
      const olaValue = oldData[valueKey.value]
      return {
        name: e.orgName,
        value: formatFix2(value),
        tb: formatFix1(Math.round((value / olaValue) * 1000) / 10) + '%',
      }
    })
  }
  return []
})

const sum = computed(() =>
  datalist.value?.map((e: any) => Number(e.value))?.reduce((a: number, b: number) => a + b)
)

const max = computed(() => datalist.value?.length > 0 && datalist.value[0].value)

const getZb = (value: number, sum: number) => {
  return sum > 0 && formatFix1(Math.round((value * 1000) / sum) / 10) + '%'
}
const getMaxB = (value: number) => {
  const rate = Math.round((value * 10000) / max.value) / 100
  return rate + '%'
}

// 单个公司下
const comParamsStr = computed(() => {
  const list = [`?accDate=${formatYearMonth(appDate.value)}&com=${activeCom.value}`]
  if (['104', '108'].includes(activeCom.value)) {
    list.push('isRoad=true')
  }
  return list.join('&')
})

const { data: comData, loading: comLoading, error: comError, run: comRun } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/vehflowamount${comParamsStr.value}`),
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

const comTbRows = [
  { label: '本期数', key: 'bqs' },
  { label: '同比', key: 'tb', rate: true },
  { label: '本年累计', key: 'bnlj' },
  { label: '累计同比(日均)', key: 'rjtb', rate: true },
]

const comDatalist = computed(() => {
  const list = comData.value?.msgContent
  if (list?.length > 0) {
    if (['104', '108'].includes(activeCom.value)) {
      const roadList: any = []
      list.forEach(({ roadName }: any) => {
        if (!roadList.includes(roadName)) {
          roadList.push(roadName)
        }
      })
      return roadList.map((roadName: string) => {
        const rList = list.filter((e: any) => e.roadName === roadName)
        return {
          name: roadName,
          list: getList(rList),
        }
      })
    } else {
      return [
        {
          name: list[0].orgName,
          list: getList(list),
        },
      ]
    }
  }
  return []
})

const getList = (list: any) => {
  const income = list.find((e: any) => e.prgName === '通行费收入')
  const flow = list.find((e: any) => e.prgName === '车流量')
  return comTbRows.map(e => {
    return {
      label: e.label,
      flow: (() => {
        if (e.rate) {
          return Math.round(flow[e.key] * 100) + '%'
        }
        return formatFix2(flow[e.key])
      })(),
      income: (() => {
        if (e.rate) {
          return Math.round(income[e.key] * 100) + '%'
        }
        return formatFix2(Math.round(income[e.key] / 100) / 100)
      })(),
    }
  })
}

const comNameList = computed(
  () => comDatalist.value?.length > 0 && comDatalist.value.map((e: any) => e.name)
)

const globalLoading = computed(() =>
  activeCom.value === 'list' ? oLoading.value || loading.value : comLoading.value
)

const globalError = computed(() =>
  activeCom.value === 'list' ? oError.value || error.value : comError.value
)
</script>

<style lang="postcss" scoped>
.index {
  width: 20px;
  height: 20px;
  font-size: 12px;
  line-height: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  background: #0583bd;
  border: 1px solid hsla(0, 0%, 100%, 0.5);
  border-radius: 4px;
}

.listItem {
  & + .listItem {
    margin-top: 6px;
  }
}

.listItem:nth-child(2) .index {
  background: #f02c1e;
}

.listItem:nth-child(3) .index {
  background: #f88604;
}

.listItem:nth-child(4) .index {
  background: #f8cc0a;
}

.zb {
  padding: 2px 4px;
  border-radius: 2px;
  right: 8px;
  background: rgba(0, 0, 0, 0.2);
}

.barContent {
  background: linear-gradient(270deg, #2ec8cf, #3959ff);
  box-shadow: 0 2px 10px #000;
  border-radius: 2px;
  animation: barAnimation 1s both ease-in-out;
  height: 100%;
}

.comItemItem {
  max-width: 320px;
  padding: 10px;
  background: linear-gradient(to left top, rgba(0, 59, 88, 0.3), #004669);
  border: 1px solid rgba(7, 133, 196, 0.4);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);

  @apply mx-auto rounded-sm;
}

.keyValueItem {
  @apply flex;

  & + .keyValueItem {
    margin-top: 4px;
  }

  & .value {
    flex-shrink: 0;
    padding: 0 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
