<template>
  <Module
    class="layer-contrl-mod"
    :loading="loading"
    :error="error"
    :info="bsMeta && bsMeta['utilities']"
  >
    <template #title>主要构造物集</template>
    <div class="layer-contrl">
      <div class="group-content">
        <div
          class="group-item"
          v-for="layer in layersData"
          :key="layer.code"
          :class="{ active: selectedLayers.includes(layer.code.split('&')[0]) }"
          @click="onItemClick(layer.code, layer)"
        >
          <div class="item-icon">
            <img
              v-if="selectedLayers.includes(layer.code.split('&')[0])"
              :src="iconlist[layer.icon + 'Act']"
            />
            <img v-else :src="iconlist[layer.icon]" />
          </div>
          <div class="inlayertext">{{ layer.name }}</div>
        </div>
      </div>
      <EquipmentInfo
        v-if="equipmentDialogObj.equipmentInfoVisible"
        :equipmentInfoVisible="equipmentDialogObj.equipmentInfoVisible"
        :equipmentData="equipmentDialogObj.data"
        @equipmentInfoClose="equipmentInfoClose"
      ></EquipmentInfo>
      <Monitoring ref="monitoring"></Monitoring>
    </div>
  </Module>
</template>
<script lang="jsx">
import { defineComponent } from "vue";
import { mapState, mapMutations } from "vuex";
import EquipmentInfo from './components/equipmentInfo.vue'
import Monitoring from './components/monitoringlist.vue'
import brg from "@/assets/images/baseStruct/brg.png";
import brgAct from "@/assets/images/baseStruct/brg-active.png";
import tunnel from "@/assets/images/baseStruct/tunnel.png";
import tunnelAct from "@/assets/images/baseStruct/tunnel-active.png";
import route from "@/assets/images/baseStruct/route.png";
import routeAct from "@/assets/images/baseStruct/route-active.png";
import bp from "@/assets/images/baseStruct/bp.png";
import bpAct from "@/assets/images/baseStruct/bp-active.png";
import hd from "@/assets/images/baseStruct/hd.png";
import hdAct from "@/assets/images/baseStruct/hd-active.png";
import yhcl from "@/assets/images/baseStruct/yhcl.png";
import yhclAct from "@/assets/images/baseStruct/yhcl-active.png";
export default defineComponent({
  components: { EquipmentInfo, Monitoring },
  data() {
    return {
      iconlist: {
        brg: brg,
        brgAct: brgAct,
        tunnel: tunnel,
        tunnelAct: tunnelAct,
        route: route,
        routeAct: routeAct,
        bp: bp,
        bpAct: bpAct,
        hd: hd,
        hdAct: hdAct,
        yhcl: yhcl,
        yhclAct: yhclAct
      },
      hasEquipmentInfo: ['BOARD', 'EP_T', 'P_LJQ', 'MTL'],
      equipmentDialogObj: {
        equipmentInfoVisible: false,
        data: {}
      },
      groupLayer: [
        'BRIDGE', // 桥梁
        'TUNNEL', //隧道
        'CULVERT', // 涵洞
      ],
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
            },
            {
              code: 'MTL',
              deviceType: 'MTL',
              name: '监控列表'
            },
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
    // layersData() {
    //   const { layers, layersGroup } = this
    //   const list = []
    //   layersGroup.forEach(group => {
    //     const arr = []
    //     group.groupLayer.forEach( item => {
    //       if (typeof item === 'string') {
    //       const layer = layers.find(({ code }) => item === code)
    //       layer && arr.push(layer)
    //     } else if (item) {
    //       arr.push(item)
    //     }
    //     })
    //     list.push({
    //       groupName: group.groupName,
    //       groupLayer: arr
    //     })
    //   })


    //   return list
    // },
    layersData() {
      const { layers, groupLayer } = this
      const list = []
      const arr = [{
        name: '边坡',
        code: 'BP'
      }, {
        name: '沿路设施',
        code: 'YLSS'
      }, {
        name: '养护车辆',
        code: 'YHCL'
      }]
      groupLayer.forEach( item => {
          if (typeof item === 'string') {
          const layer = layers.find(({ code }) => item === code)
          layer && arr.push(layer)
        } else if (item) {
          arr.push(item)
        }
      })
      arr.forEach(item => {
        if(item.name == '桥梁') {
          item.icon = 'brg'
        }else if(item.name == '隧道'){
          item.icon = 'tunnel'
        }else if(item.name == '涵洞'){
          item.icon = 'hd'
        }else if(item.name == '沿路设施'){
          item.icon = 'route'
        }else if(item.name == '边坡'){
          item.icon = 'bp'
        }else{
          item.icon = 'yhcl'
        }
      });
      return arr
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
    }
  }
})
</script>
<style lang="postcss" scoped>
.layer-contrl-mod {
  width: 350px;
  height: 300px;
  position: absolute;
  bottom: 20px;
  left: 20px;
}
.layer-contrl {
  width: 100%;
  /* background: rgba(5, 15, 45, 0.5);
  border: 1px solid #00d0fd;
  border-radius: 8px; */
  overflow: auto;
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
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0 10px;
}
.group-item {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  font-size: 13px;
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
  width: 60%;
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
  width: 60px;
  height: 51px;
  margin: auto;
  /* background: red; */
}
</style>