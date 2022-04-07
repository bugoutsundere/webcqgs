<script lang="jsx">
import throttle from "lodash/throttle";
// 用于记录需要响应鼠标移动事件的图层id
const layaerIdSet = new Set();
// 用于记录layerId => vm 对应关系
const vmMap = {};
// 响应鼠标事件的实际vm
let triggerVM = null;
// 上一次响应具体效果的vm
let triggeredVM = null;
export default {
  inject: ["getMap"],
  props: {
    layerIds: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      feature: null,
      features: null,
    };
  },
  watch: {
    layerIds: {
      immediate: true,
      handler(newVal, oldVal) {
        this.updateLayers(newVal, oldVal);
      },
    },
  },
  mounted() {
    this.getMap().then((map) => {
      this.map = map;
      this.init();
    });
  },
  beforeUnmount() {
    const { layerIds } = this;
    layerIds &&
      layerIds.forEach((item) => {
        this.removeLayer(item);
      });
  },
  methods: {
    init() {
      const { map } = this;
      if (!map) {
        return;
      }
      // TODO 需优化，解决多个图层重复触发的问题
      // map.on('mousemove', this.onMousemove)
    },
    updateLayers(newVal, oldVal) {
      const newValSet = new Set(newVal);
      const oldValSet = new Set(oldVal);
      newValSet.forEach((item) => {
        if (!oldValSet.has(item)) {
          // 新增的
          this.addLayer(item);
        }
      });
      oldValSet.forEach((item) => {
        if (!newValSet.has(item)) {
          // 删除的
          this.removeLayer(item);
        }
      });
    },
    addLayer(layerId) {
      if (!layerId) {
        return;
      }
      vmMap[layerId] = this;
      layaerIdSet.add(layerId);
      this.initEvent();
    },
    removeLayer(layerId) {
      if (!layerId) {
        return;
      }
      delete vmMap[layerId];
      layaerIdSet.delete(layerId);
      this.initEvent();
    },
    initEvent() {
      this.getMap().then((map) => {
        const firstVM = Object.values(vmMap)[0];
        if (triggerVM) {
          if (triggerVM === firstVM) {
            return;
          }
          map.off("mousemove", triggerVM.onMousemove);
        }
        triggerVM = firstVM;
        if (triggerVM) {
          map.on("mousemove", triggerVM.onMousemove);
        }
      });
    },
    onMousemove: throttle(function (evt) {
      const { map } = this;
      if (map && layaerIdSet.size > 0) {
        const features = map
          .queryRenderedFeatures(evt.point, {
            // 通过layers选项过滤会出现图层未加载时报错的问题
            // layers: [...layaerIdSet],
          })
          .filter((feature) => layaerIdSet.has(feature.layer.id));
        const feature = features && features[0];
        if (feature) {
          const layerId = feature.layer.id;
          const vm = vmMap[layerId];
          if (vm) {
            vm.feature = feature;
            vm.features = features;
            if (triggeredVM && triggeredVM !== vm) {
              triggeredVM.feature = null;
              triggeredVM.features = null;
            }
            triggeredVM = vm;
            return;
          }
        }
      }
      if (triggeredVM) {
        triggeredVM.feature = null;
        triggeredVM.features = null;
        triggeredVM = null;
      }
    }, 67),
  },
  render() {
    const { feature, features } = this;
    return this.$slots.default({
      feature,
      features,
    });
  },
};
</script>
