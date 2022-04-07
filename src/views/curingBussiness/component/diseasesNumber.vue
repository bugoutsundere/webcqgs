<template>
  <Module class="flex-grow" style="width: 30%" :loading="loading" :error="error">
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>病害数量(个)</template>
    <template #end>
      2021
      <Switcher :options="options" v-model="latest" />
    </template>
    <template v-if="!loading">
      <Ect :options="ectOpts" />
      <div class="radar"></div>
      <!-- <Empty v-else /> -->
    </template>
  </Module>
</template>
<script>
import { diseaseCount } from '@/api/curingBusiness';
import { settings } from 'nprogress';
export default {
  data() {
    return {
      // ectOpts: {},
      error: '',
      loading: false,
      options: [
        { name: '月', value: false },
        { name: '年', value: true },
      ],
      latest: true,
      indicator: [],
      diseaseCountData: [],
    };
  },
  created() {
    this.getApiData();
  },
  computed: {
    ectOpts() {
      return {
        title: {
          left: 'center',
        },
        // legend: {
        //   bottom: 5,
        //   data: ['Beijing', 'Shanghai', 'Guangzhou'],
        //   itemGap: 20,
        //   textStyle: {},
        // },
        radar: {
          // indicator: [
          //   { name: '遂渝公司', max: 300 },
          //   { name: '双合公司', max: 200 },
          //   { name: '秀松公司', max: 5 },
          //   { name: '永泸公司', max: 300 },
          //   { name: '建新公司', max: 250 },
          // ],
          indicator: this.indicator,
          shape: 'circle',
          splitNumber: 5,
          axisName: {
            color: '#29343f',
            fontSize: 14,
            fontWeight: 700,
            showMinLabel: true,
          },
          splitLine: {
            lineStyle: {
              width: 2,
              color: ['#203350'].reverse(),
            },
          },
          splitArea: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              // color: "rgba(238, 197, 102, 0.5)",
              color: 'rgba(78, 125, 200, 1)',
            },
          },
        },
        series: [
          {
            type: 'radar',
            lineStyle: {
              width: 1,
              opacity: 0.5,
            },
            // data: [{ value: [134, 100, 4, 170, 180] }],
            data: this.diseaseCountData,
            symbol: 'circle',
            itemStyle: {
              width: 2,
              color: '#fc9a0a',
            },
            areaStyle: {
              opacity: 0.1,
            },
          },
        ],
      };
    },
  },
  methods: {
    async getApiData() {
      let { msgContent } = await diseaseCount(1);
      let indicator = [];
      let diseaseCountData = [];
      let max = 0;
      msgContent.forEach((i) => {
        if (max < i.diseaseCount) {
          max = i.diseaseCount;
        }
      });
      msgContent.forEach((item) => {
        indicator.push({ name: item.orgName, max: max || 5 });
        diseaseCountData.push(item.diseaseCount);
      });
      this.indicator = indicator;
      this.diseaseCountData = [{ value: diseaseCountData }];
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/styles/viewport-convert.scss';
.radar {
  position: absolute;

  width: 25vh;
  height: 24.6vh;
  left: 50%;
  top: 51.5%;
  transform: translate(-50%, -50%);
  background: url('~/assets/images/chargeManage/radar-bg.png') no-repeat center/100% 100%;
}
</style>
