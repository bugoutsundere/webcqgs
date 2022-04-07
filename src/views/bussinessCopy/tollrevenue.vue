<template>
  <Module class="flex-grow w-1/3" :info="bsMeta && bsMeta['emplRate']" :loading="loading" :error="error">
    <template #title>通行费收入(万元)</template>
    <template #end>
      <!-- <span class="mr-2">{{ showDate }}</span> -->
      <Switcher :options="options" v-model="latest" />
    </template>
    <template v-if="!loading">
      <div style="width: 100%" v-if="activeCom === 'list' && dataList?.length > 0">
        <div v-for="(item, index) in dataList" :key="index" class="jcsstj-outline flex justify-between items-center" style="margin-top: 5px">
          <div class="jcsstj-num" :class="index < 3 ? 'jcsstj-num-top' : ''">
            {{ index + 1 }}
          </div>
          <div class="jcsstj-text">{{ item.sectionName }}</div>
          <div class="jcsstj-blout" :class="index < 3 ? 'jcsstj-blout-top' : ''">
            <div class="jcsstj-bl" :class="index < 3 ? 'jcsstj-bl-top' : ''" :style="{ width: (item.feeSum/totalCount)*100 + '%' }"></div>
            <div class="bl-hightlinght" :class="index < 3 ? 'bl-hightlinght-top' : ''"></div>
          </div>
          <div class="jcsstj-cont">{{ formatThousandMoney(item.feeSum) }}</div>
        </div>
      </div>
      <!-- <Ect
        :options="ectOpts"
        v-if="activeCom === 'list' && dataList?.length > 0"
      />
      <Ect
        :options="comEctOpts"
        v-else-if="activeCom !== 'list' && comData?.length > 0"
      />
      <Empty v-else /> -->
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { formatYearMonth, formatDate, formatThousandMoney } from '@/utils/util';
import { comInfo, employeeInfo } from '@/store/state';

import { genConfig } from '@/utils/request';
import { useRequest } from 'vue-request';
import { useGradient } from '@/utils/color';
import { getMonthSectionToll,getYearSectionToll } from '@/api/tollManage';

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);
const appDate = computed(() => formatYearMonth(store.state.appDate));
const bsMeta = computed(() => store.getters.bsMeta);

const latest = ref(true);
const options = [
  { name: '当月', value: true },
  { name: '年累计', value: false },
];
watch(latest,(val)=>{console.log(val)},{deep:true,immediate:true})
const showDate = computed(() => {
  // return latest.value ? (employeeData.value?.length > 0 ? employeeData.value[0].accDate : '') : appDate.value;
});

const paramStr = computed(() => {
  const list: any = [];
  list.push(`com=${activeCom.value}`);
  if (!latest.value) {
    list.push(`accDate=${appDate.value}`);
  }
  return list.length > 0 ? `?${list.join('&')}` : '';
});

const LastMonth = () => {
  let date = new Date();
  var year = date.getFullYear(); //当前年：四位数字
  var month: any = date.getMonth(); //当前月：0-11
  if (month == 0) {
    //如果是0，则说明是1月份，上一个月就是去年的12月
    year -= 1;
    month = 12;
  }
  month = month < 10 ? '0' + month : month; //月份格式化：月份小于10则追加个0
  let lastYearMonth = year + '' + month;
  return lastYearMonth;
};
const LastYear =() =>{
  let date = new Date();
  return date.getFullYear()-1 +'';
}
const monthSection = useRequest<any>(() => getMonthSectionToll('', '', LastMonth(), formatDate(new Date(), 'yyyyMM')));
const YearSection = useRequest<any>(() => getYearSectionToll('', '', LastYear(), formatDate(new Date(), 'yyyy')));
const dataList = computed(() => {
  // 判断是否当月数据
  if(latest.value){
    return  monthSection.data && monthSection.data.value?.msgContent;
  }
  return YearSection.data && YearSection.data.value?.msgContent;
});
const totalCount = computed(() => {
  if(latest.value){
    let monthSectionData: any = monthSection.data && monthSection.data.value?.msgContent;
    return monthSectionData.map((e: any) => Number(e.feeSum))?.reduce((a: number, b: number) => a + b);
  }
  let YearSectionData: any = YearSection.data && YearSection.data.value?.msgContent;
  return YearSectionData.map((e: any) => Number(e.feeSum))?.reduce((a: number, b: number) => a + b);;
});
// const { data, loading, error, refresh } = useRequest<any>(() => genConfig(`/http-server-kpi/publish/jsc/employeenew${paramStr.value}`));
// watch(paramStr, refresh);

// const employeeData = computed(() => data.value?.msgContent);

// const dataList = computed(() => {
//   let list: any = [];
//   if (activeCom.value === 'list' && !loading.value && employeeData.value?.length > 0) {
//     comInfo.forEach(({ code, name }) => {
//       const searchList = employeeData.value.filter(({ orgCode }: any) => orgCode === code);
//       const comData: any = {
//         orgName: name,
//       };
//       employeeInfo.forEach(({ label, ref }) => {
//         let target = searchList?.find(({ prgName }: any) => prgName?.indexOf(ref) === 0);
//         target && (comData[label] = target.accval);
//       });
//       list.push(comData);
//     });
//   }
//   return list;
// });

const staticOptions = {
  color: employeeInfo.map(({ color }: any) => useGradient(color, 'vertical')),
  grid: {
    top: 20,
    left: 40,
    bottom: 40,
    right: 10,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: '#000',
    axisPointer: {
      type: 'shadow',
    },
    textStyle: {
      fontSize: 12,
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
    splitNumber: 3,
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 154, 248,.5)',
        width: '1',
      },
    },
    axisLine: {
      lineStyle: {
        color: '#009EFF',
      },
    },
    axisLabel: {
      show: true,
      fontSize: 10,
    },
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#01A3FF',
        width: '1',
      },
    },
    axisTick: {
      alignWithLabel: true,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 154, 248,.5)',
        width: '1',
      },
    },
    axisLabel: {
      rotate: 20,
      fontSize: 12,
      fontWeight: 400,
    },
  },
};

const staticSeriesOptions = {
  type: 'bar',
  stack: '总量',
  barWidth: '45%',
  itemStyle: {
    borderColor: '#fff',
    borderWidth: 0.8,
  },
};

const ectOpts = computed(() => ({
  dataset: {
    source: dataList.value,
    dimensions: ['orgName', ...employeeInfo.map((e) => e.label)],
  },
  series: employeeInfo.map(({ label, color }: any, index) => ({
    name: label,
    encode: {
      x: 'orgName',
      y: label,
    },
    label: {
      show: index === employeeInfo.length - 1,
      position: 'top',
      color: '#fff',
      lineHeight: 12,
      fontSize: 12,
      fontFamily: 'sans-serif',
      verticalAlign: 'middle',
      borderRadius: 2,
      borderWidth: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: [2, 4],
      borderColor: 'rgba(0,0,0,0.8)',
      offset: [0, -5],
      formatter: function (t: any) {
        let sum = 0;
        Object.keys(t.data).forEach((e: string) => {
          if (e !== 'orgName') {
            sum += Number(t.data[e]);
          }
        });
        return sum;
      },
    },
    ...staticSeriesOptions,
  })),
  ...staticOptions,
}));

// 单个公司下
// const comData = computed(() => {
//   const list = activeCom.value !== 'list' && !loading.value ? employeeData.value : [];
//   const result: any = [];
//   employeeInfo.forEach(({ label, ref }) => {
//     let target = list?.find(({ prgName }: any) => prgName?.indexOf(ref) === 0);
//     target &&
//       result.push({
//         prgName: target.prgName,
//         accval: target.accval,
//       });
//   });
//   return result;
// });

const comStaticOptions = {
  color: employeeInfo.map(({ color }: any) => useGradient(color, 'vertical')),
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: '#000',
    axisPointer: {
      type: 'shadow',
    },
    textStyle: {
      fontSize: 12,
      color: '#fff',
    },
  },
  polar: {},
  angleAxis: {
    interval: 1,
    type: 'category',
    data: [],
    z: 10,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#0B4A6B',
        width: 1,
        type: 'solid',
      },
    },
    axisLabel: {
      interval: 0,
      show: true,
      color: '#0B4A6B',
      margin: 8,
      fontSize: 16,
    },
  },
  radiusAxis: {
    min: 40,
    max: 120,
    interval: 20,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#0B3E5E',
        width: 1,
        type: 'solid',
      },
    },
    axisLabel: {
      formatter: '{value} %',
      show: false,
      padding: [0, 0, 20, 0],
      color: '#0B3E5E',
      fontSize: 16,
    },
    splitLine: {
      lineStyle: {
        color: '#0B3E5E',
        width: 2,
        type: 'solid',
      },
    },
  },
};

const comStaticSeriesOptions = {
  type: 'pie',
  radius: ['20%', '50%'],
  roseType: 'area',
  labelLine: {
    length: 10,
    length2: 30,
    smooth: true,
  },
  encode: {
    itemName: 'prgName',
    value: 'accval',
  },
  itemStyle: {
    borderColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
  },
};

const decoBg = {
  type: 'pie',
  radius: ['5%', '10%'],
  silent: true,
  label: {
    show: false,
  },
  labelLine: {
    show: false,
  },
  data: [
    {
      name: '',
      value: 0,
      itemStyle: {
        color: '#0B4A6B',
      },
    },
  ],
};

const comEctOpts = computed(() => ({
  dataset: {
    source: comData.value,
    dimensions: ['prgName', 'accval'],
  },
  series: [
    decoBg,
    {
      label: {
        show: true,
        position: 'outside',
        verticalAlign: 'middle',
        backgroundColor: 'rgba(0,0,0,.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.5)',
        lineHeight: 16,
        fontSize: 14,
        padding: [5, 10],
        formatter: function (p: any) {
          let name = p.name.split('（')[0];
          return `{label|${name}}{num|(${p.data.accval})}\n{percent|${p.percent}%}`;
        },
        rich: {
          label: {
            color: '#009BFF',
          },
          num: {
            color: '#009BFF',
          },
          percent: {
            fontSize: 16,
            fontWeight: 500,
            color: '#00F0FF',
            align: 'center',
          },
        },
      },
      ...comStaticSeriesOptions,
    },
  ],
  ...comStaticOptions,
}));
</script>
<style lang="postcss" scoped>
.jcsstj-outline {
  margin-bottom: 6px;
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
