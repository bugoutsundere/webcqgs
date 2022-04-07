<template>
  <Module class="h-full" :info="msMeta && msMeta['costInfo']" :loading="loading" :error="error">
    <template #title>成本费用分析</template>
    <template #end>
      <Switcher class="ml-2" :options="roadNameList" v-model="activeRoad" />
    </template>
    <template v-if="!loading">
      <div class="absolute inset-0 flex" v-if="datalist?.length > 0">
        <div class="w-full relative flex">
          <el-table class="flex-grow" :data="datalist" height="100%" size="medium">
            <el-table-column align="center" label="项目" key="projectName">
              <template v-slot="scope">
                <span class="projectName">
                  {{ scope.row.projectName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="本年累计">
              <template v-slot="scope">
                <div class="num">
                  {{ (scope.row.bnlj && formatThousand(formatFix2(scope.row.bnlj))) || '-' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="去年累计">
              <template v-slot="scope">
                <div class="num">
                  {{ (scope.row.qnlj && formatThousand(formatFix2(scope.row.qnlj))) || '-' }}
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="差异" prop="diff">
              <template v-slot="scope">
                <div class="num">
                  {{ (scope.row.diff && formatThousand(formatFix2(scope.row.diff))) || '-' }}
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="本年预算">
              <template v-slot="scope">
                <div class="num">
                  {{ (scope.row.bnys && formatThousand(formatFix2(scope.row.bnys))) || '-' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="完成比例">
              <template v-slot="scope">
                <div class="num">
                  {{ getRate(scope.row.finrate) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="成本占比">
              <template v-slot="scope">
                <div class="num">{{ scope.row.costRate }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { formatThousand, formatYearMonth, formatFix2, formatFix1 } from '@/utils/util'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { comInfo } from '@/store/state'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const msMeta = computed(() => store.getters.msMeta)
const appDate = computed(() => formatYearMonth(store.state.appDate))

const paramsStr = computed(() => `?com=${activeCom.value}&accDate=${appDate.value}`)

const { data, loading, error, run } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/amountcostacc${paramsStr.value}`),
  {
    manual: true,
  }
)

watch(
  paramsStr,
  () => {
    if (activeCom.value !== 'list') {
      run()
    }
  },
  {
    immediate: true,
  }
)

const activeRoad = ref('')

const roadNameList = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    const nameList: any = []
    list.forEach((e: any) => {
      if (!nameList.find((t: any) => e.roadName === t.name)) {
        nameList.push({
          name: e.roadName,
          value: e.roadName,
        })
      }
    })
    return nameList
  }
  return []
})

watch(
  roadNameList,
  () => {
    if (roadNameList.value?.length > 0) {
      activeRoad.value = roadNameList.value[0].value
    }
  },
  {
    immediate: true,
  }
)

const datalist = computed(() => {
  const list = data.value?.msgContent
  if (list?.length && activeRoad.value) {
    const roadDataList = list.filter((e: any) => e.roadName === activeRoad.value)
    const heji = roadDataList?.find((e: any) => e.projectName === '合计')
    return roadDataList.map((e: any) => {
      const costRate = getRate(e.bnlj / heji.bnlj)
      return {
        ...e,
        costRate,
      }
    })
  }
  return []
})

const getRate = (num: number) => {
  const number = Number(num)
  return (number && formatFix2(Math.round(number * 10000) / 100) + '%') || '-'
}
</script>

<style lang="postcss" scoped>
.el-table {
  color: #fff;
  background: transparent;
  text-shadow: none;
  font-size: 14px;

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

.num {
  width: 90px;
  text-align: right;
}
</style>
