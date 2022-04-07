<template>
  <Module class="flex-grow"
    style="height: 33%"
    :loading="loading">
    <template
      #title>当日路段通行量对比（辆）</template>
    <template v-if="!loading">
      <Ect
        :options="ectOpts" />
    </template>
  </Module>
</template>
<script>
import * as util from '@/utils/util';
export default {
  props: {
    currentDayTollData: {
      Type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      ectOpts: {},
      loading: false,
      latest: true,
      barBottomData: [],
      barTopData: [],
      barData: [],
      categoryData: [],
    };
  },
  watch: {
    currentDayTollData: {
      handler: function (val, oldVal) {
        this.barData = val.map((item) => util.formatThousandAndReservedBits(item.flowCount));
        this.categoryData = val.map((item) => item.sectionName);
        this.getData();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    getData() {
      // let barData = [0.9, 0.6, 0.8, 0.84, 0.82, 0.65];
      let barData = JSON.parse(JSON.stringify(this.barData));
      let barWidth = '9';
      this.handleData(barData);
      this.ectOpts = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        color: ['#08a4fa', '#FFB400'],
        xAxis: {
          type: 'category',
          data: this.categoryData,
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
            // min: 0,
            // max: 1,
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
          {
            type: 'bar',
            // 图形上的文本标签
            label: {
              show: true,
              position: 'top',
              distance: 5,
              fontStyle: 'DIN',
              color: '#fff',
            },
            data: barData,
            itemStyle: {
              normal: {
                color: function (params) {
                  return {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(105, 225, 255, 0.6)',
                      },
                      { offset: 0.5, color: 'rgba(105, 225, 255, 0.6)' },
                      {
                        offset: 1,
                        color: 'rgba(0, 132, 248, 0.6)',
                      },
                    ],
                  };
                },
              },
            },
            barWidth: barWidth,
          },
          // 圆柱底部(象形柱图)注意取消tooltip显示
          {
            type: 'pictorialBar',
            data: this.barBottomData,
            symbol: 'circle',
            symbolSize: [barWidth, barWidth / 2],
            symbolOffset: ['0%', '50%'],
            itemStyle: {
              color: 'rgba(0, 133, 248, 1)',
            },
            tooltip: {
              show: false,
            },
          },
          {
            type: 'pictorialBar',
            data: this.barTopData,
            symbol: 'circle',
            symbolSize: [barWidth, barWidth / 2],
            symbolPosition: 'end',
            symbolOffset: ['0%', '-50%'],
            itemStyle: {
              color: 'rgba(0, 203, 255, 1)',
            },
            tooltip: {
              show: false,
            },
          },
        ],
      };
    },
    // 获取3d柱形图需要的数据
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
  },
};
</script>
