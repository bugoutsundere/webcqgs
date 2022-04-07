<template>
  <div class="equipment">
    <Module
      :loading="loading"
      :error="error"
      :info="bsMeta && bsMeta['utilities']"
    >
      <template #title>设备状态统计</template>
      <div style="height: 250px">
        <Ect :options="ectOpts" />
      </div>
    </Module>
  </div>
</template>
<script setup>
import mapModule from "@/components/map-module/index.vue";
import { ref, onMounted, computed, reactive } from "vue";
import { useGradient } from "@/utils/color";
import { getEquipmentStatus } from "@/api/operation";
import { useStore } from "vuex";
import { key } from "@/store";
import { ElMessage } from "element-plus";
const loading = ref(true);
const store = useStore(key);
const selectRoadId = computed(() => store.state.road?.selectRoadId);

const staticOptions = {
  grid: {
    top: 20,
    left: 50,
    bottom: 100,
    right: 20,
  },
  legend: {
    bottom: "10px",
    icon: "roundRect",
    itemWidth: 12,
    itemHeight: 12,
    padding: [6, 10],
    itemGap: 30,
    textStyle: {
      color: "#ADADAD",
      fontSize: 10,
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderColor: "#000",
    axisPointer: {
      type: "shadow",
    },
    textStyle: {
      fontSize: 12,
      color: "#fff",
    },
    formatter: (params) => {
      var tooltip = "";
      for (var i = 0; i < params.length; i++) {
        const data = (params[i].data.rate * 100).toFixed(2);
        tooltip += `${params[i].data.deviceStatus}：${data}%<br/>`;
      }
      return tooltip;
    },
  },
  yAxis: {
    splitLine: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: "#DEEEFD",
        width: "0.5",
      },
    },
    axisLabel: {
      show: true,
      fontSize: 10,
      color: "#ADADAD",
      formatter: (val) => {
        return val * 100 + "%";
      },
    },
    axisTick: {
      show: false,
    },
  },
  xAxis: {
    type: "category",
    axisLine: {
      lineStyle: {
        color: "#DEEEFD",
        width: "0.5",
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      // rotate: 25,
      fontSize: 10,
      fontWeight: "400",
      interval: 0,
      color: "#ADADAD",
      formatter: function (value) {
        //x轴的文字改为竖版显示
        var str = value.split("");
        return str.join("\n");
      },
    },
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100,
    },
  ],
};

const dataset = reactive({
  source: [
    // { deviceStatus: "监控系统", rate: 0.0037, 故障设备变化量: -85.8 },
  ],
  dimensions: ["deviceStatus", "rate"],
});

const ectOpts = {
  dataset: dataset,
  series: [
    {
      name: "设备状态统计",
      type: "scatter",
      itemStyle: {
        color: useGradient("redWhite", "vertical"),
      },
      // symbolSize: (v) => setSymbolSize(v["rate"]),
    },
  ],
  ...staticOptions,
};
onMounted(() => {
  getData();
});
const getData = () => {
  let arr = [];
  getEquipmentStatus(selectRoadId.value).then((res) => {
    if (res && res.success) {
      const data = res.data;
      data.forEach((item) => {
        arr.push({
          deviceStatus: item.deviceStatus,
          rate: parseFloat(item.rate),
        });
      });
      dataset.source = arr;
    } else {
      ElMessage.error(res.msg || "系统异常");
    }
    loading.value = false;
  });
};
const setSymbolSize = (num) => {
  let num2 = Math.abs(Math.floor(num)) * 0.2;
  num2 = num2 > 30 ? 30 : num2;
  return num2;
};
</script>
<style lang="postcss" scoped>
.equipment {
  width: 420px;
  height: 33%;
  background: rgba(5, 15, 45, 0.5);
  position: absolute;
  bottom: 20px;
  left: 0;
}
</style>