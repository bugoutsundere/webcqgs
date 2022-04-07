<template>
  <Module class="flex-grow"
    style="height: 33%"
    :loading="loading"
    :error="error">
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template
      #title>月通行量环比（辆）</template>
    <template v-if="!loading">
      <Ect
        :options="ectOpts" />
    </template>
  </Module>
</template>
<script>
import * as echarts from 'echarts';
import { formatThousandAndReservedBits } from '@/utils/util';
export default {
  props: {
    MonthCompareChartData: {
      Type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      ectOpts: {},
      error: '',
      loading: false,
      latest: true,
      barBottomData: [],
      barTopData: [],
      categoryData: [],
      lastMonthData: [],
      currentMonthData: [],
    };
  },
  watch: {
    MonthCompareChartData: {
      handler: function (val) {
        if (!(val && val.本月 && val.本月.length > 0 && val.上月)) return;
        let currentMonthData = val.本月;
        let lastMonthData = val.上月;
        this.categoryData = currentMonthData.map((item) => item.sectionName);
        this.currentMonthData = currentMonthData.map((item) =>
          formatThousandAndReservedBits(item.flowCount)
        );
        this.lastMonthData = lastMonthData.map((item) =>
          formatThousandAndReservedBits(item.flowCount)
        );
        this.setEchart();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // this.setEchart();
  },
  methods: {
    handleData(data) {
      let barTopData = [];
      let barBottomData = [];
      data.forEach((item) => {
        if (item) {
          barBottomData.push(1);
          barTopData.push(item);
          return null;
        }
        // 没有数据设置为空
        barBottomData.push(0);
        barTopData.push({
          value: 1,
          itemStyle: {
            color: 'rgba(0,0,0,0)',
          },
        });
      });
      this.barBottomData = barBottomData;
      this.barTopData = barTopData;
    },
    // 获取渐变color,方向是从上到下或从左到右
    getGradientColor(colorStart, colorEnd, derection = true) {
      let gradientColor;
      if (derection) {
        // 前4个参数分别为右下左上
        gradientColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colorStart },
          { offset: 1, color: colorEnd },
        ]);
      } else {
        gradientColor = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: colorStart },
          { offset: 1, color: colorEnd },
        ]);
      }
      return gradientColor;
    },
    setEchart() {
      // 柱状图宽度，3D柱状需要多端统一
      let gradientLeft = this.getGradientColor('rgba(220, 174, 102, 1)', 'rgba(136, 86, 9, 1)');
      let gradientRight = this.getGradientColor('rgba(255, 212, 146, 1)', 'rgba(255, 154, 0, 1)');
      let barWidth = '9';
      let monthData = this.currentMonthData;
      // let monthData = [290, 188, 262, 250, 245, 310];
      this.handleData(monthData);
      this.ectOpts = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          // formatter: `{a0}:{c0} w <br /> {a1}:{c1} w`,
        },
        legend: {
          data: ['上月', '本月'],
          right: 0,
          itemHeight: 11,
          textStyle: {
            color: '#CBE7FF',
            fontSize: 10,
          },
        },
        color: ['#08a4fa', '#FFB400'],
        xAxis: {
          type: 'category',
          data: this.categoryData,
          // data: ['渝遂路', '秀松路', '潼荣路', '永沪路', '石黔路', '合安路'],
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
            // 刻度标签与轴线的距离
            // margin: 10
          },
        },
        yAxis: [
          {
            type: 'value',
            nameTextStyle: {
              color: '#CBE7FF',
              fontSize: 12,
              fontWeight: 'bold',
            },
            min: 0,
            max: 400,
            interval: 100,
            position: 'left',
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: '{value} w',
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
          // 左边柱形
          {
            z: 1,
            name: '本月',
            data: monthData,
            // 设置柱形图之间的间隔
            barGap: 0,
            itemStyle: {
              // barBorderRadius: [5, 5, 0, 0],// 注意echart版本区别，这是旧版本写法
              color: gradientLeft,
            },
            type: 'bar',
            // 图形上的文本标签
            label: {
              show: true,
              position: 'top',
              distance: 5,
              fontStyle: 'DIN',
              color: '#fff',
              formatter: '{c} w',
            },
            barWidth: barWidth / 2,
          },
          // 右边柱形
          {
            z: 1,
            name: '本月',
            data: monthData,
            itemStyle: {
              color: gradientRight,
            },
            type: 'bar',
            // 图形上的文本标签
            barWidth: barWidth / 2,
            tooltip: {
              show: false,
            },
          },
          // 柱形底部
          {
            z: 2,
            name: '本月',
            type: 'pictorialBar',
            data: this.barBottomData,
            // 设置Echart标记类型为菱形
            symbol: 'diamond',
            // 图形偏移
            symbolOffset: ['0%', '50%'],
            symbolSize: [barWidth, 5],
            itemStyle: {
              normal: {
                // 从左到右渐变，以中间为分隔
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: 'rgba(136, 86, 9, 1)' },
                  { offset: 0.5, color: 'rgba(136, 86, 9, 1)' },
                  { offset: 0.52, color: 'rgba(255, 154, 0, 1)' },
                  { offset: 1, color: 'rgba(255, 154, 0, 1)' },
                ]),
              },
            },
            tooltip: {
              show: false,
            },
          },
          // 柱形头部
          {
            z: 3,
            name: '本月',
            type: 'pictorialBar',
            data: this.barTopData,
            symbol: 'diamond',
            symbolPosition: 'end',
            symbolOffset: ['0%', '-50%'],
            symbolSize: [barWidth - 0.5, 5],
            itemStyle: {
              // 使用边框使得柱形轮廓更明显
              borderColor: 'rgba(254, 156, 0, 1)',
              borderWidth: 0.5,
              color: 'rgba(254, 156, 0, 1)',
            },
            tooltip: {
              show: false,
            },
          },
          // 折线图
          {
            z: 4,
            name: '上月',
            data: this.lastMonthData,
            // data: [70, 150, 140, 218, 202, 189],
            smooth: true,
            type: 'line',
            itemStyle: {
              color: 'rgba(1, 133, 248, 1)',
            },
            barMaxWidth: barWidth,
          },
        ],
      };
    },
  },
};
</script>
