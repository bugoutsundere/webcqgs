<script lang="jsx">
import { point, featureCollection } from '@turf/turf'
import GeoJsonSource from '../GeoJsonSource/index.vue'
import Layer from './index.vue'
import {
  eventLayerLayout,
  eventLayerPaint,
  eventLayerFilter,
  eventClusterLayerLayout,
  eventClusterLayerPaint,
  eventClusterLayerFilter,
} from '../config'
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    sourceId: {
      type: String,
      default: 'event',
    },
    layerId: {
      type: String,
      default: 'event',
    },
    clusterLayerId: {
      type: String,
      default: 'eventCluster',
    },
    cluster: {
      type: Boolean,
      default: true,
    },
    clusterRadius: {
      type: Number,
      default: 20,
    },
    clusterMaxZoom: {
      type: Number,
      default: 12,
    },
    clusterProperties: {
      type: Object,
      default: () => ({
        maxStake: ['max', ['get', 'stake']],
        minStake: ['min', ['get', 'stake']],
      }),
    },
    layerLayout: {
      type: Object,
      default: () => eventLayerLayout,
    },
    layerPaint: {
      type: Object,
      default: () => eventLayerPaint,
    },
    layerFilter: {
      type: Array,
      default: () => eventLayerFilter,
    },
    clusterLayerLayout: {
      type: Object,
      default: () => eventClusterLayerLayout,
    },
    clusterLayerPaint: {
      type: Object,
      default: () => eventClusterLayerPaint,
    },
    clusterLayerFilter: {
      type: Array,
      default: () => eventClusterLayerFilter,
    },
  },
  computed: {
    sourceData() {
      const { data } = this
      if (!data || data.length < 1) {
        return null
      }
      const features = []
      data.forEach(item => {
        features.push(
          point([item.lng, item.lat], {
            ...item,
          })
        )
      })
      return featureCollection(features)
    },
  },
  render() {
    const {
      sourceId,
      layerId,
      clusterLayerId,
      sourceData,
      cluster,
      clusterRadius,
      clusterMaxZoom,
      clusterProperties,
      layerLayout,
      layerPaint,
      layerFilter,
      clusterLayerLayout,
      clusterLayerPaint,
      clusterLayerFilter,
    } = this
    if (!sourceData) {
      return null
    }
      
    return (
      <GeoJsonSource
        id={sourceId}
        data={sourceData}
        cluster={cluster}
        clusterRadius={clusterRadius}
        clusterMaxZoom={clusterMaxZoom}
        clusterProperties={clusterProperties}
      >
        <Layer
          id={clusterLayerId}
          sourceId={sourceId}
          layout={clusterLayerLayout}
          paint={clusterLayerPaint}
          filter={clusterLayerFilter}
        />
        <Layer
          id={layerId}
          sourceId={sourceId}
          layout={layerLayout}
          paint={layerPaint}
          filter={layerFilter}
        />
      </GeoJsonSource>
    )
  }
}
</script>
