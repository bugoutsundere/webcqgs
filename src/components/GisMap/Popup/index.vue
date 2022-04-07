<script>
import { defineComponent, createApp, h } from "vue";
export default defineComponent({
  props: {
    options: {
      type: Object,
      default: null,
    },
    position: {
      type: Array,
      default: null,
    },
    trackPointer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      node: null,
    };
  },
  inject: ["getMap"],
  watch: {
    options(newVal, oldVal) {
      // TODO 优化比较
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.initPop();
      }
    },
    position: {
      deep: true,
      handler(newVal, oldVal) {
        if (
          newVal &&
          oldVal &&
          newVal[0] === oldVal[0] &&
          newVal[1] === oldVal[1]
        ) {
          // 位置不变
          return;
        }
        this.update();
      },
    },
    trackPointer: {
      handler() {
        this.update();
      },
    },
  },
  created() {
    this.initVM();
    this.initPop();
  },
  beforeUnmount() {
    this.removePopup();
  },
  methods: {
    initVM() {
      const _this = this;
      const vm = createApp({
        provide: {
          getMap: _this.getMap
        },
        render() {
          return _this.node;
        },
      });
      const div = document.createElement("div");
      div.className = "minimap-popup-content-box";
      vm.mount(div);
      this.vm = vm;
    },
    initPop() {
      const { vm } = this;
      if (!vm) {
        return;
      }
      if (this.pop) {
        this.pop.off("open", this.onOpen);
        this.pop.off("close", this.onClose);
        this.pop.remove();
      }
      const options = { ...this.options };
      if (!options.maxWidth) {
        options.maxWidth = "none";
      }
      const pop = new minemap.Popup(options);
      pop.on("open", this.onOpen);
      pop.on("close", this.onClose);
      pop.setDOMContent(vm._container);
      this.pop = pop;
      this.update();
    },
    update() {
      this.getMap().then((map) => {
        this.map = map;
        const { pop, vm, position, trackPointer } = this;
        if (!map || !pop) {
          return;
        }
        if (
          !this.node ||
          (!position && !trackPointer) ||
          !vm._container.children ||
          vm._container.children.length < 1
        ) {
          // 没有实际的内容或者未指定位置时隐藏
          pop.remove();
          return;
        }
        if (position) {
          pop.setLngLat(position);
        } else if (trackPointer) {
          pop.trackPointer();
        }
        if (!pop.isOpen()) {
          pop.addTo(map);
        }
      });
    },
    onOpen(evt) {
      this.$emit("open", evt);
    },
    onClose(evt) {
      this.$emit("close", evt);
    },
    removePopup() {
      const { map, pop } = this;
      if (!map || !pop) {
        return;
      }
      if (this.vm && this.vm._container) {
        this.vm.unmount();
        this.vm = null;
      }
      pop.remove();
    },
  },
  render() {
    this.node = (this.$slots.default && this.$slots.default()) || null;
    return null;
  },
});
</script>
