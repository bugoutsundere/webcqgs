<script lang="jsx">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { bbox, point, points, featureCollection } from "@turf/turf";
import GisMap from "@/components/GisMap/index.vue";
import Popup from "@/components/GisMap/Popup/index.vue";
import HoverPopup from "@/components/GisMap/HoverPopup/index.vue";
import StaticLayers from "./layer/StaticLayers/index.vue";
import StaticLayerPopupContent from "./popup/StaticLayerPopupContent/index.vue";
import CameraPlayer from "./popup/StaticLayerPopupContent/CameraPlayer.vue";
import EventLayer from "@/components/GisMap/Layer/EventLayer.vue"
import { layerCode } from "./config";
const interactiveStaticLayerCodeSet = new Set([
  layerCode.TOLL_STATION, // 收费站
  layerCode.SERVICE_AREA, // 服务区
  layerCode.BRIDGE, // 桥梁
  layerCode.TUNNEL, // 隧道
  layerCode.CULVERT, // 涵洞
  layerCode.CAMERA, // 摄像头
  layerCode.GANTRY, // 龙门架
  layerCode.BOARD, // 情报板
]);
export default defineComponent({
  data() {
    return {
      cameraData: null,
      cameraPopPosition: null,
      events: [
        {
          lng: 105.8239515869493,
          lat:29.262943891582296,
        },
      ]
    };
  },
  computed: {
    ...mapState({
      config: (state) => state.map.config,
      staticLayers: (state) => state.map.layers || [],
      visibleStaticLayerCodes: (state) => state.map.selectedLayers || [],
      allRoads: (state) => state.road.allRoads || [],
      selectRoadId: (state) => state.road.selectRoadId,
    }),
    selectRoad() {
      const { allRoads, selectRoadId } = this;
      if (!allRoads || allRoads.length < 1 || !selectRoadId) {
        return null;
      }
      return allRoads.find(({ id }) => id === selectRoadId);
    },
    interactiveStaticLayerIds() {
      const { staticLayers } = this;
      const arr = [];
      staticLayers &&
        staticLayers.forEach((item) => {
          interactiveStaticLayerCodeSet.has(item.code) &&
            arr.push(item.layerId);
        });
      return arr;
    },
    // 摄像头图层单独处理
    cameraLayer() {
      const { staticLayers } = this;
      return (
        staticLayers &&
        staticLayers.find(({ code }) => code === layerCode.CAMERA)
      );
    },
    roadBounds() {
      const { allRoads, selectRoad } = this;
      if (!allRoads || allRoads.length < 1) {
        return null;
      }
      const pointArr = [];
      if (selectRoad && selectRoad.begLng) {
        pointArr.push(point([selectRoad.begLng, selectRoad.begLat]));
        pointArr.push(point([selectRoad.endLng, selectRoad.endLat]));
      } else {
        allRoads.forEach((item) => {
          if (item.begLng) {
            pointArr.push(point([item.begLng, item.begLat]));
            pointArr.push(point([item.endLng, item.endLat]));
          }
        });
      }
      return bbox(featureCollection(pointArr));
    },
  },
  mounted() {
    this.$store.dispatch("map/getMapConfig");
  },
  methods: {
    onCameraLayerClick(evt) {
      console.log("onCameraLayerClick", evt);
      const { features, layer } = evt;
      if (!features || !features[0] || !features[0].properties) {
        return;
      }
      const { properties } = features[0];
      this.cameraPopPosition = [properties.lon, properties.lat];
      this.cameraData = { ...properties };
    },
    onCameraPopClose() {
      this.$emit("closeCamera", this.cameraData);
      this.cameraPopPosition = null;
      this.cameraData = null;
    },
  },
  render() {
    const {
      config,
      staticLayers,
      visibleStaticLayerCodes,
      interactiveStaticLayerIds,
      cameraLayer,
      roadBounds,
      cameraData,
      cameraPopPosition,
      onCameraLayerClick,
      onCameraPopClose,
      events,
    } = this;
    // <EventLayer data={events}></EventLayer>
    return (
      <GisMap config={config} bounds={roadBounds}>
        <StaticLayers
          staticLayers={staticLayers}
          visibleStaticLayerCodes={visibleStaticLayerCodes}
          onCameraLayerClick={onCameraLayerClick}
        />
        <HoverPopup layerIds={interactiveStaticLayerIds}>
          {{
            default: ({ layerId, data }) => {
              if (
                layerId !== cameraLayer.layerId ||
                !cameraData ||
                cameraData.camera_ind !== data.camera_ind
              ) {
                return <StaticLayerPopupContent data={data} />;
              }
              return null;
            },
          }}
        </HoverPopup>
        <Popup
          position={cameraPopPosition}
          options={{ closeOnClick: false }}
          onClose={onCameraPopClose}
        >
          {cameraData && <CameraPlayer data={cameraData} />}
        </Popup>
      </GisMap>
    );
  },
});
</script>
