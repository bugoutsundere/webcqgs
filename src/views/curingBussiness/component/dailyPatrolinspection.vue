<template>
  <Module
    class="flex-grow"
    style="height: 30%"
    :loading="loading"
    :error="error"
  >
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>日常巡检(个)</template>
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
export default {
  props: ['data'],
  data() {
    return {
      ectOpts: {},
      error: '',
      loading: false,
      options: [
        { name: '月', value: false },
        { name: '年', value: true }
      ],
      latest: true,
      categoryData: [],
      dayInspectData: [],
      nightInspectData: []
    };
  },
  computed: {
    ectOpts() {
      return {
        dataset: {
          dimensions: ['orgName', 'nightFinishedCount', 'dayFinishedCount'],
          source: this.data
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          left: 'right',
          data: ['日巡检', '夜巡检'],
          textStyle: {
            fontSize: 13, //字体大小
            color: '#CBE7FF' //字体颜色
          }
        },
        color: ['#08a4fa', '#FFB400'],
        xAxis: {
          type: 'category',
          // data: this.categoryData,
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
            name: '',
            nameTextStyle: {
              color: '#CBE7FF',
              fontSize: 12,
              fontWeight: 'bold'
            },
            min: 0,
            // max: 250,
            position: 'left',
            axisLine: {
              show: true
            },
            axisLabel: {
              formatter: '{value}',
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
            name: '夜巡检',
            // data: this.dayInspectData,
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
                        color: '#00CCFF'
                      },
                      {
                        offset: 0.6,
                        color: '#00CCFF'
                      },
                      {
                        offset: 1,
                        color: '#005DF8'
                      }
                    ]
                  };
                },
                barBorderRadius: [10, 10, 0, 0]
              }
            },
            type: 'bar',
            barMaxWidth: '9'
          },
          {
            name: '日巡检',
            // data: this.nightInspectData,
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
                        color: '#FFD391'
                      },
                      {
                        offset: 0.6,
                        color: '#FFD391'
                      },
                      {
                        offset: 1,
                        color: '#FF9A01'
                      }
                    ]
                  };
                },
                barBorderRadius: [10, 10, 0, 0]
              }
            },
            label: {
              show: true,
              position: 'top',
              color: '#fff'
            },
            type: 'bar',
            barMaxWidth: '9'
          }
        ]
      };
    }
  },
  watch: {
    data: {
      handler(val) {
        if (!val) return;
        val &&
          val.forEach(item => {
            this.categoryData.push(item.orgName);
            this.dayInspectData.push(item.dayFinishedCount);
            this.nightInspectData.push(item.nightFinishedCount);
          });
      },
      deep: true
    }
  }
};
</script>
