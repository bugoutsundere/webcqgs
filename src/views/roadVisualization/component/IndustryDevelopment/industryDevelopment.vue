<template>
  <div class="real-time">
    <map-module title="实时数据" :loading="loading">
      <div style="height: 250px">
        <div class="p-2.5 flex flex-wrap justify-around" v-if="!loading">
          <div class="group">
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
          <div class="group">
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
          <div class="group">
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
          <div class="group">
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
          <div class="group">
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
    </map-module>
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
  height: 280px;
  background: rgba(5, 15, 45, 0.5);
  position: absolute;
  bottom: 0;
  left: 30%;
  right: 0;
}
.label {
  @apply font-normal;
  font-size: 12px;
  color: #07ffed;
}
.label2 {
  font-size: 16px;
  color: rgba(213, 251, 255, 1);
}
.label3 {
  font-size: 13px;
}
.item {
  margin: 10px 0 20px;
}
</style>