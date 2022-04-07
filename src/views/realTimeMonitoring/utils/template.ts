import { createApp } from 'vue'
import com from '../components/window/com.vue'
import camaras from '../components/window/camaras.vue'

const getTemplateFromComponent = (
  pointConfig: any,
  pointInfo: any,
  comp: any
) => {
  // console.log(pointConfig, pointInfo, comp)
  return createApp({
    extends: com,
    data() {
      return {
        info: pointInfo,
      }
    },
  })
}

export const ComWindowTemplate = (pointConfig: any, pointInfo: any) => {
  return getTemplateFromComponent(pointConfig, pointInfo, com)
}

export const cameraInfoWindowTemplate = (pointConfig: any, pointInfo: any) => {
  return getTemplateFromComponent(pointConfig, pointInfo, camaras)
}
