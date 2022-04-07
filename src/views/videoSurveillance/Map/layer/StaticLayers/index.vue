<script lang="jsx">
import StaticLayer from "./StaticLayer.vue";
import TrafficLayer from "./TrafficLayer.vue";
import CameraLayer from "./CameraLayer.vue";
import { layerCode } from "../../config";
export default {
  props: {
    // 所有的静态图层配置
    staticLayers: {
      type: Array,
      default: () => [],
    },
    // 显示图层的code
    visibleStaticLayerCodes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    // 路线图层默认展示，单独处理
    dynamicTrafficLayer() {
      const { staticLayers } = this;
      return (
        staticLayers &&
        staticLayers.find(({ code }) => code === layerCode.DYNAMIC_TRAFFIC)
      );
    },
    visibleStaticLayers() {
      const { staticLayers, visibleStaticLayerCodes } = this;
      if (
        !staticLayers ||
        staticLayers.length < 1 ||
        !visibleStaticLayerCodes ||
        visibleStaticLayerCodes.length < 1
      ) {
        return [];
      }
      const visibleLayerCodeSet = new Set(visibleStaticLayerCodes);
      const { ROUTE, DYNAMIC_TRAFFIC } = layerCode;

      // 路线图层默认展示，不需要前端处理
      if (visibleLayerCodeSet.has(ROUTE)) {
        visibleLayerCodeSet.delete(ROUTE);
      }
      // 路况图层动态粒子路况图层合并为一个
      if (visibleLayerCodeSet.has(DYNAMIC_TRAFFIC)) {
        visibleLayerCodeSet.delete(DYNAMIC_TRAFFIC);
      }
      return staticLayers.filter(({ code }) => visibleLayerCodeSet.has(code));
    },
  },
  methods: {
    onCameraLayerClick(evt) {
      console.log("onCameraLayerClick", evt);
      this.$emit("cameraLayerClick", evt);
    },
  },
  render() {
    const { visibleStaticLayers, dynamicTrafficLayer } = this;
    console.log(visibleStaticLayers, dynamicTrafficLayer);
    return (
      <>
        {visibleStaticLayers.map((layer) => {
          const { code, layerId } = layer;
          if (code === layerCode.TRAFFIC) {
            return (
              <TrafficLayer
                key={layerId}
                layer={layer}
                dynamicLayer={dynamicTrafficLayer}
              />
            );
          }
          if (code === layerCode.CAMERA) {
            return (
              <CameraLayer
                key={layerId}
                layer={layer}
                onClick={this.onCameraLayerClick}
              />
            );
          }
          return <StaticLayer key={layerId} layer={layer} />;
        })}
      </>
    );
  },
};
</script>
