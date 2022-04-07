<template>
  <Module
    class="flex-grow"
    style="height: 30%"
    :loading="loading"
    :error="error"
  >
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>巡查巡检(个)</template>
    <template #end>
      2021
      <Switcher :options="options" v-model="latest" />
    </template>
    <template v-if="!loading">
      <Ect :options="ectOpts" v-if="data?.length>0"/>
      <Empty v-else />
    </template>
  </Module>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {
      error: '',
      loading: false,
      options: [
        { name: '月', value: false },
        { name: '年', value: true }
      ],
      latest: true,
      categoryData: [],
      chartData: []
    };
  },
  computed: {
    ectOpts() {
      return {
        dataset: {
          dimensions: ['orgName', 'inspectCount'],
          source: this.data
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        color: ['#08a4fa', '#FFB400'],
        xAxis: {
          type: 'category',
          // data: this.categoryData,
          // data: ['Mon', 'Tue', 'Wed', 'Thu'],
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
            // data: this.chartData,
            // data: [120, 130, 150, 80],
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
                }
              }
            },
            type: 'bar',
            barMaxWidth: '9',
            label: {
              show: true,
              position: 'top',
              color: '#fff'
            }
          }
        ]
      };
    }
  },
  watch: {
    // data: {
    //   handler(val) {
    //     if (!val) return;
    //     val &&
    //       val.forEach((item) => {
    //         this.categoryData.push(item.orgName);
    //         this.chartData.push(item.inspectCount);
    //       });
    //   },
    //   deep: true,
    // },
  },
  created() {},
  methods: {}
};
</script>
