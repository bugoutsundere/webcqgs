<script lang="jsx">
import { defineComponent, onMounted, onUpdated, onUnmounted } from "vue";
import { mapState } from "vuex";
import ResizeObserver from "resize-observer-polyfill";
import debounce from "lodash/debounce";
import { getMapConfig } from "@/api/gis";
const defaultBounds = [72.675311, 17.022993, 136.308124, 53.986993];
export default defineComponent({
  components: {},
  provide() {
    return {
      mapVM: this,
      getMap: this.getMap,
    };
  },
  props: {
    config: {
      type: Object,
      default: null,
    },
    center: {
      type: [Array, Object],
      default: null,
    },
    zoom: {
      type: Number,
      default: 0,
    },
    minZoom: {
      type: Number,
      default: 0,
    },
    maxZoom: {
      type: Number,
      default: 17,
    },
    bounds: {
      type: Array,
      default: null,
    },
    maxBounds: {
      type: Array,
      default: null,
    },
    fitBoundsOptions: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loaded: false,
      layers: [],
    };
  },
  computed: {
    watchViewProps() {
      return [this.center, this.zoom, this.bounds, this.fitBoundsOptions];
    },
  },
  watch: {
    config() {
      this.init();
    },
    watchViewProps() {
      this.fitView();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { config, _initPromise } = this;
      if (!config || !config.key || _initPromise) {
        return;
      }
      const {
        key,
        domainUrl,
        dataDomainUrl,
        spriteUrl,
        serviceUrl,
        solution,
        style,
      } = config;
      this._initPromise = new Promise((resolve, reject) => {
        this.loadMinemapAPI()
          .then(() => {
            minemap.domainUrl = domainUrl;
            minemap.dataDomainUrl = dataDomainUrl;
            minemap.spriteUrl = spriteUrl;
            minemap.serviceUrl = serviceUrl;
            minemap.appKey = key;
            minemap.solution = solution;

            const options = this.getOptions();
            console.log(options);
            options.style = style;

            const map = new minemap.Map(options);
            map.on("load", () => {
              this._initPromise = null;
              this.loaded = true;
              map.repaint = true;
              this.$emit("load", { map, getMap: this.getMap });
              this.map = map;
              this.fitView();
              this.initEvent();
              this.observeResize();
              resolve();
            });
          })
          .catch((err) => {
            reject("初始化地图失败", err);
          });
      });
    },
    initEvent() {
      const { map, $attrs } = this;
      const { ...attrs } = $attrs;
      if (!map) {
        return;
      }
      for (const evtKey in attrs) {
        if (evtKey !== "onLoad") {
          map.on("click", id, (evt) => {
            this.$emit("click", { ...evt });
          });
        }
      }

      // for (const evtKey in $listeners) {
      //   if (
      //     evtKey !== "load" &&
      //     Object.hasOwnProperty.call($listeners, evtKey)
      //   ) {
      //     map.on(evtKey, (evt) => {
      //       this.$emit(evtKey, { ...evt });
      //     });
      //   }
      // }
    },
    observeResize() {
      if (!ResizeObserver || !this.$refs.mapEl) {
        return;
      }
      const debouncedResize = debounce(() => {
        this.map.resize();
      }, 100);
      const observer = new ResizeObserver(debouncedResize);
      observer.observe(this.$refs.mapEl);
    },
    getOptions() {
      const options = {
        container: this.$refs.mapEl,
        logoControl: false,
        bounds: defaultBounds,
        maxBounds: defaultBounds,
        maxZoom: 17,
        minZoom: 3,
      };
      ["center", "zoom", "pitch", "maxZoom", "minZoom"].forEach((key) => {
        const opt = this[key];
        if (opt !== null && opt !== undefined) {
          options[key] = opt;
        }
      });

      return options;
    },
    watchMapOptions() {
      ["pitch", "maxZoom", "minZoom"].forEach((key) => {
        this.$watch(key, (newVal, oldVal) => {
          const { map } = this;
          if (!map) {
            return;
          }
          const fnName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
          if (!map[fnName]) {
            return;
          }
          map[fnName](newVal);
        });
      });
    },
    fitView() {
      let { map, center, zoom, bounds, fitBoundsOptions } = this;
      if (!map) {
        return;
      }
      fitBoundsOptions = fitBoundsOptions || {};
      if (!fitBoundsOptions.padding) {
        fitBoundsOptions.padding = 40;
      }
      if (center) {
        map.flyTo({
          center,
          zoom,
        });
        return;
      }
      if (bounds) {
        map.fitBounds(bounds, fitBoundsOptions);
      }
    },
    getMap() {
      if (this.map) {
        return Promise.resolve(this.map);
      }
      if (this._initPromise) {
        return this._initPromise.then(() => this.map);
      }
      return Promise.reject("地图未初始化");
    },
    loadMinemapAPI() {
      if (window.minemap) {
        return Promise.resolve();
      }
      if (window.loadMinemapAPIPromise) {
        return window.loadMinemapAPIPromise;
      }
      window.loadMinemapAPIPromise = Promise.all([
        this.loadScript(),
        // this.loadStyle(),
      ])
        .then((r) => {
          console.log("Minemap 资源加载成功", r);
          window.loadMinemapAPIPromise = null;
        })
        .catch((err) => {
          console.error("Minemap 资源加载错误:", err);
          window.loadMinemapAPIPromise = null;
        });
      return window.loadMinemapAPIPromise;
    },
    loadScript() {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.defer = true;
        script.src = "https://minedata.cn/minemapapi/v2.1.0/minemap.js";
        script.onload = () => {
          console.log("Minemap JS加载成功");
          resolve();
        };
        script.onerror = (err) => {
          console.error("Minemap JS加载错误:", err);
          reject();
        };
        document.body.appendChild(script);
      });
    },
    loadStyle() {
      return new Promise((resolve, reject) => {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "https://minedata.cn/minemapapi/v2.1.0/minemap-dark.css";
        link.onload = () => {
          console.log("Minemap CSS加载成功");
          resolve();
        };
        link.onerror = (err) => {
          console.error("Minemap CSS加载错误:", err);
          reject();
        };
        document.querySelector("head").appendChild(link);
      });
    },
  },
  render() {
    const { loaded, $slots } = this;
    return (
      <div class="cm-map">
        <div ref="mapEl" class="cm-map__wrap">
          {!loaded ? (
            <div class="cm-map__loading">Loading...</div>
          ) : (
            $slots.default()
          )}
        </div>
      </div>
    );
  },
});
</script>

<style lang="scss">
@import "./style/map.scss";
.cm-map {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.cm-map__wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.cm-map__loading {
  position: absolute;
  top: 50%;
  left: 50%;
  max-width: 40%;
  font-size: 32px;
  color: #0f2a3f;
  transform: translate(-50%, -50%);
}
.cm-map__loading img {
  width: 100%;
}
</style>
