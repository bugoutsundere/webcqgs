<template>
  <Module
    class="w-1/3"
    :info="bsMeta && bsMeta['machineDetail']"
    :loading="loading || comLoading"
    :error="error || comError"
  >
    <template #title>
      {{ `收费人员效率` }}
    </template>
    <template #end>
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <Ect
      :options="ectOpts"
      v-if="activeCom === 'list' && dataList?.length > 0"
    />
    <div
      class="eq-list-container"
      v-else-if="activeCom !== 'list' && eqSubNums?.length > 0"
    >
      <ul class="eq-list">
        <li
          class="eq-item-box"
          v-for="(item, index) in eqSubNums"
          :key="`${activeCom}${activeEq}${index}`"
        >
          <div class="eq-item">
            <svg-icon class="icon" :name="activeEqObj?.key || ''"></svg-icon>
            <span class="ml-2">{{ item.eqName }}</span>
            <span class="ml-auto">{{ formatThousand(item.eqNums) }}</span>
          </div>
        </li>
      </ul>
    </div>
    <Empty v-else-if="!(loading || comLoading)" />
  </Module>
</template>

<script lang="ts" setup>
import { defineProps, computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";
import { eqInfo, comInfo } from "@/store/state";
import { genConfig } from "@/utils/request";
import { useRequest } from "vue-request";

import { useGradient } from "@/utils/color";
import { formatThousand } from "@/utils/util";
import {
  formatYearMonth,
  formatDate,
  formatThousandAndReservedBits,
  formatThousandMoney,
} from "@/utils/util";

import { getYearSectionToll } from "@/api/tollManage";

defineProps({
  info: {
    type: String,
    default: "",
  },
});

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);
const activeEq = computed(() => store.state.activeEq);
const bsMeta = computed(() => store.getters.bsMeta);

const activeEqObj = computed(() =>
  eqInfo.find((e) => e.name === activeEq.value)
);

// 各个公司某一类设备
const { data, loading, error, run } = useRequest<any>(
  () =>
    genConfig(
      `/http-server-yonyu/publish/jsc/eqNums?com=list&typeCode=${activeEq.value}`
    ),
  {
    manual: true,
  }
);

// 全部公司下，设备类型改变
watch(
  [activeCom, activeEq],
  () => {
    if (activeCom.value === "list") {
      run();
    }
  },
  { immediate: true }
);
const dateType = ref(true);
const dateOptions = [
  { name: "去年", value: false },
  { name: "本年", value: true },
];

const LastYear = () => {
  let date = new Date();
  return date.getFullYear() - 1 + "";
};
const beforeLastYear = () => {
  let date = new Date();
  return date.getFullYear() - 2 + "";
};
const YearSection = useRequest<any>(() =>
  getYearSectionToll("", "", LastYear(), formatDate(new Date(), "yyyy"))
);
const LastYearSection = useRequest<any>(() =>
  getYearSectionToll("", "", beforeLastYear(), LastYear())
);

const dataList = computed(() => {
  const list: any = [];
  if (!loading.value) {
    comInfo.forEach(({ name, code }) => {
      const comData = data.value?.msgContent?.find(
        ({ orgCode }: any) => orgCode === code
      );
      comData && list.push(comData);
    });
  }
  const showData = dateType.value ? YearSection : LastYearSection;
  if (showData?.data?.value?.msgContent?.length) {
    list.push({});
  }

  return list;
});

const staticOptions = {
  grid: {
    top: 26,
    left: 50,
    bottom: 40,
    right: 20,
  },
  color: [useGradient("blue", "vertical")],
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderColor: "#000",
    axisPointer: {
      type: "shadow",
    },
    textStyle: {
      fontSize: 12,
      color: "#fff",
    },
  },
  yAxis: {
    splitNumber: 3,
    splitLine: {
      show: true,
      lineStyle: {
        color: "rgba(0, 154, 248,.5)",
        width: "1",
      },
    },
    axisLine: {
      lineStyle: {
        color: "#009EFF",
      },
    },
    axisLabel: {
      show: true,
      fontSize: 10,
    },
  },
  xAxis: {
    type: "category",
    axisLine: {
      lineStyle: {
        color: "#01A3FF",
        width: "1",
      },
    },
    axisTick: {
      alignWithLabel: true,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "rgba(0, 154, 248,.5)",
        width: "1",
      },
    },
    axisLabel: {
      rotate: 15,
      fontSize: 12,
      fontWeight: "400",
    },
  },
};
// dataList.value
const ectOpts = computed(() => {
  const staffAvrgFlowList: Array<number> = [];
  const staffAvrgFeeList: Array<number> = [];
  const xData: Array<string> = [];
  console.log("dataType", dateType.value);
  const showData = dateType.value ? YearSection : LastYearSection;
  var clientcounts: Array[number] = [0, 0];
  showData?.data?.value?.msgContent?.map((item) => {
    staffAvrgFlowList.push(formatThousandAndReservedBits(item.staffAvrgFlow));
    staffAvrgFeeList.push(formatThousandMoney(item.staffAvrgFee));
    xData.push(item.sectionName);
    clientcounts[0] += Number(formatThousandMoney(item.staffAvrgFee));
    clientcounts[1] += Number(
      formatThousandAndReservedBits(item.staffAvrgFlow)
    );
  });
  clientcounts[0] = (
    clientcounts[0] / showData?.data?.value?.msgContent.length
  ).toFixed(2);
  clientcounts[1] = (
    clientcounts[1] / showData?.data?.value?.msgContent.length
  ).toFixed(2);
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    color: ["#08a4fa", "#FFB400"],
    legend: {
      data: ["收费额", "接车数"],
      textStyle: {
        fontSize: 13, //字体大小
        color: "#CBE7FF", //字体颜色
      },
      formatter: function (name) {
        var index = 0;
        var clientlabels = ["收费额", "接车数"];
        clientlabels.forEach(function (value, i) {
          if (value == name) {
            index = i;
          }
        });
        return "人均" + name + "  " + clientcounts[index];
      },
    },
    xAxis: {
      type: "category",
      data: xData,
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: "#778FA4",
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "收费额",
        nameTextStyle: {
          color: "#CBE7FF",
          fontSize: 12,
          fontWeight: "bold",
        },
        min: 0,
        // max: 250,
        position: "left",
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: "{value} w",
          textStyle: {
            color: "#778FA4",
          },
        },
        splitLine: {
          show: false,
        },
      },
      {
        type: "value",
        name: "接车数",
        nameTextStyle: {
          color: "#CBE7FF",
          fontSize: 12,
          fontWeight: "bold",
        },
        min: 0,
        // max: 250,
        position: "right",
        offset: 0,
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: "{value} w",
          textStyle: {
            color: "#778FA4",
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "收费额",
        type: "pictorialBar",
        barCategoryGap: "0",
        // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
        symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
        itemStyle: {
          color: function (params) {
            return {
              colorStops: [
                {
                  offset: 0,
                  color: "#1268f3",
                },
                {
                  offset: 0.6,
                  color: "#08a4fa",
                },
                {
                  offset: 1,
                  color: "#01ccfe",
                },
              ],
            };
          },
          borderColor: "#00E8FD",
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            opacity: 1,
          },
        },
        data: staffAvrgFeeList,
      },
      {
        name: "接车数",
        yAxisIndex: 1,
        data: staffAvrgFlowList,
        type: "line",
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: "#FFB400",
        },
        lineStyle: {
          width: 3,
          color: "#FFB400", //折线颜色
          shadowOffsetX: 0, // 折线的X偏移
          shadowOffsetY: 0, // 折线的Y偏移
          shadowBlur: 30, // 折线模糊
          shadowColor: "#FFB400", //折线颜色
        },
      },
    ],
  };
  return options;
});

// 单个公司的设备列表
const {
  data: comData,
  loading: comLoading,
  error: comError,
  run: comRun,
} = useRequest<any>(
  () =>
    genConfig(
      `/http-server-yonyu/publish/jsc/eqSubNums?com=${activeCom.value}&typeCode=${activeEq.value}`
    ),
  {
    manual: true,
  }
);

watch(
  [activeCom, activeEq],
  () => {
    if (activeCom.value !== "list") {
      comRun();
    }
  },
  {
    immediate: true,
  }
);

const eqSubNums = computed(() => comData.value?.msgContent);
</script>

<style lang="postcss" scoped>
.eq-list-container {
  @apply absolute inset-0 overflow-x-hidden overscroll-y-auto;
}

.eq-list {
  @apply w-full flex flex-wrap p-0.5;
}

.eq-item-box {
  @apply p-0.5 w-1/2 lg:w-1/3 2xl:w-1/4 h-auto;
}

.eq-item {
  background: linear-gradient(
    to left top,
    rgba(0, 59, 88, 0.3),
    rgba(0, 70, 105, 1)
  );
  border: 1px solid rgba(7, 133, 196, 0.4);

  @apply relative w-full rounded-sm flex items-center px-2 py-2;
}

.icon {
  font-size: 25px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
