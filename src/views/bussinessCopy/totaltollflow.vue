<template>
  <Module class="flex-grow w-1/3" :loading="loading" :error="error">
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>通行费收入及收费总车流量</template>
    <template #end>
      <!-- <span class="mr-2">{{ showDate }}</span> -->
      <Switcher :options="options" v-model="isCurrentMonth" />
    </template>
    <template v-if="!loading">
      <Ect :options="ectOpts" />
      <!-- <Empty v-else /> -->
    </template>
  </Module>
</template>
<script>
import { stationEuMonth } from '@/api/tollManage';
import { formatThousandMoney } from '@/utils/util';
export default {
  data() {
    return {
      ectOpts: {},
      error: '',
      loading: false,
      options: [
        { name: '本年', value: true },
        { name: '去年', value: false }
      ],
      isCurrentMonth: true,
      categoryData: [], // 类目轴
      feeSumData: [], // 收入
      flowCount: [] // 车流量
    };
  },
  async created() {
    this.getAllData()
  },
  watch:{
    isCurrentMonth(){
      this.getAllData();
    }
  },
  mounted() {
  },
  methods: {
    async getAllData(){
    let echartData = [];
    if(this.isCurrentMonth){
      echartData = await stationEuMonth(new Date().getFullYear());
    }
    else{
      echartData = await stationEuMonth(new Date().getFullYear()-1);
    }
    let { msgContent } = echartData;

    this.categoryData = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    // this.categoryData = msgContent.map(item=>this.dateMonthToEnglish(item.timeFlag));
    this.feeSumData = msgContent.map(item => formatThousandMoney(item.feeSum));
    this.flowCount = msgContent.map(item => item.flowCount);
    // console.log(this.categoryData,this.feeSumData,this.flowCount);
    this.getData();
    },
    getData() {
      this.ectOpts = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid:{
          // containLabel:true
        },
        color: ['#08a4fa', '#FFB400'],
        legend: {
          data: ['收入', '车流量'],
          textStyle: {
            fontSize: 11, //字体大小
            color: '#CBE7FF' //字体颜色
          },
          left:'center',
          borderRadius:0,
          itemWidth:17,
          itemHeight:8
        },
        xAxis: {
          type: 'category',
          data: this.categoryData,
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'ba'],
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
            name: '收入',
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
              formatter: '{value} w',
              textStyle: {
                color: '#778FA4'
              }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '车流量',
            nameTextStyle: {
              color: '#CBE7FF',
              fontSize: 12,
              fontWeight: 'bold'
            },
            min: 0,
            // max: 250,
            position: 'right',
            offset: 0,
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
            name: '收入',
            data: this.feeSumData,
            // data: [120, 130, 150, 80, 70, 110, 130, 70],
            itemStyle: {
              normal: {
                color: function (params) {
                  return {
                    colorStops: [
                      {
                        offset: 0,
                        color: '#1268f3'
                      },
                      {
                        offset: 0.6,
                        color: '#08a4fa'
                      },
                      {
                        offset: 1,
                        color: '#01ccfe'
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
            name: '车流量',
            yAxisIndex: 1,
            data: this.flowCount,
            // data: [80, 32, 78, 99, 44, 86, 55, 30],
            type: 'line',
            smooth: true,
            showSymbol: false,
            itemStyle: {
              color: '#FFB400'
            },
            lineStyle: {
              width: 3,
              color: '#FFB400', //折线颜色
              shadowOffsetX: 0, // 折线的X偏移
              shadowOffsetY: 0, // 折线的Y偏移
              shadowBlur: 30, // 折线模糊
              shadowColor: '#FFB400' //折线颜色
            }
          }
        ]
      };
    },
    dateMonthToEnglish(date) {
      let year = date.substring(0, 4);
      let month = date.substring(4, 6);
      if (!month || !year) return;
      let monthToEnglish = new Date(`${year}-${month}`)
        .toDateString()
        .split(' ')[1];
      return monthToEnglish;
    }
  }
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
