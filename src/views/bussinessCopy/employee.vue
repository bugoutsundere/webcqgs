<template>
  <Module
    class="flex-grow"
    :info="bsMeta && bsMeta['emplCalc']"
    :loading="loading"
    :error="error"
  >
    <template #title>项目公司人员统计</template>
    <!-- <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="options" v-model="latest" />
    </template> -->

    <div class="absolute inset-0 flex flex-col" v-if="employeeData?.length > 0">
      <div class="flex flex-grow">
        <div class="rytj-box-left">
          <Ect :options="ectOpts2" />
        </div>
        <div class="rytj-box-rig">
          <div
            v-for="(item, index) in employeeData"
            :key="index"
            class="rbj-item"
            :style="{ left: item.left + 'px' }"
          >
            <img :src="icons.value[index]" />
            <div class="rbj-item-text">
              <div class="rbj-item-name">{{ item.prgName }}</div>
              <div class="rbj-item-value">
                {{ formatThousand(item.accval) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rate-bar-box flex-shrink-0f flex items-center justify-center">
        <div class="rate-bar">
          <template v-for="(item, index) in rateList" :key="index">
            <div
              v-if="item.accval"
              :title="`${item.rate}%`"
              class="rate-item"
              :style="`background:${icons.colors[index]};width:${item.rate}%;`"
            >
              <div class="rateLabel">{{ item.rate }}%</div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <Empty v-else-if="!loading" />
  </Module>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, watch, reactive } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";
import { state, employeeInfo } from "@/store/state";
import { genConfig } from "@/utils/request";
import { useRequest } from "vue-request";
import { formatThousand, formatYearMonth } from "@/utils/util";
import { useStyleGradient } from "@/utils/color";
import icon1 from "@/assets/images/tollEmployee/rytj-glry.png";
import icon2 from "@/assets/images/tollEmployee/rytj-glywyg.png";
import icon3 from "@/assets/images/tollEmployee/rytj-fwqywyg.png";
import icon4 from "@/assets/images/tollEmployee/rytj-qzywyg.png";
import icon5 from "@/assets/images/tollEmployee/rytj-qtywyg.png";
import { staffCount } from "@/api/businessOverview";

const icons = reactive({
  value: [icon1, icon2, icon3, icon4, icon5],
  colors: ["#00CBD7", "#FF9A00", "#5E5EFF", "#0084FC"],
});

const latest = ref(true);
const options = [
  { name: "最新", value: true },
  { name: "月", value: false },
];

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);
const appDate = computed(() => formatYearMonth(store.state.appDate));
const bsMeta = computed(() => store.getters.bsMeta);

const showDate = computed(() => {
  return latest.value
    ? employeeData.value?.length > 0
      ? employeeData.value[0].accDate
      : ""
    : appDate.value;
});

const paramsStr = computed(() => {
  const list = [];
  if (activeCom.value !== "list") {
    list.push(`com=${activeCom.value}`);
  }

  if (!latest.value) {
    list.push(`accDate=${appDate.value}`);
  }
  return list.length > 0 ? `?${list.join("&")}` : "";
});

const { data, loading, error, refresh } = useRequest<any>(() =>
  // genConfig(`/http-server-kpi/publish/jsc/employeenew${paramsStr.value}`)
  staffCount()
);

watch(paramsStr, refresh);

const employeeData = computed(() => {
  const msg = data.value?.msgContent[0];
  const list: any[] = [];
  employeeInfo.forEach(({ label, ref, color }, index) => {
    var idx = label.lastIndexOf("(");
    var newlabel = label.substring(0, idx);
    var left = 0;
    if (index == 1) {
      left = 20;
    } else if (index == 2) {
      left = 40;
    } else if (index == 3) {
      left = 20;
    } else {
      left = 0;
    }
    // console.log(ref)
    let target;
    switch(index){
      case 0:
        target = msg?.managerStaff;
        break;
      case 1:
        target = msg?.roadStaff;
        break;
      case 2:
        target = msg?.serviceareaStaff;
        break;
      case 3:
        target = msg?.clearStaff;
        break;
      case 4:
        target = msg?.otherStaff;
        break;
    }
    target &&
      list.push({
        left: left,
        prgName: newlabel,
        accval: target,
        accDate: target,
        color,
      });
    // let target = msg?.find(({ prgName }: any) => prgName?.indexOf(ref) === 0);
    // target &&
    //   list.push({
    //     left: left,
    //     prgName: newlabel,
    //     accval: target.accval,
    //     accDate: target.accDate,
    //     color,
    //   });
  });
  // console.log("list",list)
  return list;
});

const sum = computed(() =>
  employeeData.value
    ?.map((e: any) => Number(e.accval))
    ?.reduce((a: number, b: number) => a + b)
);

const rateList = computed(() => {
  return employeeData.value?.map((e) => {
    return {
      ...e,
      rate: getRate(e.accval),
    };
  });
});
const getRate = (val: number | string) =>
  Math.round((Number(val) * 1000) / sum.value) / 10;

const ectOpts2 = computed(() => {
  var tempData = [
    {
      value: 5,
      name: "工伤保险信息10项",
    },
    {
      value: 16,
      name: "失业保险信息8项",
    },
    {
      value: 15,
      name: "医疗保险信息9项",
    },
    {
      value: 10,
      name: "生育保障9项",
    },
    {
      value: 15,
      name: "养老保险11项",
    },
  ];

  // 最终输出数据
  var result = [];

  // 颜色
  var color = ["#0084FC", "#5E5EFF", "#00CBD7", "#FF9A00", "#46A7FF"];

  // 间隔数据的样式
  var placeHolderStyle = {
    normal: {
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      color: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(0, 0, 0, 0)",
      borderWidth: 0,
    },
  };

  // 循环加入间隔数据
  for (var i = 0; i < tempData.length; i++) {
    result.push(
      {
        value: tempData[i].value,
        name: tempData[i].name,
        itemStyle: {
          normal: {
            borderWidth: 2,
            shadowBlur: 5,
            borderColor: color[i],
            shadowColor: color[i],
          },
        },
      },
      {
        value: 2,
        name: "",
        itemStyle: placeHolderStyle, // 间隔数据
      }
    );
  }
  var options = {
    title: {
      text: sum.value,
      top: "45%",
      textAlign: "center",
      left: "47%",
      textStyle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "400",
      },
    },
    tooltip: {
      // 提示框
      trigger: "item",
      formatter: "{b} : {d}%",
      //formatter: "{b} : {d}% <br/> {c}"
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "60%"], //内 外圆半径
        center: ["50%", "50%"],
        color: color, // 色块填充颜色
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
          },
        },
        data: result,
      },
    ], // series end
  };
  return options;
});
</script>

<style lang="postcss" scoped>
.rytj-box-left {
  /* width: 136px; */
  width: 50%;
  position: relative;
}
.rytj-box-rig {
  width: 50%;
  position: relative;
  left: -50px;
  /* width: calc(100% - 136px); */
}
.rbj-item {
  display: flex;
  margin-top: 5px;
  position: relative;
}
.rbj-item img {
  width: 40px;
  height: 40px;
}
.rbj-item-text {
  margin-left: 5px;
}
.rbj-item-name {
  font-size: 14px;
  color: #778fa4;
}
.rbj-item-value {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
}
.icon {
  font-size: 80px;
  color: rgba(255, 255, 255, 0.3);
}

.sum {
  font-size: 22px;
}

.deco-block {
  height: 60%;
  width: 10px;
  margin-right: 10px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 5px 10px 2px #000;
}

.rate-bar-box {
  height: 40px;
  padding: 0 10px;
  position: relative;
  top: -10px;
}

.rate-bar {
  height: 12px;
  width: 100%;
  display: flex;
  padding: 3px;
  /* border: 1px solid rgb(212, 212, 212);
  box-shadow: 0 2px 10px 2px #000; */
  border: 1px solid rgba(0, 132, 251, 0.25);
  background: rgba(0, 132, 251, 0.1);
}

.rate-item {
  /* display: flex;
  align-items: center;
  justify-content: center; */
  height: 5px;

  & + .rate-item {
    border-left: 3px solid #18191b;
  }
}

.rateLabel {
  font-size: 12px;
  font-weight: bold;
  line-height: 10px;
  margin: auto;
  text-align: center;
  color: #bde0ff;
  position: relative;
  top: 10px;
  &.hide {
    display: none;
  }
}
</style>
