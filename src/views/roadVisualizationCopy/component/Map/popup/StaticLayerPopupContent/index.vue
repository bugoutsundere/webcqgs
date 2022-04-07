<script lang="jsx">
import ServiceArea from "./ServiceArea.vue";
import TollStation from "./TollStation.vue";
import Bridge from "./Bridge.vue";
import Tunnel from "./Tunnel.vue";
import Culvert from "./Culvert.vue";
import Gantry from "./Gantry.vue";
import Camera from "./Camera.vue";
import Board from "./Board.vue";
import {
  fuwuqu,
  shoufeizhan,
  qiaoliang,
  suidao,
  handong,
  longmenjia,
  shexiangtou,
  qingbaoban,
} from "../../images/index.js";
import { layerCode } from "../../config";

const {
  SERVICE_AREA, // 服务区
  TOLL_STATION, // 收费站
  BRIDGE, // 桥梁
  TUNNEL, // 隧道
  CULVERT, // 涵洞
  GANTRY, // 龙门架
  CAMERA, // 摄像头
  BOARD, // 情报板
} = layerCode;

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  render() {
    const { data } = this;
    if (!data) {
      return null;
    }
    let typeName, Com;
    let icon;
    switch (data.layercode) {
      case SERVICE_AREA:
        // 服务区
        typeName = "服务区";
        icon = fuwuqu;
        Com = ServiceArea;
        break;
      case TOLL_STATION:
        // 收费站
        typeName = "收费站";
        icon = shoufeizhan;
        Com = TollStation;
        break;
      case BRIDGE:
        // 桥梁
        typeName = "桥梁";
        icon = qiaoliang;
        Com = Bridge;
        break;
      case TUNNEL:
        // 隧道
        typeName = "隧道";
        icon = suidao;
        Com = Tunnel;
        break;
      case CULVERT:
        // 涵洞
        typeName = "涵洞";
        icon = handong;
        Com = Culvert;
        break;
      case GANTRY:
        // 龙门架
        typeName = "龙门架";
        icon = longmenjia;
        Com = Gantry;
        break;
      case CAMERA:
        // 摄像头
        typeName = "摄像头";
        icon = shexiangtou;
        Com = Camera;
        break;
      case BOARD:
        // 情报板
        typeName = "情报板";
        icon = qingbaoban;
        Com = Board;
        break;
      default:
        break;
    }
    // const icon = new URL(`../../images/${typeName}.png`, import.meta.url).href;
    if (!Com) {
      return null;
    }
    return (
      <div class="slpc">
        <div class="header">
          <img src={icon} />
          <div>{typeName}</div>
        </div>
        <div class="body">
          <Com data={data} />
        </div>
      </div>
    );
  },
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
