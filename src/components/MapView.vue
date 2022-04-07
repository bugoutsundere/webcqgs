<template>
  <Module class="flex-grow h-full" :info="bsMeta && bsMeta['mapView']" :loading="loading">
    <div class="macl-outbox overflow-hidden px-8">
      <slot />
      <div class="macl-map-view" :style="diyStyle">
        <slot name="box" v-if="$slots.box"> </slot>
        <div @mousewheel.self="zoom" @mousedown="draggable" class="macl-mapbg">
          <!-- <Ect
            v-if="!loading && dataList?.length > 0"
            class="z-40"
            :options="ectOptions"
            @ectCheck="ectCheck"
          /> -->
          <div @click="ectCheck" class="checked">
            <div class='ripple'>
            </div>
            <div class="label">重庆总部</div>
          </div>
        </div>
      </div>
    </div>
  </Module>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { genConfig } from '@/utils/request';
import { useRequest } from 'vue-request';
import { useStore } from 'vuex';
import { comInfo } from '@/store/state';
import { key } from '@/store';
import { useGradient } from '@/utils/color';
// let positionX = ref(0);
// let positionY = ref(0);
const draggable = (e: any) => {
  e.preventDefault();
  let odiv = e.target; //获取目标元素
  let disX = e.clientX;
  let disY = e.clientY;
  document.onmousemove = (e) => {
    //鼠标按下并移动的事件
    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    let left = e.clientX - disX;
    let top = e.clientY - disY;

    //移动当前元素
    odiv.style.left = left + 'px';
    odiv.style.top = top + 'px';
  };
  document.onmouseup = (e) => {
    document.onmousemove = null;
    document.onmouseup = null;
  };
};
const zoom = (e: any) => {
  /* 获取当前页面的缩放比 若未设置zoom缩放比，则为默认100%，即1，原图大小 */
  let target = e.target;
  let zoom = parseInt(target.style.zoom) || 100;
  zoom -= e.deltaY / 10;
  /* 最小范围 和 最大范围 的图片缩放尺度 */
  // if (zoom >= 50 && zoom < 500) {
  e.target.style.zoom = zoom + '%';
  // }
  return false;
};
const ectCheck = (e: any) => {
  // if (e.seriesName === '运行概况') {
  router.push('/operationOverview');
  // }
};
const geoCoordMap: any = {
  中铁建昆仑投资集团: [104.065633, 30.547988],
  // 建新公司: [106.40309,29.80243],
  // 双合公司: [106.403243,29.802354],
  // 遂渝公司: [106.519111,29.620469],
};

const store = useStore(key);
const router = useRouter();
const props = defineProps({
  position: {
    type: String,
  },
});
const diyStyle = computed(() => {
  let diyStyle = {};
  switch (props.position) {
    case 'right':
      diyStyle = { justifyContent: 'flex-end' };
      break;
    case 'center':
    default:
      diyStyle = { justifyContent: 'center' };
      break;
  }
  return diyStyle;
});
const activeCom = computed(() => store.state.activeCom);
const bsMeta = computed(() => store.getters.bsMeta);

const activeCenter = computed(() => {
  let name: any = '';
  if (activeCom.value === 'list') {
    return [117.98561551896913, 31.205000490896193];
  }
  let item = comInfo.find((e) => e.code === activeCom.value);
  name = item?.name;
  return geoCoordMap[name];
});

const { data, loading, error, refresh } = useRequest<any>(() => genConfig(`/http-server-kpi/publish/jsc/baseCom`));
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
    name: '遂渝高速',
    value: 93,
    id: 1,
    oprCrtTime: '20211022155213',
    orgCode: '108',
  },
  {
    name: '潼荣高速',
    value: 138.456,
    id: 2,
    oprCrtTime: '20211022155213',
    orgCode: '102',
  },
  {
    name: '秀松高速',
    value: 30.571,
    id: 3,
    oprCrtTime: '20211022155213',
    orgCode: '109',
  },
  {
    name: '永泸高速',
    value: 20.943,
    id: 4,
    oprCrtTime: '20211022155213',
    orgCode: '110',
  },
  {
    name: '合安高速',
    value: 18.414,
    id: 5,
    oprCrtTime: '20211022155213',
    orgCode: '106',
  },
  {
    name: '石黔高速',
    value: 83.1,
    id: 6,
    oprCrtTime: '20211022155213',
    orgCode: '101',
  },
]);

const comNum = computed(() => dataList.value?.find((e: any) => e.orgCode === activeCom.value)?.value);

const categoryData = computed(() => dataList.value?.map((e: any) => e.name));
const max = computed(() => dataList.value?.length > 0 && dataList.value[0].value);
const subData = computed(() => dataList.value?.map((e: any) => e.value).map((e: any) => max.value - e));

const staticOptions = {
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicInOut',
  animationDurationUpdate: 1000,
  animationEasingUpdate: 'cubicInOut',

  grid: {
    right: 90,
    top: 180,
    height: '60%',
    width: '50%',
  },
  xAxis: {
    type: 'value',
    position: 'top',
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
      color: '#aaa',
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
    type: 'bar',
    stack: '总量',
    data: subData.value,
    itemStyle: {
      color: 'rgba(0,0,0,0)',
    },
  },
  {
    id: 'bar',
    zlevel: 2,
    type: 'bar',
    symbol: 'none',
    stack: '总量',
    barWidth: '60%',
    label: {
      show: true,
      position: 'left',
      distance: 10,
      color: '#ffffff',
      fontSize: 18,
      lineHeight: 12,
      fontWeight: 500,
      verticalAlign: 'middle',
      offset: [0, 2],
      borderRadius: 2,
      borderWidth: 1,
      backgroundColor: 'rgba(0,0,0 ,0.2)',
      padding: [2, 4],
    },
    itemStyle: {
      color: useGradient('blue'),
      borderColor: '#fff',
      borderWidth: 1,
      shadowColor: 'rgba(0, 0, 0, .2)',
      shadowBlur: 2,
      shadowOffsetY: 4,
      shadowOffsetX: -4,
    },
    data: dataList.value,
  },
]);

const geoSeries = computed(() => [
  {
    type: 'scatter',
    coordinateSystem: 'geo',
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 3, 8);
      return value > 90 ? 90 : value;
    },
    label: {
      show: false,
    },
    itemStyle: {
      color: '#FF8C00',
      position: 'right',
      show: true,
    },
  },
  {
    type: 'effectScatter',
    coordinateSystem: 'geo',
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 5, 8);
      return value > 70 ? 70 : value;
    },
    showEffectOn: 'render',
    rippleEffect: {
      brushType: 'stroke',
      scale: 4,
    },
    label: {
      formatter: '{b}',
      position: 'right',
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    itemStyle: {
      color: '#f4e925',
      shadowBlur: 50,
      shadowColor: '#EE0000',
    },
    zlevel: 1,
  },
  {
    type: 'effectScatter',
    coordinateSystem: 'geo',
    name: '运行概况',
    showEffectOn: 'render',
    rippleEffect: {
      brushType: 'stroke',
      scale: 4,
    },
    label: {
      formatter: '重庆总部',
      position: 'right',
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    symbolSize: function (val: any) {
      return 20;
    },
    itemStyle: {
      color: '#f4e925',
      shadowBlur: 50,
      shadowColor: '#EE0000',
    },
    data: [[106.54, 29.59]],
  },
]);

const geoSeries2 = computed(() => [
  {
    type: 'scatter',
    coordinateSystem: 'geo',
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 3, 8);
      return value > 90 ? 90 : value;
    },
    label: {
      show: false,
    },
    itemStyle: {
      color: '#FF8C00',
      position: 'right',
      show: true,
    },
  },
  {
    type: 'effectScatter',
    coordinateSystem: 'geo',
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 5, 8);
      return value > 70 ? 70 : value;
    },
    showEffectOn: 'render',
    rippleEffect: {
      brushType: 'stroke',
      scale: 4,
    },
    label: {
      formatter: '{b}',
      position: 'right',
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    itemStyle: {
      color: '#f4e925',
      shadowBlur: 50,
      shadowColor: '#EE0000',
    },
    zlevel: 1,
  },
  {
    type: 'effectScatter',
    coordinateSystem: 'geo',
    name: ' ',
    showEffectOn: 'render',
    rippleEffect: {
      brushType: 'stroke',
      scale: 4,
    },
    label: {
      formatter: '四川地区',
      position: 'right',
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    symbolSize: function (val: any) {
      return 20;
    },
    itemStyle: {
      color: '#989898',
      shadowBlur: 50,
      shadowColor: '#EE0000',
    },
    data: [[104.07808, 30.671924]],
  },
]);

const geoSeries3 = computed(() => [
  {
    type: 'scatter',
    coordinateSystem: 'geo',
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 3, 8);
      return value > 90 ? 90 : value;
    },
    label: {
      show: false,
    },
    itemStyle: {
      color: '#FF8C00',
      // color: 'rgb(1,50,95)',
      position: 'right',
      show: true,
    },
  },
  {
    type: 'effectScatter',
    coordinateSystem: 'geo',
    data: convertedData.value,
    symbolSize: function (val: any) {
      let value = Math.max(val[2] / 5, 8);
      return value > 70 ? 70 : value;
    },
    showEffectOn: 'render',
    rippleEffect: {
      brushType: 'stroke',
      scale: 4,
    },
    label: {
      formatter: '{b}',
      position: 'right',
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    itemStyle: {
      color: '#f4e925',
      shadowBlur: 50,
      shadowColor: '#EE0000',
    },
    zlevel: 1,
  },
  {
    type: 'effectScatter',
    coordinateSystem: 'geo',
    name: ' ',
    showEffectOn: 'render',
    rippleEffect: {
      brushType: 'stroke',
      scale: 4,
    },
    label: {
      formatter: '贵州地区',
      position: 'right',
      show: true,
      fontSize: 15,
      offset: [10, 0],
    },
    symbolSize: function (val: any) {
      return 20;
    },
    itemStyle: {
      color: '#989898',
      shadowBlur: 50,
      shadowColor: '#EE0000',
    },
    data: [[106.63226, 26.644077]],
  },
]);

const ectOptions = computed(() => ({
  geo: {
    map: 'china',
    // center: activeCenter.value,
    // zoom: activeCom.value === 'list' ? 1.5 : 5,
    // center:['85%','50%'],
    zoom: activeCom.value === 'list' ? 1 : 5,
    roam: true,
    itemStyle: {
      // areaColor: 'rgb(5,65,119)',
      areaColor: '#0570a8',
      borderColor: '#fff',
    },
    emphasis: {
      itemStyle: {
        areaColor: '#0f3f7b',
      },
      label: {
        show: false,
      },
    },
    zlevel: 0,
  },
  title: [],
  yAxis: [
    {
      type: 'category',
      inverse: true,
      show: activeCom.value === 'list',
      position: 'right',
      nameGap: 16,
      axisLine: {
        show: false,
        lineStyle: {
          color: '#009EFF',
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#ddd',
        },
      },
      axisLabel: {
        margin: -30,
        interval: 0,
        fontSize: 14,
        color: '#fff',
        align: 'left',
      },
      // data: categoryData.value,
      data: [],
    },
    {
      type: 'category',
      show: false,
    },
  ],
  series:
    activeCom.value === 'list'
      ? [
          ...geoSeries.value,
          ...geoSeries2.value,
          ...geoSeries3.value,
          // ...barSeries.value
        ]
      : [...geoSeries.value, ...geoSeries2.value, ...geoSeries3.value],
  ...staticOptions,
  // series:
  //   activeCom.value === "list"
  //     ? [...geoSeries.value, ...geoSeries2.value, ...geoSeries3.value,  ...barSeries.value]
  //     : [...geoSeries.value, ...geoSeries2.value, ...geoSeries3.value],
  // ...staticOptions,
}));
</script>

<style lang="postcss" scoped>
.checked {
  position: absolute;
  display: flex;
  right: 150px;
  bottom: 120px;
}
.label {
  margin-left: 5px;
  color: antiquewhite;
}
/* 涟漪效果 */
.ripple {
  position: relative;

  width: 18px;
  height: 18px;
  background-color: rgba(255, 154, 0, 1);
  border-radius: 50%;
  display: inline-block;
}

.ripple::before {
  content: '';
  width: 32px;
  height: 32px;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  animation: rippleDot 1.5s ease-out 0s infinite;
  background-color: rgba(108, 181, 82, 0.5);
}

.macl-map-view {
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  width: calc(100% - 20px);
  height: calc(100% - 80px);
  margin: 10px;
}
.malc-box {
  width: 50%;
  /* margin-top: 30px; */
  position: absolute;
  /* left: 2%; */
  top: 0;
}
.mdhead {
  font-size: 13px;
  font-weight: bold;
  font-style: oblique;
  letter-spacing: 2px;
  margin-bottom: 20px;
}
.macl-outbox {
  width: 100%;
  height: 100%;
  position: relative;
}
.mdlc-cont {
  width: 100%;
  margin-bottom: 7px;
}
.malc-tit {
  font-size: 14px;
  padding-left: 10px;
}
.malc-left {
  width: 5px;
  height: 12px;
  background: #ff9a00;
  margin-right: 5px;
}
.malc-center {
  width: 50%;
  height: 12px;
  padding: 3px;
  /* border: 1px solid red; */
  border: 1px solid rgba(174, 146, 107, 0.35);
  background: rgba(255, 154, 0, 0.1);
}
.malc-center-in {
  height: 4px;
  background: #ff9a00;
  background: linear-gradient(to right, transparent, rgba(255, 154, 0, 1));
  width: 100%;
}
.malc-left2 {
  background: #0084fb;
  margin-right: 5px;
}
.malc-center2 {
  /* border: 1px solid red; */
  border: 1px solid rgba(0, 132, 251, 0.25);
  background: rgba(0, 132, 251, 0.1);
}
.malc-center-in2 {
  background: linear-gradient(to right, transparent, rgba(0, 132, 251, 1));
}
.macl-rig {
  font-size: 16px;
  margin-left: 10px;
}
.macl-mapbg {
  position: relative;
  width: 500px;
  height: 350px;
  background: url('@/assets/images/common/chinaMap.png');
  background-size: 100% 100%;
  &:after {
    content: '';
    position: absolute;
  }
}
</style>
