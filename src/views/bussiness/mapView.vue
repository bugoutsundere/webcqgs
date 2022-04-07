<template>
  <Module
    class="flex-grow"
    :info="bsMeta && bsMeta['mapView']"
    :loading="loading"
  >
    <div class="absolute inset-0 overflow-hidden">
      <slot />
      <Ect
        v-if="!loading && dataList?.length > 0"
        class="z-40"
        :options="ectOptions"
        @ectCheck="ectCheck"
      />
      <Empty v-else-if="!loading" />
      <!-- {{ dataList }} -->
    </div>
  </Module>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { useRouter } from "vue-router";
import { genConfig } from "@/utils/request";
import { useRequest } from "vue-request";
import { useStore } from "vuex";
import { comInfo } from "@/store/state";
import { key } from "@/store";
import { useGradient } from "@/utils/color";

/*const geoCoordMap: any = {
  甬台温高速: [120.699879, 27.930926],
  桂林公司: [110.308324, 25.374422],
  贵黄公司: [106.544594, 26.579682],
  重庆公司: [106.552688, 29.582314],
  九瑞高速: [115.894544, 29.624725],
  鄂东大桥: [115.078523, 30.264948],
  宁波交通科技: [121.793249, 29.896431],
  亳阜高速: [115.875878, 33.832651],
  京津塘高速: [116.58485, 39.75525],
  招商中铁: [108.376098, 22.82454],
}*/

const geoCoordMap: any = {
  中铁建昆仑投资集团: [104.065633, 30.547988],
  // 建新公司: [106.40309,29.80243],
  // 双合公司: [106.403243,29.802354],
  // 遂渝公司: [106.519111,29.620469],
};

const store = useStore(key);
const router = useRouter();
const activeCom = computed(() => store.state.activeCom);
const bsMeta = computed(() => store.getters.bsMeta);

const activeCenter = computed(() => {
  let name: any = "";
  if (activeCom.value === "list") {
    return [117.98561551896913, 31.205000490896193];
  }
  let item = comInfo.find((e) => e.code === activeCom.value);
  name = item?.name;
  return geoCoordMap[name];
});

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-kpi/publish/jsc/baseCom`)
);

// const dataList = computed(() =>
//   data.value?.msgContent
//     ?.sort((a: any, b: any) => b.mil - a.mil)
//     .map(({ mil, orgName, ...e }: any) => ({
//       name: orgName,
//       value: mil,
//       ...e,
//     }))
// );

const dataList = computed(() => [
  {
    name: "遂渝高速",
    value: 93,
    id: 1,
    oprCrtTime: "20211022155213",
    orgCode: "108",
  },
  {
    name: "潼荣高速",
    value: 138.456,
    id: 2,
    oprCrtTime: "20211022155213",
    orgCode: "102",
  },
  {
    name: "秀松高速",
    value: 30.571,
    id: 3,
    oprCrtTime: "20211022155213",
    orgCode: "109",
  },
  {
    name: "永泸高速",
    value: 20.943,
    id: 4,
    oprCrtTime: "20211022155213",
    orgCode: "110",
  },
  {
    name: "合安高速",
    value: 18.414,
    id: 5,
    oprCrtTime: "20211022155213",
    orgCode: "106",
  },
  {
    name: "石黔高速",
    value: 83.1,
    id: 6,
    oprCrtTime: "20211022155213",
    orgCode: "101",
  },
]);

const comNum = computed(
  () => dataList.value?.find((e: any) => e.orgCode === activeCom.value)?.value
);

const categoryData = computed(() => dataList.value?.map((e: any) => e.name));
const max = computed(
  () => dataList.value?.length > 0 && dataList.value[0].value
);
const subData = computed(() =>
  dataList.value?.map((e: any) => e.value).map((e: any) => max.value - e)
);

const staticOptions = {
  animation: true,
  animationDuration: 1000,
  animationEasing: "cubicInOut",
  animationDurationUpdate: 1000,
  animationEasingUpdate: "cubicInOut",

  grid: {
    right: 90,
    top: 180,
    height: "60%",
    width: "50%",
  },
  xAxis: {
    type: "value",
    position: "top",
    boundaryGap: false,
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: false,
      margin: 2,
      color: "#aaa",
    },
  },
};

const convertedData = computed(() => {
  let res = [];
  for (let i = 0; i < dataList.value?.length; i++) {
    let geoCoord = geoCoordMap[dataList.value[i].name];
    if (geoCoord) {
      res.push({
        name: dataList.value[i].name,
        value: geoCoord.concat(dataList.value[i].value),
      });
    }
  }
  return res;
});

const barSeries = computed(() => [
  {
    type: "bar",
    stack: "总量",
    data: subData.value,
    itemStyle: {
      color: "rgba(0,0,0,0)",
    },
  },
  {
    id: "bar",
    zlevel: 2,
    type: "bar",
    symbol: "none",
    stack: "总量",
    barWidth: "60%",
    label: {
      show: true,
      position: "left",
      distance: 10,
      color: "#ffffff",
      fontSize: 18,
      lineHeight: 12,
      fontWeight: 500,
      verticalAlign: "middle",
      offset: [0, 2],
      borderRadius: 2,
      borderWidth: 1,
      backgroundColor: "rgba(0,0,0 ,0.2)",
      padding: [2, 4],
    },
    itemStyle: {
      color: useGradient("blue"),
      borderColor: "#fff",
      borderWidth: 1,
      shadowColor: "rgba(0, 0, 0, .2)",
      shadowBlur: 2,
      shadowOffsetY: 4,
      shadowOffsetX: -4,
    },
    data: dataList.value,
  },
]);

const geoSeries = computed(() => [
  {
    type: "scatter",
    coordinateSystem: "geo",
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 3, 8);
      return value > 90 ? 90 : value;
    },
    label: {
      show: false,
    },
    itemStyle: {
      color: "#FF8C00",
      position: "right",
      show: true,
    },
  },
  {
    type: "effectScatter",
    coordinateSystem: "geo",
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 5, 8);
      return value > 70 ? 70 : value;
    },
    showEffectOn: "render",
    rippleEffect: {
      brushType: "stroke",
      scale: 4,
    },
    label: {
      formatter: "{b}",
      position: "right",
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    itemStyle: {
      color: "#f4e925",
      shadowBlur: 50,
      shadowColor: "#EE0000",
    },
    zlevel: 1,
  },
  {
    type: "effectScatter",
    coordinateSystem: "geo",
    name: "运行概况",
    showEffectOn: "render",
    rippleEffect: {
      brushType: "stroke",
      scale: 4,
    },
    label: {
      formatter: "重庆总部",
      position: "right",
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    symbolSize: function (val: any) {
      return 20;
    },
    itemStyle: {
      color: "#f4e925",
      shadowBlur: 50,
      shadowColor: "#EE0000",
    },
    data: [[106.54, 29.59]],
  },
]);

const geoSeries2 = computed(() => [
  {
    type: "scatter",
    coordinateSystem: "geo",
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 3, 8);
      return value > 90 ? 90 : value;
    },
    label: {
      show: false,
    },
    itemStyle: {
      color: "#FF8C00",
      position: "right",
      show: true,
    },
  },
  {
    type: "effectScatter",
    coordinateSystem: "geo",
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 5, 8);
      return value > 70 ? 70 : value;
    },
    showEffectOn: "render",
    rippleEffect: {
      brushType: "stroke",
      scale: 4,
    },
    label: {
      formatter: "{b}",
      position: "right",
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    itemStyle: {
      color: "#f4e925",
      shadowBlur: 50,
      shadowColor: "#EE0000",
    },
    zlevel: 1,
  },
  {
    type: "effectScatter",
    coordinateSystem: "geo",
    name: " ",
    showEffectOn: "render",
    rippleEffect: {
      brushType: "stroke",
      scale: 4,
    },
    label: {
      formatter: "四川地区",
      position: "right",
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    symbolSize: function (val: any) {
      return 20;
    },
    itemStyle: {
      color: "#989898",
      shadowBlur: 50,
      shadowColor: "#EE0000",
    },
    data: [[104.07808, 30.671924]],
  },
]);

const geoSeries3 = computed(() => [
  {
    type: "scatter",
    coordinateSystem: "geo",
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 3, 8);
      return value > 90 ? 90 : value;
    },
    label: {
      show: false,
    },
    itemStyle: {
      color: "#FF8C00",
      position: "right",
      show: true,
    },
  },
  {
    type: "effectScatter",
    coordinateSystem: "geo",
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 5, 8);
      return value > 70 ? 70 : value;
    },
    showEffectOn: "render",
    rippleEffect: {
      brushType: "stroke",
      scale: 4,
    },
    label: {
      formatter: "{b}",
      position: "right",
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    itemStyle: {
      color: "#f4e925",
      shadowBlur: 50,
      shadowColor: "#EE0000",
    },
    zlevel: 1,
  },
  {
    type: "effectScatter",
    coordinateSystem: "geo",
    name: " ",
    showEffectOn: "render",
    rippleEffect: {
      brushType: "stroke",
      scale: 4,
    },
    label: {
      formatter: "贵州地区",
      position: "right",
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    symbolSize: function (val: any) {
      return 20;
    },
    itemStyle: {
      color: "#989898",
      shadowBlur: 50,
      shadowColor: "#EE0000",
    },
    data: [[106.63226, 26.644077]],
  },
]);

const ectOptions = computed(() => ({
  geo: {
    map: "china",
    center: activeCenter.value,
    zoom: activeCom.value === "list" ? 1.5 : 5,
    roam: true,
    itemStyle: {
      areaColor: "#0570a8",
      borderColor: "#fff",
    },
    emphasis: {
      itemStyle: {
        areaColor: "#0f3f7b",
      },
      label: {
        show: false,
      },
    },
    zlevel: 0,
  },
  title: [
    {
      show: activeCom.value === "list",
      text: "运营里程（公里）",
      right: 60,
      top: 140,
      width: 100,
      textStyle: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "sans-serif",
      },
    },
    {
      show: activeCom.value !== "list",
      // text: "运营里程：" + comNum.value + "  公里",
      text: " ",
      right: 20,
      top: 10,
      width: 100,
      textStyle: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "sans-serif",
      },
    },
  ],
  yAxis: [
    {
      type: "category",
      inverse: true,
      show: activeCom.value === "list",
      position: "right",
      nameGap: 16,
      axisLine: {
        show: false,
        lineStyle: {
          color: "#009EFF",
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#ddd",
        },
      },
      axisLabel: {
        margin: -30,
        interval: 0,
        fontSize: 14,
        color: "#fff",
        align: "left",
      },
      // data: categoryData.value,
      data: [],
    },
    {
      type: "category",
      show: false,
    },
  ],
  series:
    activeCom.value === "list"
      ? [
          ...geoSeries.value,
          ...geoSeries2.value,
          ...geoSeries3.value,
          ...barSeries.value,
        ]
      : [...geoSeries.value, ...geoSeries2.value, ...geoSeries3.value],
  ...staticOptions,
  // series:
  //   activeCom.value === "list"
  //     ? [...geoSeries.value, ...geoSeries2.value, ...geoSeries3.value,  ...barSeries.value]
  //     : [...geoSeries.value, ...geoSeries2.value, ...geoSeries3.value],
  // ...staticOptions,
}));
const ectCheck = (e: any) => {
  if (e.seriesName === "运行概况") {
    router.push("/operationOverview");
  }
};
</script>
