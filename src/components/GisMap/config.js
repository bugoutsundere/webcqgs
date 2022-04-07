/*
 * 事件图层默认配置
 */
export const eventLayerLayout = {
  visibility: 'visible',
  'icon-image': 'event_type_{eventOneType}_{status}',
  'icon-offset': [0, -26],
  'icon-allow-overlap': true, //表示图标被其他图层盖住依然展示
  'text-allow-overlap': true, //表示文本被其他图层盖住依然展示
}
export const eventLayerPaint = null
export const eventLayerFilter = ['!has', 'cluster']

/*
 * 事件聚合图层默认配置
 */
export const eventClusterLayerLayout = {
  visibility: 'visible',
  'icon-image': 'point_cluster_blue',
  'icon-allow-overlap': true,
  'text-allow-overlap': true,
  'text-field': '{point_count}',
  'text-anchor': 'center',
  'text-size': ['case', ['<', ['get', 'point_count'], 10], 20, 16],
}
export const eventClusterLayerPaint = {
  'text-color': '#fff',
}
export const eventClusterLayerFilter = ['has', 'cluster']