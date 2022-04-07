<template>
  <Module class="flex-grow h-1/3">
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>养护站统计（个）</template>
    <template v-if="!loading">
      <Ect :options="ectOpts" />
      <!-- <Empty v-else /> -->
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default() {
      return [];
    },
  },
});
const ectOpts = computed(() => {
  return {
    dataset: {
      dimensions: ['sectionName', 'maintainStationCount'],
      source: props.data,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    color: ['#08a4fa', '#FFB400'],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'ba'],
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#778FA4',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        nameTextStyle: {
          color: '#CBE7FF',
          fontSize: 12,
          fontWeight: 'bold',
        },
        min: 0,
        // max: 250,
        position: 'left',
        axisLine: {
          show: true,
        },
        axisLabel: {
          textStyle: {
            color: '#778FA4',
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        // data: [820, 932, 901, 934, 1290, 1330, 1320, 900],
        type: 'line',
        symbolSize: 6,
        // 是否平滑曲线过度
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255, 180, 0, 0.1)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(255, 180, 0, 0.05)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        itemStyle: {
          color: '#FFB400',
        },
        lineStyle: {
          width: 3,
          color: '#FFB400', //折线颜色
          shadowOffsetX: 0, // 折线的X偏移
          shadowOffsetY: 0, // 折线的Y偏移
          shadowBlur: 30, // 折线模糊
          shadowColor: '#FFB400', //折线颜色
        },
      },
    ],
  };
});
</script>
<style lang="postcss" scoped>
.jcsstj-outline {
  margin-bottom: 8px;
}
.jcsstj-num {
  width: 20px;
  height: 24px;
  font-size: 13px;
  font-weight: bold;
  color: #badeff;
  text-align: center;
  line-height: 24px;
  font-style: oblique;
  margin-right: 10px;
  padding-right: 2px;
}
.jcsstj-num-top {
  color: #ff9a00;
  background: url('@/assets/images/jcsstj-top-num.png');
  background-size: 100% 100%;
}
.jcsstj-text {
  font-size: 14px;
  color: #909fac;
  width: 90px;
}
.jcsstj-blout {
  width: calc(100% - 180px);
  height: 14px;
  padding: 3px;
  border: 1px solid rgba(0, 132, 251, 0.25);
  background: rgba(0, 132, 251, 0.1);
  position: relative;
}
.jcsstj-blout-top {
  border: 1px solid rgba(255, 154, 0, 0.15);
  background: rgba(255, 154, 0, 0.1);
}
.jcsstj-bl {
  height: 6px;
  background: #0084fb;
  background: linear-gradient(to right, #0084fb, #00cbff);
}
.jcsstj-bl-top {
  background: #ff9a00;
  background: linear-gradient(to right, #ff9a00, #ffd697);
}
.jcsstj-cont {
  font-size: 16px;
  color: #ffdaa5;
  width: 50px;
  margin-left: 10px;
}
.bl-hightlinght {
  position: absolute;
  width: 5px;
  height: 14px;
  top: 0;
  left: 100%;
  margin-left: -3px;
  background: #97eaff;
  box-shadow: #0085f8 0px 0px 10px;
}
.bl-hightlinght-top {
  background: #fff1dc;
  box-shadow: #ff9a00 0px 0px 10px;
}
</style>
