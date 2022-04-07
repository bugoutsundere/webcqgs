<script lang="jsx">
import HoverFeature from "../HoverFeature/index.vue";
import Popup from "../Popup/index.vue";
export default {
  props: {
    popupOptions: {
      type: Object,
      default: () => ({ closeButton: false }),
    },
    layerIds: {
      type: Array,
      default: null,
    },
    optionsParam: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    const { layerIds, popupOptions, optionsParam, $slots } = this;
    return (
      <HoverFeature layerIds={layerIds}>
        {{
          default: ({ feature, features }) => {
            if (!feature) {
              //   return null;
              return <Popup key="hoverPopup" position={null}></Popup>;
            }
            const {
              properties,
              layer: { id: layerId },
              geometry: { coordinates },
            } = feature;
            const options = optionsParam[layerId]
              ? Object.assign({}, popupOptions, optionsParam[layerId])
              : popupOptions;
            return (
              <Popup key="hoverPopup" position={coordinates} options={options}>
                {$slots.default({
                  layerId,
                  data: properties,
                  feature,
                  features,
                })}
              </Popup>
            );
          },
        }}
      </HoverFeature>
    );
  },
};
</script>
