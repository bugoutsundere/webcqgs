<template>
  <div class="real-time">
    <div class="real-time-tit">实时数据</div>
    <div style="height: 250px">
      <div class="p-2.5 flex flex-wrap justify-around" v-if="!loading">
        <div class="group group1">
          <div class="item">
            <div class="label">入口车流辆</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.entryCount) || "-" }}
              <span class="label3">辆</span>
            </div>
          </div>
          <div class="item">
            <div class="label">出口车流量</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.exitCount) }}
              <span class="label3">辆</span>
            </div>
          </div>
          <div class="item">
            <div class="label">出口交易金额</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.stationAmount) }}
              <span class="label3">万元</span>
            </div>
          </div>
        </div>
        <div class="group group2">
          <div class="item">
            <div class="label">门架计费金额</div>
            <div class="mt-2 label2">
              {{
                formatThousand(
                  dataset.msgdata.gateAmount
                    ? dataset.msgdata.gateAmount / 100
                    : dataset.msgdata.gateAmount
                )
              }}
              <span class="label3">元</span>
            </div>
          </div>
          <div class="item">
            <div class="label">门架车流量</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.gateCount) }}
              <span class="label3">辆</span>
            </div>
          </div>
        </div>
        <div class="group group3">
          <div class="item">
            <div class="label">已完成病害数量</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.diseaseDoneCount) }}
              <span class="label3">个</span>
            </div>
          </div>
          <div class="item">
            <div class="label">已维修病害数量</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.diseaseRepairCount) }}
              <span class="label3">个</span>
            </div>
          </div>
          <div class="item">
            <div class="label">暂存病害数量</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.diseaseExistCount) }}
              <span class="label3">个</span>
            </div>
          </div>
        </div>
        <div class="group group4">
          <div class="item">
            <div class="label">机电故障上报数量</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.elecFaultCount) }}
              <span class="label3">个</span>
            </div>
          </div>
          <div class="item">
            <div class="label">机电故障已维修数量</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.elecRepairCount) }}
              <span class="label3">个</span>
            </div>
          </div>
          <div class="item">
            <div class="label">机电故障待维修数量</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.elecExistCount) }}
              <span class="label3">个</span>
            </div>
          </div>
        </div>
        <div class="group group5">
          <div class="item">
            <div class="label">服务区营收</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.elecExistCount) }}
              <span class="label3">万元</span>
            </div>
          </div>
          <div class="item">
            <div class="label">服务区人流量</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.elecExistCount) }}
              <span class="label3">个</span>
            </div>
          </div>
          <div class="item">
            <div class="label">服务区危化品车辆</div>
            <div class="mt-2 label2">
              {{ formatThousand(dataset.msgdata.elecExistCount) }}
              <span class="label3">辆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import mapModule from "@/components/map-module/index.vue";
import { ref, onMounted, computed, reactive } from "vue";
import { formatThousand } from "@/utils/util";
import { getChargeBoard } from "@/api/operation";

const loading = ref(true);

const dataset = reactive({
  msgdata: {},
});
const getData = async () => {
  const date = new Date().toLocaleDateString();
  const ndate = date.replace(/\//g, "-");
  const { data } = await getChargeBoard(ndate);
  console.log("aaaaaaaaaaaaaaaa");
  console.log(data);
  if (data) {
    dataset.msgdata = data;
  }
  loading.value = false;
};

onMounted(() => {
  getData();
});
</script>
<style lang="postcss" scoped>
.real-time {
  width: calc(70% - 349px);
  height: 300px;
  background: rgba(5, 15, 45, 0.5);
  position: absolute;
  bottom: 40px;
  left: 25%;
  right: 0;
  background: url("@/assets/images/roadVisualization/ssbg.png");
  background-size: 100% 100%;
  padding-top: 25px;
}
.real-time-tit {
  font-size: 14px;
  width: 300px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  background: linear-gradient(to right, transparent, #b37e2b, transparent);
  position: absolute;
  left: 50%;
  margin-left: -100px;
  top: -15px;
}
.label {
  @apply font-normal;
  font-size: 12px;
  color: #a8c2da;
}
.label2 {
  font-size: 24px;
  letter-spacing: 2px;
  font-weight: bold;
  padding-left: 15px;
}
.label3 {
  font-size: 13px;
  color: #798a9a;
  display: inline-block;
  margin-left: 5px;
}
.item {
  margin: 10px 0 20px;
}
.group1 {
  & .label:before {
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("@/assets/images/roadVisualization/group-icon1.png");
    background-size: 100% 100%;
    content: "";
    vertical-align: middle;
  }
  & .label2 {
    color: #0084fb;
  }
}
.group2 {
  & .label:before {
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("@/assets/images/roadVisualization/group-icon2.png");
    background-size: 100% 100%;
    content: "";
    vertical-align: middle;
  }
  & .label2 {
    color: #ff9914;
  }
}
.group3 {
  & .label:before {
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("@/assets/images/roadVisualization/group-icon3.png");
    background-size: 100% 100%;
    content: "";
    vertical-align: middle;
  }
  & .label2 {
    color: #ffed9c;
  }
}
.group4 {
  & .label:before {
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("@/assets/images/roadVisualization/group-icon4.png");
    background-size: 100% 100%;
    content: "";
    vertical-align: middle;
  }
  & .label2 {
    color: #39ffd7;
  }
}
.group5 {
  & .label:before {
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("@/assets/images/roadVisualization/group-icon5.png");
    background-size: 100% 100%;
    content: "";
    vertical-align: middle;
  }
  & .label2 {
    color: #ff9914;
  }
}
</style>