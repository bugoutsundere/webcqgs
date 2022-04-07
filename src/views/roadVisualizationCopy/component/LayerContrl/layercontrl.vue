<template>
  <div class="layer-contrl">
    <div class="layer-group" v-for="(item, index) in layersData" :key="index">
      <Module
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['utilities']"
      >
        <template #title>{{ item.groupName }}</template>
        <!-- <div class="group-title">
          <span>{{ item.groupName }}</span>
        </div> -->
        <div class="group-content">
          <div
            class="group-item"
            v-for="layer in item.groupLayer"
            :key="layer.code"
            :class="{
              active: selectedLayers.includes(layer.code.split('&')[0]),
            }"
            @click="onItemClick(layer.code, layer)"
          >
            <div class="item-icon">
              <img
                v-if="selectedLayers.includes(layer.code.split('&')[0])"
                :src="imagelist[layer.code + 'act']"
              />
              <img v-else :src="imagelist[layer.code]" />
            </div>
            <div class="inlayertext">{{ layer.name }}</div>
            <!-- <span>{{ layer.name }}</span> -->
          </div>
        </div>
      </Module>
    </div>
    <EquipmentInfo
      v-if="equipmentDialogObj.equipmentInfoVisible"
      :equipmentInfoVisible="equipmentDialogObj.equipmentInfoVisible"
      :equipmentData="equipmentDialogObj.data"
      @equipmentInfoClose="equipmentInfoClose"
    ></EquipmentInfo>
    <Monitoring ref="monitoring"></Monitoring>
  </div>
</template>
<script lang="jsx">
import { defineComponent } from "vue";
import { mapState, mapMutations } from "vuex";
import EquipmentInfo from './components/equipmentInfo.vue'
import Monitoring from './components/monitoringlist.vue'

import ROUTE from "@/assets/images/roadVisualization/ROUTE.png";
import ROUTEact from "@/assets/images/roadVisualization/ROUTE-act.png";

import MILESTONE_HM from "@/assets/images/roadVisualization/MILESTONE_HM.png";
import MILESTONE_HMact from "@/assets/images/roadVisualization/MILESTONE_HM-act.png";

import MILESTONE_KM from "@/assets/images/roadVisualization/MILESTONE_KM.png";
import MILESTONE_KMact from "@/assets/images/roadVisualization/MILESTONE_KM-act.png";

import TRAFFIC from "@/assets/images/roadVisualization/TRAFFIC&DYNAMIC_TRAFFIC.png";
import TRAFFICact from "@/assets/images/roadVisualization/TRAFFIC&DYNAMIC_TRAFFIC-act.png";

import BRIDGE from "@/assets/images/roadVisualization/BRIDGE.png";
import BRIDGEact from "@/assets/images/roadVisualization/BRIDGE-act.png";

import TUNNEL from "@/assets/images/roadVisualization/TUNNEL.png";
import TUNNELact from "@/assets/images/roadVisualization/TUNNEL-act.png";

import SERVICE_AREA from "@/assets/images/roadVisualization/SERVICE_AREA.png";
import SERVICE_AREAact from "@/assets/images/roadVisualization/SERVICE_AREA-act.png";

import TOLL_STATION from "@/assets/images/roadVisualization/TOLL_STATION.png";
import TOLL_STATIONact from "@/assets/images/roadVisualization/TOLL_STATION-act.png";

import CULVERT from "@/assets/images/roadVisualization/CULVERT.png";
import CULVERTact from "@/assets/images/roadVisualization/CULVERT-act.png";

import CAMERA from "@/assets/images/roadVisualization/CAMERA.png";
import CAMERAact from "@/assets/images/roadVisualization/CAMERA-act.png";

import BOARD from "@/assets/images/roadVisualization/BOARD.png";
import BOARDact from "@/assets/images/roadVisualization/BOARD-act.png";

import EP_T from "@/assets/images/roadVisualization/EP_T.png";
import EP_Tact from "@/assets/images/roadVisualization/EP_T-act.png";

import P_LJQ from "@/assets/images/roadVisualization/P_LJQ.png";
import P_LJQact from "@/assets/images/roadVisualization/P_LJQ-act.png";
export default defineComponent({
  components: { EquipmentInfo, Monitoring },
  data() {
    return {
      // stat: stat,
      hasEquipmentInfo: ['BOARD', 'EP_T', 'P_LJQ'],
      equipmentDialogObj: {
        equipmentInfoVisible: false,
        data: {}
      },
      imagelist: {
        ROUTE: ROUTE,
        ROUTEact: ROUTEact,
        MILESTONE_HM: MILESTONE_HM,
        MILESTONE_HMact: MILESTONE_HMact,
        MILESTONE_KM: MILESTONE_KM,
        MILESTONE_KMact: MILESTONE_KMact,
        'TRAFFIC&DYNAMIC_TRAFFIC': TRAFFIC,
        'TRAFFIC&DYNAMIC_TRAFFICact': TRAFFICact, 
        BRIDGE: BRIDGE,
        BRIDGEact: BRIDGEact,
        TUNNEL: TUNNEL,
        TUNNELact: TUNNELact,
        SERVICE_AREA: SERVICE_AREA,
        SERVICE_AREAact: SERVICE_AREAact,
        TOLL_STATION: TOLL_STATION,
        TOLL_STATIONact: TOLL_STATIONact,
        CULVERT: CULVERT,
        CULVERTact: CULVERTact,
        CAMERA: CAMERA,
        CAMERAact: CAMERAact,
        BOARD: BOARD,
        BOARDact: BOARDact,
        EP_T: EP_T,
        EP_Tact: EP_Tact,
        P_LJQ: P_LJQ,
        P_LJQact: P_LJQact
      },
      layersGroup: [
        {
          groupName: '路线概况集',
          groupLayer: [
            'ROUTE', // 路线
            'MILESTONE_HM', // 百米桩
            'MILESTONE_KM', // 千米桩
            {
              code: 'TRAFFIC&DYNAMIC_TRAFFIC',
              name: '实时路况'
            }
          ]
        },
        {
          groupName: '主要构造物集',
          groupLayer: [
            'BRIDGE', // 桥梁
            'TUNNEL', //隧道
            'SERVICE_AREA', // 服务区
            'TOLL_STATION', // 收费站
            'CULVERT', // 涵洞
          ]
        },
        {
          groupName: '沿线设施集',
          groupLayer: [
            'CAMERA', // 摄像头
            {
              code: 'BOARD',
              deviceType: 'CF',
              name: '情报板'
            },
            {
              code: 'EP_T',
              deviceType: 'EP_T',
              name: '紧急电话设备'
            },
            {
              code: 'P_LJQ',
              deviceType: 'P_LJQ',
              name: '加强灯'
            }
          ]
        },
      ],
      layerIcon: {
        ROUTE: 'ROUTE',
        MILESTONE_HM: 'MILESTONE_HM',
        MILESTONE_KM: 'MILESTONE_KM',
        BRIDGE: 'BRIDGE',
        TUNNEL: 'TUNNEL',
        SERVICE_AREA: 'SERVICE_AREA',
        TOLL_STATION: 'TOLL_STATION',
        CULVERT: 'CULVERT',
        CAMERA: 'CAMERA',
        BOARD: 'BOARD',
        EP_T: 'EP_T',
        P_LJQ: 'P_LJQ',
      },
    }
  },
  computed: {
    ...mapState({
      layers: (state) => state.map.layers,
      selectedLayers: (state) => state.map.selectedLayers,
    }),
    layersData() {
      const { layers, layersGroup } = this
      const list = []
      layersGroup.forEach(group => {
        const arr = []
        group.groupLayer.forEach( item => {
          if (typeof item === 'string') {
          const layer = layers.find(({ code }) => item === code)
          layer && arr.push(layer)
        } else if (item) {
          arr.push(item)
        }
        })
        list.push({
          groupName: group.groupName,
          groupLayer: arr
        })
      })
      return list
    },
  },
  methods: {
    ...mapMutations('map', ['SET_STATE']),
    onItemClick(code, layer) {
      let list = code.split('&')
      const { hasEquipmentInfo, equipmentDialogObj } = this
      const selectedLayers = [...this.selectedLayers]
      list.map(code => {
        const idx = selectedLayers.findIndex(item => item === code)
        if (idx === -1) {
          selectedLayers.push(code)
          if(hasEquipmentInfo.includes(code)) {
            let data = {
              deviceType: layer.deviceType,
              name: layer.name
            }
            equipmentDialogObj.data = data
              equipmentDialogObj.equipmentInfoVisible = true
            
          }
        } else {
          selectedLayers.splice(idx, 1)
        }
      })
      let obj = {
        key: 'selectedLayers',
        value: selectedLayers
      }
      this.SET_STATE(obj)
    },
    equipmentInfoClose() {
      this.equipmentDialogObj.equipmentInfoVisible = false
    },
  }
})
</script>
<style lang="postcss" scoped>
.layer-contrl {
  width: 430px;
  height: 55%;
  position: absolute;
  top: 110px;
  /* left: 20px; */
  border-radius: 8px;
  /* padding: 20px; */
  /* overflow: auto; */
  background: rgba(0, 0, 0, 0.1);
}
.group-title {
  position: relative;
  color: #d5fbff;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  padding-left: 15px;
  &::before {
    position: absolute;
    left: 0;
    content: " ";
    width: 5px;
    height: 18px;
    background: linear-gradient(180deg, #f7ffff, #00d3ff);
    border-radius: 2px;
  }
}
.group-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0 10px;
}
.group-item {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  font-size: 12px;
  cursor: pointer;
  text-align: center;
  line-height: 18px;
  color: #fff;
  box-sizing: border-box;
  &.active {
    color: #07ffed;
  }
}
.layerIcon {
  margin: auto;
  width: 10px;
  height: 10px;
  color: #fff;
}
.icon {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ede9e9;
  border-radius: 50%;
  margin-bottom: 5px;
  &.active {
    border-color: #3ebfb5;
    background: #3ebfb5;
  }
}
.active .inlayertext {
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 192, 0, 0.45),
    transparent
  );
  color: rgba(255, 206, 90, 1);
}
.inlayertext {
  font-weight: bold;
  letter-spacing: 1px;
  width: 100%;
  height: 15px;
  line-height: 15px;
  margin: auto;
  margin-top: 0;
  margin-bottom: 0.1rem;
  text-align: center;
  color: #badeff;
  font-size: 13px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(0, 72, 137, 1),
    transparent
  );
}
.item-icon {
  width: 55px;
  height: 46px;
  margin: auto;
  /* background: red; */
}
</style>