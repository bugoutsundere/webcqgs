<template>
  <Module
    class="flex-grow"
    :loading="loading || comLoading"
    :error="error"
    :info="bsMeta && bsMeta['utilitiesDetail']"
  >
    <template #title>基础设施统计 - {{ activeBaseStructModel?.name }}</template>
    <!-- {{ dataList }} -->
    <Ect :options="ectOpts" v-if="activeCom === 'list' && dataList?.length > 0" />
    <ul class="com-data-list" v-else-if="activeCom !== 'list' && baseStructDetail?.length > 0">
      <li
        class="com-data-item"
        v-for="(item, index) in baseStructDetail"
        :key="`${activeCom}${activeBaseStruct}${index}`"
      >
        <div class="item">
          <svg-icon :name="activeBaseStruct"></svg-icon>
          <span class="ml-2">{{ item.title }}</span>
          <div class="dataWarp">
            <div class="prop" v-if="item.demo">{{ item.demo }}</div>
            <div class="prop" v-if="item.ext">{{ item.ext }}</div>
          </div>
        </div>
      </li>
    </ul>
    <Empty v-else-if="!(loading || comLoading)" />
  </Module>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { baseStructInfo, comInfo } from '@/store/state'
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import { watch, defineProps } from 'vue'
import { useGradient } from '@/utils/color'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const activeBaseStruct = computed(() => store.state.activeBaseStruct)
const bsMeta = computed(() => store.getters.bsMeta)

const activeBaseStructModel = computed(() => {
  return baseStructInfo.find(e => e.code === activeBaseStruct.value)
})

const modelKeys = computed(() => {
  if (!activeBaseStructModel.value?.children) {
    return new Array<any>({
      key: activeBaseStructModel.value?.key,
      name: activeBaseStructModel.value?.name,
    })
  } else {
    return activeBaseStructModel.value?.children?.map(({ key, name }: any) => ({
      key,
      name,
    }))
  }
})

// 各个公司基础设施列表
const { data, loading, error } = useRequest<any>(
  () => genConfig(`/http-server-yygl/publish/jsc/baseStruct?com=list`),
  {
    ready: computed(() => activeCom.value === 'list'),
  }
)

const dataList = computed(() => {
  // const list: any = []
  // comInfo.forEach(({ code, name }) => {
  //   const item: any = { orgName: name }
  //   const comData = data.value?.msgContent?.find((e: any) => e.orgCode === code)
  //   if (comData) {
  //     modelKeys.value?.forEach(({ key }: any) => {
  //       item[key] = comData[key]
  //     })
  //     list.push(item)
  //   }
  // })
  const list =  [
  {
    "orgName": "遂渝高速",
    "tollStatNums": "0"
  },
  {
    "orgName": "潼荣高速",
    "tollStatNums": "0"
  },
  {
    "orgName": "秀松高速",
    "tollStatNums": "0"
  },
  {
    "orgName": "永泸高速",
    "tollStatNums": "0"
  },
  {
    "orgName": "合安高速",
    "tollStatNums": "0"
  },
  {
    "orgName": "石黔高速",
    "tollStatNums": "0"
  }
]
  return list
})

const staticOptions = {
  color: [useGradient('blue'), useGradient('red'), useGradient('yellow'), useGradient('green')],
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
  yAxis: {
    type: 'category',
    inverse: true,
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
      fontWeight: '400',
    },
  },
}

const staticSeriesOptions = {
  type: 'bar',
  stack: '总量',
  barWidth: '40%',
  itemStyle: {
    opacity: 1,
    shadowColor: 'rgba(0, 0, 0, .8)',
    shadowBlur: 4,
    shadowOffsetY: 1,
    shadowOffsetX: 2,
    borderColor: '#fff',
    borderWidth: 1,
  },
}

const ectOpts = computed(() => {
  const labelPos = modelKeys.value?.length > 1 ? 'bottom' : 'right'
  const options: any = {
    legend: {
      show: modelKeys.value?.length > 1,
      itemGap: 20,
      x: 90,
      y: 10,
      textStyle: {
        color: '#ffffff',
      },
    },
    grid: {
      top: modelKeys.value?.length > 1 ? 50 : 12,
      left: 90,
      bottom: 30,
      right: 40,
    },
    dataset: {
      source: dataList.value,
      dimensions: ['orgName', ...modelKeys.value?.map(e => e.key)],
    },
    series: modelKeys.value?.map(({ name, key }: any) => {
      return {
        name,
        encode: {
          x: key,
          y: 'orgName',
        },
        label: {
          show: true,
          position: labelPos,
          color: '#fff',
          lineHeight: 12,
          fontSize: 12,
          fontFamily: 'sans-serif',
          verticalAlign: 'middle',
          borderRadius: 2,
          offset: labelPos === 'bottom' ? [0, 10] : [0, 0],
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: [2, 4],
        },
        ...staticSeriesOptions,
      }
    }),
    ...staticOptions,
  }
  return options
})

// 公司基础设施列表
const { run: comRun, data: comData, loading: comLoading, error: comError } = useRequest<any>(
  () =>
    genConfig(
      `/http-server-yygl/publish/jsc/baseStructDetail?com=${activeCom.value}&type=${activeBaseStruct.value}`
    ),
  {
    manual: true,
  }
)

const baseStructDetail = computed(() => comData.value?.msgContent)

watch(
  [activeCom, activeBaseStruct],
  () => {
    if (activeCom.value !== 'list') {
      comRun()
    }
  },
  {
    immediate: true,
  }
)
</script>

<style lang="postcss" scoped>
.com-data-list {
  @apply absolute inset-0 overflow-x-hidden overscroll-y-auto flex flex-col p-0.5;
}

.com-data-item {
  @apply p-0.5;
}

.item {
  background: linear-gradient(to left top, rgba(0, 59, 88, 0.3), rgba(0, 70, 105, 1));
  border: 1px solid rgba(7, 133, 196, 0.4);

  @apply w-full rounded-sm flex items-center px-2 py-2;

  & .svg-icon {
    font-size: 25px;
    color: rgba(255, 255, 255, 0.5);
  }
}

.dataWarp {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  text-shadow: none;
  margin-left: auto;
  font-size: 14px;
}

.prop + .prop {
  margin-top: 5px;
}

.prop:nth-child(2) {
  color: rgb(0, 180, 224);
}
</style>
