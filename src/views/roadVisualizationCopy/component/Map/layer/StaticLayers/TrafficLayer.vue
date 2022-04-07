<script lang="jsx">
import Layer from "@components/GisMap/Layer/index.vue";
export default {
  props: {
    layer: {
      type: Object,
      required: true,
    },
    dynamicLayer: {
      type: Object,
      required: true,
    },
  },
  inject: ["getMap"],
  mounted() {
    this.updateSourceData();
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    updateSourceData() {
      this.getMap().then((map) => {
        const { layer, dynamicLayer } = this;
        const arr = [layer.sourceId];
        if (dynamicLayer) {
          arr.push(dynamicLayer.sourceId);
        }
        arr.forEach((sourceId, idx) => {
          if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }
          const type = idx === 0 ? 0 : 1;
          map.addSource(sourceId, {
            type: "vector",
            traffic: true,
            tiles: [
              `mineserver://data/dynamic-traffic/ertic?servicetype=${type}&z={z}&x={x}&y={y}`,
            ],
          });
        });
        this.timer = setTimeout(this.updateSourceData, 10000);
      });
    },
  },
  render() {
    const { layer, dynamicLayer } = this;
    if (!layer) {
      return null;
    }
    return (
      <>
        {[layer, dynamicLayer].map((layer) => {
          if (!layer) {
            return null;
          }
          const { layerId, sourceId } = layer;
          return <Layer id={layerId} sourceId={sourceId} static />;
        })}
      </>
    );
  },
};
</script>
