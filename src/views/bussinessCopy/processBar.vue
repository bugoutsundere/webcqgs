<template>
  <div class="proout">
    <div
      class="pro-box"
      v-for="(item, index) in computedProcessValue"
      :key="index"
    >
      <div class="pro-toptext">
        <div class="pro-toptext1">{{ item.name }}</div>
        <div class="pro-toptext2">{{ item.total }}</div>
      </div>
      <div class="proline">
        <div class="inproline" :style="{ width: item.bili + '%' }">
          <div
            v-for="(val, idx) in item.types"
            :key="idx"
            :style="{ width: val.bili + '%', background: val.color }"
            class="prolineitem"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="val.data"
              placement="top-start"
            >
              <div class="inner"></div>
            </el-tooltip>
          </div>
          <div class="outy">
            <div class="innery"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProcessBar",
  props: {
    processValue: {
      type: Array,
      default: [0],
    },
  },
  data() {
    return {
      dataSum: 0,
      processArray: [],
    };
  },
  components: {},
  created() {
    // this.processValue.forEach((item) => {
    //   item.bili = Math.round((item.total / 1000) * 100);
    //   item.types.forEach((ele, idx) => {
    //     ele.color = colorList[idx];
    //     ele.bili = Math.round((ele.data / item.total) * 100);
    //   });
    // });
  },
  computed: {
    computedProcessValue() {
      const colorList = ["#0084FC", "#5E5EFF", "#00C4CF", "#FF9A00"];
      const arr = [];
      this.processValue.map((item) => {
        item.bili = Math.round((item.total / 1000) * 100);
        item.types.map((ele, idx) => {
          ele.color = colorList[idx];
          ele.bili = Math.round((ele.data / item.total) * 100);
        });
        arr.push(item)
      });
      return arr;
    },
  },
  mounted() {},
  methods: {
    getProcessDesc(data) {
      return data == 0 ? " " : data + "%";
    },
  },
};
</script>
<style scoped>
.el-popper {
  background: #000 !important;
}
.proout {
  width: 100%;
  padding: 1px 20px;
  overflow: auto;
}
.pro-box {
  width: 100%;
  margin-top: 10px;
}
.pro-toptext {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}
.pro-toptext1 {
  font-size: 14px;
  color: #badeff;
}
.pro-toptext2 {
  font-size: 18px;
  color: #ffdaa5;
}
.proline {
  width: 100%;
  height: 13px;
  padding: 3px;
  border: 1px solid rgba(174, 146, 107, 0.35);
  background: rgba(255, 154, 0, 0.1);
}
.inproline {
  display: flex;
  position: relative;
}
.prolineitem {
  border-right: 3px solid #18191b;
}
.inner {
  width: 100%;
  height: 5px;
}
.innery {
  width: 11px;
  height: 11px;
  background: #ffd28e;
  margin: auto;
  border-radius: 10px;
}
.outy {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: rgba(255, 210, 142, 0.5);
  position: absolute;
  top: -7px;
  left: 99%;
  margin-left: -11px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 8px #ffe8c6;
}
</style>

