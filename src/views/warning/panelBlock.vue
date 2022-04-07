<template>
  <div class="panelBlockBox">
    <div class="panelBlock" :class="theme">
      <div class="blockHeader">
        <svg-icon name="headDeco" />
        <span class="px-3">{{ block.name }}</span>
        <i
          class="el-icon-info ml-auto infoIcon"
          :class="theme"
          v-if="idxMeta"
          :title="idxMeta && idxMeta[block.key]"
        />
      </div>
      <div class="loading absolute inset-0 z-40 flex" v-if="loading">
        <Loading class="z-50" />
      </div>
      <div class="blockContent" v-else>
        <ul>
          <infoRow v-for="(item, index) in info" :key="index" :data="item" />
        </ul>
        <ul class="range pb-4">
          <li class="default">
            <span class="head">正常值</span>
            <span class="value">{{ block.g }}</span>
          </li>
          <li class="YELLOW">
            <span class="head">关注值</span>
            <span class="value">{{ block.y }}</span>
          </li>
          <li class="RED">
            <span class="head">最低容忍值</span>
            <span class="value">{{ block.r }}</span>
          </li>
        </ul>
        <!-- <div class="p-4">
          <div class="formula text-gray-400 cursor-help" :title="idxMeta && idxMeta[block.key]">
            {{ idxMeta && idxMeta[block.key] }}
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmit, defineProps } from 'vue'
import titleIcon from '@/assets/images/titleIcon.png'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import infoRow from './infoRow.vue'

const store = useStore(key)
const appDate = computed(() => formatYearMonth(store.state.appDate))
const activeCom = computed(() => store.state.activeCom)
const idxMeta = computed(() => store.getters.idxMeta)

const multiIndex = {
  keys: ['newIncomeComf', 'newProfitComf', 'netProfitComf'],
  comList: ['105', '105', '105', 'list'],
  // comList: ['107', '108', '109', 'list'],
}

const props = defineProps({
  block: {
    type: Object,
    default: () => ({}),
  },
})

const paramsStr = computed(() => {
  const list = [`accDate=${appDate.value}`]

  if (activeCom.value !== 'list' || multiIndex.keys.includes(props.block.key)) {
    list.push(`com=${activeCom.value}`)
  }
  return `?${list.join('&')}`
})

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-kpi/publish/jscidx/${props.block.key}${paramsStr.value}`)
)

watch(paramsStr, refresh)

const theme = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0 && !loading.value) {
    const themes = list.map((e: any) => e.mtag)
    if (themes.length === 1) {
      return ['NVL', 'GREEN'].includes(themes[0]) ? 'default' : themes[0]
    }
    if (themes.includes('RED')) {
      return 'RED'
    }
    if (themes.includes('YELLOW')) {
      return 'YELLOW'
    }
  }
  return 'default'
})

const info = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    let datalist = []
    if (multiIndex.keys.includes(props.block.key) && activeCom.value === 'list') {
      datalist = list.filter((e: any) => multiIndex.comList.includes(e.orgCode))
    } else {
      datalist = [list[0]]
    }

    return (
      datalist
        ?.map((e: any) => {
          return {
            label: e.roadName || '指标因子',
            idxValue: e[props.block.indexKey],
            theme: ['NVL', 'GREEN'].includes(e.mtag) ? 'default' : e.mtag,
            list: props.block.list?.map(({ name, key, type }: any) => ({
              name,
              value: e[key],
              type: type || 'amount',
            })),
          }
        })
        ?.sort((a: any, b: any) => (a.label > b.label ? 1 : -1)) || []
    )
  }
  return []
})

const emit = defineEmit()

watch(
  info,
  () => {
    emit('setCount', {
      key: props.block.key,
      count: {
        default: info.value?.filter((e: any) => e.theme === 'default')?.length,
        RED: info.value?.filter((e: any) => e.theme === 'RED')?.length,
        YELLOW: info.value?.filter((e: any) => e.theme === 'YELLOW')?.length,
      },
    })
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>

<style lang="postcss" scoped>
.panelBlockBox {
  width: 500px;
  padding: 16px;
}

.blockHeader {
  background: linear-gradient(to right, #026096c5, rgba(0, 34, 54, 0.2));
  width: 100%;
  height: 42px;
  padding: 0 10px;

  @apply flex items-center relative;
}

.panelBlock {
  width: 100%;
  height: 100%;
  min-height: 225px;
  border-radius: 2px;

  @apply flex flex-col relative;

  &.default {
    border: 1px solid #026096c5;

    & .blockHeader {
      background: linear-gradient(to right, #026096c5, rgba(0, 34, 54, 0.2));
    }
  }

  &.RED {
    border: 1px solid #ff4040d5;
    box-shadow: 0 10px 40px #ee3b3bc0, inset 0 0 30px #ee3b3bc0;

    & .blockHeader {
      background: linear-gradient(to right, #e63407c5, rgba(0, 34, 54, 0.2));
    }
  }

  &.YELLOW {
    border: 1px solid #e9ec33d5;
    box-shadow: 0 10px 40px #e9ec335d, inset 0 0 30px #e9ec335d;

    & .blockHeader {
      background: linear-gradient(to right, #e6d007c5, rgba(0, 34, 54, 0.2));
    }
  }
}

.range {
  @apply flex justify-around px-4;

  & li {
    width: 100%;
    height: 70px;
    font-size: 13px;

    @apply text-center flex flex-col;

    & .head {
      padding: 2px 0;
    }

    & .value {
      @apply h-full p-0.5 flex items-center justify-center;
    }

    & + li {
      margin-left: 16px;
    }

    &.default {
      border: 1px solid rgba(4, 66, 116, 0.6);

      & .head {
        background: rgba(4, 87, 155, 0.3);
      }
    }

    &.RED {
      border: 1px solid rgba(223, 54, 42, 0.3);

      & .head {
        background: rgba(223, 54, 42, 0.3);
      }
    }

    &.YELLOW {
      border: 1px solid rgba(243, 240, 86, 0.2);

      & .head {
        background: rgba(243, 240, 86, 0.2);
      }
    }
  }
}

.blockContent {
  @apply relative w-full;
}

.loading::after {
  content: " ";
  background: rgba(0, 0, 0, 0.6);

  @apply absolute inset-0;
}

.formula {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.infoIcon {
  cursor: help;
  font-size: 18px;

  &.default {
    color: rgb(4, 134, 255);
  }

  &.RED {
    color: rgb(207, 41, 41);
  }

  &.YELLOW {
    color: rgb(204, 214, 55);
  }
}
</style>
