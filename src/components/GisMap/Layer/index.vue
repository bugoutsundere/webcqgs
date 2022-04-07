<script lang="jsx">
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    sourceId: {
      type: String,
      default() {
        return this.sourceIdFromParent;
      },
    },
    static: {
      type: Boolean,
      defalut: false,
    },
    type: {
      type: String,
      default: "symbol",
    },
    layout: {
      type: Object,
      default: null,
    },
    paint: {
      type: Object,
      default: null,
    },
    filter: {
      type: Array,
      default: null,
    },
  },
  inject: {
    getMap: "getMap",
    sourceIdFromParent: {
      from: "sourceId",
      default: null,
    },
  },
  watch: {
    layout: {
      deep: true,
      handler() {
        this.updateLayout();
      },
    },
    paint: {
      deep: true,
      handler() {
        this.updatePaint();
      },
    },
    filter: {
      deep: true,
      handler() {
        this.updateFilter();
      },
    },
  },
  mounted() {
    this.addLayer();
  },
  beforeUnmount() {
    if (this.static) {
      this.hide();
    } else {
      this.removeLayer();
    }
  },
  methods: {
    addLayer() {
      console.log('addlayer')
      this.getMap().then((map) => {
        this.map = map;
        const { id, sourceId, type, layout, paint, filter } = this;
        if (map.getLayer(id)) {
          // 图层默认已存在
          this.updateLayout();
          this.updatePaint();
          this.updateFilter();
          this.show();
        } else {
          // 图层不存在
          const options = {
            id,
            type,
            source: sourceId,
            // 'source-layer': sourceId,
          };
          if (layout) {
            options.layout = layout;
          }
          if (paint) {
            options.paint = paint;
          }
          if (filter) {
            options.filter = filter;
          }
          map.addLayer(options);
        }
        this.initEvent();
      });
    },
    initEvent() {
      const { map, id, $attrs } = this;
      const { ...attrs } = $attrs
      if (!map) {
        return;
      }
      console.log($attrs)
      for (const evtKey in attrs) {
        map.on('click', id, (evt) => {
          this.$emit('click', { ...evt, layerId: id });
        });
      }
      // for (const evtKey in $listeners) {
      //   if (Object.hasOwnProperty.call($listeners, evtKey)) {
      //     map.on(evtKey, id, (evt) => {
      //       this.$emit(evtKey, { ...evt, layerId: id });
      //     });
      //   }
      // }
    },
    show() {
      const { map, id } = this;
      if (!map) {
        return;
      }
      map.setLayoutProperty(id, "visibility", "visible");
    },
    hide() {
      const { map, id } = this;
      if (!map) {
        return;
      }
      map.setLayoutProperty(id, "visibility", "none");
    },
    updateLayout() {
      const { map, id, layout } = this;
      if (!map || !layout) {
        return;
      }
      for (const key in layout) {
        layout.hasOwnProperty(key) &&
          map.setLayoutProperty(id, key, layout[key]);
      }
    },
    updatePaint() {
      const { map, id, paint } = this;
      if (!map || !paint) {
        return;
      }
      for (const key in paint) {
        paint.hasOwnProperty(key) && map.setLayoutProperty(id, key, paint[key]);
      }
    },
    updateFilter() {
      const { map, id, filter } = this;
      if (!map || !filter) {
        return;
      }
      map.setFilter(id, filter);
    },
    removeLayer() {
      const { map, id } = this;
      if (!map || !map.getLayer(id)) {
        return;
      }
      map.removeLayer(id);
    },
  },
  render() {
    return null;
  },
};
</script>
