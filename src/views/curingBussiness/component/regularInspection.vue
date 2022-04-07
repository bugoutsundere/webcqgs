<template>
  <Module class="flex-grow" style="height: 30%" :loading="loading" :error="error">
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>定期/经常检查(个)</template>
    <template #end>
      2021
      <Switcher :options="options" v-model="latest" />
    </template>
    <template v-if="!loading">
      <Ect :options="ectOpts" />
      <!-- <Empty v-else /> -->
    </template>
  </Module>
</template>
<script>
import { regularInspectCount } from '@/api/curingBusiness';
export default {
  data() {
    return {
      ectOpts: {},
      error: '',
      loading: false,
      options: [
        { name: '月', value: false },
        { name: '年', value: true },
      ],
      latest: true,
      categoryData: [],
      fixedDateInspect: [],
      oftenInspect: [],
    };
  },
  computed: {
    ectOpts() {
      return {
        // dataset: {
        //   dimensions: ['siteName'],
        //   source: this.echartData,
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        color: ['#08a4fa', '#FFB400'],
        legend: {
          left: 'right',
          data: ['定期检查', '经常检查'],
          textStyle: {
            fontSize: 13, //字体大小
            color: '#CBE7FF', //字体颜色
          },
        },
        xAxis: {
          type: 'category',
          data: this.categoryData,
          // data: ['Mon', 'Tue', 'Wed', 'Thu'],
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
            name: '定期检查',
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
              formatter: '{value}',
              textStyle: {
                color: '#778FA4',
              },
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: 'value',
            name: '经常检查',
            nameTextStyle: {
              color: '#CBE7FF',
              fontSize: 12,
              fontWeight: 'bold',
            },
            min: 0,
            // max: 250,
            position: 'right',
            offset: 0,
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: '{value}',
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
            name: '定期检查',
            data: this.fixedDateInspect,
            // data: [234, 33, 22],
            yAxisIndex: 1,
            type: 'line',
            smooth: false,
            symbolSize: 6,
            itemStyle: {
              color: '#FDA700',
            },
            lineStyle: {
              width: 3,
              color: '#FDA700', //折线颜色
              shadowOffsetX: 0, // 折线的X偏移
              shadowOffsetY: 0, // 折线的Y偏移
              shadowBlur: 10, // 折线模糊
              shadowColor: '#FDA700', //折线颜色
            },
          },
          {
            name: '经常检查',
            data: this.oftenInspect,
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
                        color: '#00CCFF',
                      },

                      {
                        offset: 1,
                        color: '#005DF8',
                      },
                    ],
                  };
                },
                barBorderRadius: [10, 10, 0, 0],
              },
            },
            type: 'bar',
            barMaxWidth: '9',
            label: {
              show: true,
              position: 'top',
              color: '#fff',
            },
          },
        ],
      };
    },
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let { msgContent } = await regularInspectCount();
      for (const item of msgContent) {
        let startName = item.siteName && item.siteName.substring(0, item.siteName.length - 4);
        let endName = item.siteName && item.siteName.substring(item.siteName.length - 4);
        if (!this.categoryData.includes(startName)) {
          this.categoryData.push(startName);
        }
        if (endName === '经常检查') {
          this.oftenInspect.push(item.inspectCount);
        }
        if (endName === '定期检查') {
          this.fixedDateInspect.push(item.inspectCount);
        }
      }
    },
  },
};
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
