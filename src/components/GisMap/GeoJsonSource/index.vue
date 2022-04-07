<template>
  <div v-if="loaded">
    <slot />
  </div>
</template>
<script lang="jsx">
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    data: {
      type: [Object, String],
      required: true,
    },
    cluster: {
      type: Boolean,
      default: false,
    },
    clusterRadius: {
      type: Number,
      default: 50,
    },
    clusterMaxZoom: {
      type: Number,
      default: 15,
    },
    clusterProperties: {
      type: Object,
      default: null,
    },
  },
  inject: ['getMap'],
  provide() {
    return { sourceId: this.id }
  },
  data() {
    return {
      loaded: false,
    }
  },
  computed: {
    watchProps() {
      return [
        this.cluster,
        this.clusterRadius,
        this.clusterMaxZoom,
        this.clusterProperties,
      ]
    },
  },
  watch: {
    data: {
      handler() {
        this.updateData()
      },
    },
    watchProps: {
      handler(newVal, oldVal) {
        this.removeSource()
        this.addSource()
      },
    },
  },
  mounted() {
    this.addSource()
  },
  destroyed() {
    this.removeSource()
  },
  methods: {
    addSource() {
      console.log('addSource')
      this.getMap().then(map => {
        this.map = map
        const {
          id,
          data,
          cluster,
          clusterRadius,
          clusterMaxZoom,
          clusterProperties,
        } = this
        if (map.getSource(id)) {
          const msg = `id为${id}的source已存在`
          console.error(msg)
          this.$emit('error', { id, data, message: msg })
          return
        }
        map.addSource(id, {
          type: 'geojson',
          data,
          cluster,
          clusterRadius,
          clusterMaxZoom,
          clusterProperties,
        })
        this.loaded = true
        this.$emit('load', { id, data })
      })
    },
    updateData() {
      console.log('updateSource')
      const { map, id, data } = this
      if (!map) {
        return
      }
      const source = map.getSource(id)
      if (source) {
        source.setData(data)
      } else {
        this.addSource()
      }
    },
    removeSource() {
      const { map, id, data } = this
      if (!map) {
        return
      }
      const source = map.getSource(id)
      if (source) {
        map.removeSource(id)
        this.$emit('remove', { id, data })
      }
    },
  },
  // render() {
  //   const { loaded, $slots } = this
  //   const children = $slots.default
  //   if (children && loaded) {
  //     return <template>{children}</template>
  //   }
  //   return null
  // },
}
  
</script>