<template>
  <Module class="flex-grow" style="height: 30%" :loading="loading" :error="error">
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>养护工单(个)</template>
    <!-- <template #end>
      2021
      <Switcher :options="options" v-model="latest" />
    </template> -->
    <template v-if="!loading">
      <Ect :options="ectOpts" />
      <!-- <Empty v-else /> -->
    </template>
  </Module>
</template>
<script>
import { worktableCount } from '@/api/curingBusiness';
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
      echartData: [],
    };
  },
  computed: {
    ectOpts() {
      return {
        dataset: {
          dimensions: ['orgName', 'worktableCount'],
          source: this.echartData,
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
            name: '定期检查',
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
                        color: '#FFD492',
                      },

                      {
                        offset: 1,
                        color: '#FF9A00',
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
      let { msgContent } = await worktableCount();
      this.echartData = msgContent;
    },
  },
};
</script>
