<template>
  <Module class="flex-grow" style="height: 33%" :loading="loading" error="">
    <template #title>月通行量对比（辆）</template>
    <template v-if="!loading">
      <Ect :options="ectOpts" />
    </template>
  </Module>
</template>
<script>
import * as echarts from 'echarts';
import { formatThousandAndReservedBits } from '@/utils/util';
export default {
  props: {
    currentMonthChartData: {
      Type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      ectOpts: {},
      loading: false,
      categoryData: [],
      lastYearData: [],
      currentYearData: []
    };
  },
  watch: {
    currentMonthChartData: {
      handler: function (val) {
        if (!(val && val.本年 && val.本年.length > 0 && val.去年)) return;
        let currentYearData = val.本年;
        let lastYearData = val.去年;
        this.categoryData = currentYearData.map(item => item.sectionName);
        this.currentYearData = currentYearData.map(item =>
          formatThousandAndReservedBits(item.flowCount)
        );
        this.lastYearData = lastYearData.map(item =>
          formatThousandAndReservedBits(item.flowCount)
        );
        this.getData();
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    getData() {
      this.ectOpts = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['去年', '本年'],
          right: 0,
          itemHeight: 11,
          textStyle: {
            color: '#CBE7FF',
            fontSize: 10
          }
        },
        color: ['#08a4fa', '#FFB400'],
        xAxis: {
          type: 'category',
          data: this.categoryData,
          // data: ['渝遂路', '秀松路', '潼荣路', '永沪路', '石黔路', '合安路'],
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#778FA4'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            nameTextStyle: {
              color: '#CBE7FF',
              fontSize: 12,
              fontWeight: 'bold'
            },
            min: 0,
            max: 210,
            interval: 30,
            position: 'left',
            axisLine: {
              show: true
            },
            axisLabel: {
              formatter: '{value} w',
              textStyle: {
                color: '#778FA4'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '本年',
            data: this.currentYearData,
            // data: [187, 89, 115, 124, 122, 100],
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0], // 注意echart版本区别，这是旧版本写法
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(105, 225, 255, 1)' },
                  { offset: 1, color: 'rgba(0, 132, 248, 1)' }
                ])
              }
            },
            type: 'bar',
            // 图形上的文本标签
            label: {
              show: true,
              position: 'top',
              distance: 5,
              fontStyle: 'DIN',
              color: '#fff',
              formatter: '{c} w'
            },
            barMaxWidth: '9'
          },
          {
            name: '去年',
            data: this.lastYearData,
            // data: [40, 80, 70, 110, 105, 100],
            smooth: true,
            type: 'line',
            itemStyle: {
              color: 'rgba(254, 153, 0, 1)'
            },
            barMaxWidth: '9'
          }
        ]
      };
    }
  }
};
</script>
