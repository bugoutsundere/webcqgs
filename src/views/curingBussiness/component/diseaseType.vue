<template>
  <Module
    class="flex-grow"
    style="width: 30%"
    :loading="loading"
    :error="error"
  >
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>病害类型比较</template>
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
import { diseaseCountType } from '@/api/curingBusiness';
import { format } from 'echarts';
export default {
  data() {
    return {
      // ectOpts: {},
      error: '',
      loading: false,
      options: [
        { name: '月', value: false },
        { name: '年', value: true }
      ],
      latest: true,
      legendLeftData: [],
      legendRightData: [],
      seriesData: []
    };
  },
  computed: {
    ectOpts() {
      return {
        color: [
          '#ee6666',
          '#91cc75',
          '#73c0de',
          '#3ba272',
          '#ba613c',
          '#9a60b4',
          '#ea7ccc',
          '#5470c6',
          '#fac858',
          '#7254c6'
        ],
        tooltip: {
          trigger: 'item'
        },
        legend: [
          {
            orient: 'vertical',
            align: 'left',
            data: this.legendLeftData,
            // data: [
            //   { value: 1048, name: '总则 ' },
            //   { value: 735, name: 'b保洁' },
            //   { value: 580, name: '路基' },
            //   { value: 484, name: '路面' },
            //   { value: 300, name: '隧道' },
            //   { value: 1048, name: '交通安全设施及沿线设施 ' },
            // ],
            y: 'center',
            x: 'left',
            textStyle: {
              color: '#7d98b2'
            },
            itemGap: 18,
            formatter: function (name) {
              let formatData = format.truncateText(name, 40, '', '…');
              return formatData;
            },
            // tooltip: {
            //   show: true
            // }
          },
          {
            orient: 'vertical',
            align: 'left',
            data: this.legendRightData,
            // data: [
            //   { value: 735, name: '桥梁、涵洞' },
            //   { value: 580, name: '绿化' },
            //   { value: 484, name: '站房' },
            //   { value: 300, name: '计日工' },
            // ],
            y: 'center',
            x: 'right',
            textStyle: {
              color: '#7d98b2',
              width: 30
            },
            itemGap: 18,
            formatter: function (name) {
              let formatData = format.truncateText(name, 50, '', '…');
              return formatData;
            },
            tooltip: {
              show: true
            }
          }
        ],

        series: [
          {
            type: 'pie',
            radius: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'right'
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: '12',
            //     fontWeight: 'bold'
            //   }
            // },
            labelLine: {
              show: false
            },
            data: this.seriesData,
            tooltip: {
              formatter: item => {
                return `
                      <div style="display:flex;">
                        <div style="color:${item.color};margin-right:5px;">○</div>
                          <div>
                            <div>${item.name}: ${item.value}</div>
                            <div>占比:${item.percent}%</div>
                          </div>
                      </div>
                      `;
              }
            }
            // data: [
            //   { value: 1048, name: '总则 ' },
            //   { value: 735, name: 'b保洁' },
            //   { value: 580, name: '路基' },
            //   { value: 484, name: '路面' },
            //   { value: 300, name: '隧道' },
            //   { value: 1048, name: '交通安全设施及沿线设施 ' },
            //   { value: 735, name: '桥梁、涵洞' },
            //   { value: 580, name: '绿化' },
            //   { value: 484, name: '站房' },
            //   { value: 300, name: '计日工' },
            // ],
          }
        ]
      };
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let { msgContent } = await diseaseCountType();
      let data = [];
      for (const item of msgContent) {
        // 是否跳过总数为0的数据
        // if (parseFloat(item.diseaseCount) === 0) continue;
        data.push({ value: item.diseaseCount, name: item.subjectName });
      }
      this.seriesData = this.deepClone(data);
      // 截取一半长度的数组（图例使用）
      this.legendLeftData = this.deepClone(
        data.splice(0, data.length / 2 + (data.length % 2))
      );
      this.legendRightData = this.deepClone(data);
    },
    deepClone(data) {
      return JSON.parse(JSON.stringify(data));
    }
  }
};
</script>
