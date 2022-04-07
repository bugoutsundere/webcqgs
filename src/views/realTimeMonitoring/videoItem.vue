<template>
  <div class="w-full h-full">
    <video
      controls
      v-if="url"
      controlslist="nodownload"
      ref="video"
      muted
      autoplay
      disablePictureInPicture
      oncontextmenu="return false"
    />
    <div v-else class="info" :class="{ empty: !loading }">
      <Loading v-if="loading" />
      <div v-else class="empty">
        <svg-icon name="noVideo"></svg-icon>
        <span class="e_label">暂无视频</span>
      </div>
    </div>
    <div class="label" v-if="url && label">{{ label }}</div>
  </div>
</template>

<script>
import {
  defineProps,
  ref,
  nextTick,
  computed,
  watch,
  onUnmounted,
  toRefs,
} from 'vue'
import flvjs from 'flv.js'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { id } = toRefs(props)
    const baseUrl = 'http://61.141.223.147:41001'

    const { data, loading: urlLoading } = useRequest(() =>
      genConfig(`${baseUrl}/video/getVideoUrl?deviceCode=${id.value}`)
    )

    const { run } = useRequest(
      () => genConfig(`${baseUrl}/video/stopVideo?deviceCode=${id.value}`),
      {
        manual: true,
      }
    )

    const url = computed(() => data.value?.datas?.flv)
    const label = computed(() => data.value?.datas?.deviceAlias || '')
    const loading = computed(() => urlLoading.value)

    const video = ref(null)

    let flvPlayer = null
    // console.log(flvjs)

    watch(
      () => url.value,
      async () => {
        await nextTick()
        if (!(url.value && video.value)) {
          return
        }
        flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: url.value,
        })

        flvPlayer.attachMediaElement(video.value)
        await nextTick()
        await flvPlayer.load()
        flvPlayer.play()
      }
    )

    onUnmounted(() => {
      flvPlayer && flvPlayer.destroy()
      run()
    })
    return {
      loading,
      url,
      label,
      video,
    }
  },
}
</script>

<style lang="postcss" scoped>
.info {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &.empty {
    border: 1px solid rgba(153, 32, 2, 0.4);
    background: rgba(245, 74, 74, 0.1);
  }
  & .empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-shadow: none;

    & .svg-icon {
      font-size: 36px;
      color: rgba(184, 184, 184, 0.4);
      margin-bottom: 10px;
    }
    & .e_label {
      color: rgba(184, 184, 184, 0.4);
    }
  }
}

video {
  position: absolute;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
  border-radius: 2px;
  border: 1px solid rgb(2, 123, 153);
  overflow: hidden;
  outline: none;
}
video::-webkit-media-controls-mute-button {
  display: none;
}
video::-webkit-media-controls-volume-slider {
  display: none;
}
video::-webkit-media-controls-play-button {
  display: none;
}
video::-webkit-media-controls-timeline {
  display: none;
}
video::-webkit-media-controls-current-time-display {
  display: none;
}
video::-webkit-media-controls-time-remaining-display {
  display: none;
}
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}

.label {
  position: absolute;
  z-index: 1001;
  top: 0;
  left: 0;
  right: 0;
  padding: 3px 6px;
  font-size: 12px;
  background: linear-gradient(
    to right,
    rgba(3, 128, 185, 0.986),
    rgba(8, 120, 211, 0.068)
  );
  border-bottom: 1px dashed rgba(2, 123, 153, 0.5);
  border-radius: 2px 2px 0 0;
}
</style>
