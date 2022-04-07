<script lang="jsx">
import Layer from "@components/GisMap/Layer/index.vue";
export default {
  props: {
    layer: {
      type: Object,
      required: true,
    },
  },
  render() {
    const { layer, $attrs } = this;
    if (!layer) {
      return null;
    }
    const { layerId, sourceId } = layer;
    return <Layer id={layerId} sourceId={sourceId} static {...$attrs} />;
  },
};
</script>
