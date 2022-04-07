<template>
  <Module
    class="h-1/3"
    :loading="loading || tLoading"
    :error="error || tError"
    :info="osMeta && osMeta['purchaseInfo']"
  >
    <template #title>项目采购情况</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <div
      class="absolute inset-0 flex flex-col"
      v-if="!(loading || tLoading) && sumData && dataList?.length > 0"
    >
      <div class="flex-shrink-0 flex p-1" :style="{ height: '46px' }">
        <div class="num-block" v-waves>
          <span>总数</span>
          <span class="num">{{ sumData ? sumData.count : '-' }}</span>
          <span>项</span>
        </div>
        <div class="num-block ml-1" v-waves>
          <span>总金额</span>
          <span class="num">{{ sumData ? sumData.amount : '-' }}</span>
          <span>万元</span>
        </div>
      </div>
      <div class="flex-grow relative">
        <div class="absolute inset-0 flex">
          <div class="w-full relative flex">
            <el-table size="small" class="flex-grow" :data="list" height="100%">
              <el-table-column align="center" prop="typeName" label="业务类型"></el-table-column>
              <el-table-column
                align="center"
                prop="count"
                label="采购总数"
                :width="70"
              ></el-table-column>
              <el-table-column align="center" prop="amount" label="总金额(万)"></el-table-column>
              <el-table-column
                align="center"
                prop="rate"
                label="百分比"
                :width="80"
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <Empty v-else-if="!(loading || tLoading)" />
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { formatThousand, formatFix2, formatYearMonth } from '@/utils/util'

const formatNum = (num: number) => {
  const number =
    activeCom.value === 'list' ? Math.round(num / 10000) : formatFix2(Math.round(num / 100) / 100)
  return formatThousand(number)
}

const store = useStore(key)
const appDate = computed(() => store.state.appDate)
const activeCom = computed(() => store.state.activeCom)
const osMeta = computed(() => store.getters.osMeta)

const dateType = ref('year')
const dateOptions = [
  { name: '月', value: 'month' },
  { name: '年', value: 'year' },
]

const showDate = computed(() =>
  dateType.value === 'year' ? appDate.value?.getFullYear() : formatYearMonth(appDate.value)
)

const paramstr = computed(() => {
  const list = [`accDate=${showDate.value}`]
  activeCom.value !== 'list' && list.push(`com=${activeCom.value}`)
  return `?${list.join('&')}`
})

// 汇总数据
const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-yonyu/publish/jsc/praybill${paramstr.value}`)
)

const sumData = computed(() => {
  const list: any = data.value?.msgContent
  if (list?.length > 0) {
    const { budNums, budTotal } = list[0]
    return {
      count: formatThousand(budNums),
      amount: formatNum(budTotal),
    }
  }
  return null
})

// 类型 数据
const { data: tData, loading: tLoading, error: tError, refresh: tRefresh } = useRequest<any>(() =>
  genConfig(`/http-server-yonyu/publish/jsc/praybillType${paramstr.value}`)
)

watch(paramstr, () => {
  refresh()
  tRefresh()
})

const dataList = computed(() => tData.value?.msgContent)

const sum = computed(() => {
  if (dataList.value?.length > 0) {
    return dataList.value
      .map(({ bizTotal }: any) => Number(bizTotal))
      .reduce((a: number, b: number) => a + b)
  }
  return 0
})

const getRate = (sumData: number, total: number) => {
  if (sumData <= 0) {
    return '-'
  }
  return formatFix2(Math.round((total * 10000) / sumData) / 100) + '%'
}

const list = computed(() => {
  if (dataList.value?.length > 0) {
    return dataList.value
      .map(({ bizTotal, bizNums, bizType }: any) => ({
        typeName: bizType,
        count: formatThousand(bizNums),
        amount: formatNum(bizTotal),
        total: bizTotal,
        rate: getRate(sum.value, bizTotal),
      }))
      .sort((a: any, b: any) => b.total - a.total)
  }
  return []
})
</script>

<style lang="postcss" scoped>
.num-block {
  background: linear-gradient(
    to right,
    rgba(var(--active), 0.1),
    rgba(var(--active), 0.3),
    rgba(var(--active), 0.05)
  );
  border: 1px solid rgba(7, 133, 196, 0.4);
  font-size: 12px;

  @apply w-full flex items-center justify-between px-3 rounded-sm;

  & .num {
    font-size: 20px;
  }
}

.module {
  padding: 0 !important;
}

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
</style>
