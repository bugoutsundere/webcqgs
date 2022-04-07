<template>
  <div class="baseinfo-box z-50">
    <div class="basinfo-row">
      <Module
        title="投资经营里程"
        class="w-1/2"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['tzjy']"
      >
        <span class="value">
          <!-- {{ arr ? formatThousand(arr.tzjylc || 0) : '-' }} -->
          {{ formatThousand(3247) }}
        </span>
        <span class="unit">公里</span>
      </Module>
      <Module
        title="运营里程"
        class="w-1/2"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['jylc']"
      >
        <span class="value">
          <!-- {{ arr ? formatThousand(arr.jygllc || 0) : '-' }} -->
          {{ formatThousand(385) }}
        </span>
        <span class="unit">公里</span>
      </Module>
    </div>
    <div class="basinfo-row">
      <Module
        title="投资经营省市"
        class="w-1/4"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['tzss']"
      >
        <span class="value">
          <!-- {{ arr ? formatThousand(arr.tzjyss || 0) : '-' }} -->
          5
        </span>
        <span class="unit">个</span>
      </Module>
      <Module
        title="运营项目省市"
        class="w-1/4"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['glss']"
      >
        <span class="value">
          <!-- {{ arr ? arr.glxmss || 0 : '-' }} -->
          2
          </span>
        <span class="unit">个</span>
      </Module>
      <Module
        title="管理项目"
        class="w-1/4"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['gkxm']"
      >
        <span class="value">
          <!-- {{ arr ? arr.gkxm || 0 : '-' }} -->
          35
        </span>
        <span class="unit">个</span>
      </Module>
      <Module
        title="运营路段"
        class="w-1/4"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['gkld']"
      >
        <span class="value">
          <!-- {{ arr ? arr.gkld || 0 : '-' }} -->
          7
        </span>
        <span class="unit">条</span>
      </Module>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import { computed, defineProps, ref } from 'vue'
import { formatThousand } from '@/utils/util'

import { useStore } from 'vuex'
import { key } from '@/store'

defineProps({
  info: {
    type: String,
    default: '',
  },
})

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig('/http-server-kpi/publish/jsc/baseInfo')
)

const arr = computed(() => data.value?.msgContent[0])

const store = useStore(key)

const bsMeta = computed(() => store.getters.bsMeta)
</script>

<style lang="postcss" scoped>
.baseinfo-box {
  top: 4px;
  left: 4px;
  width: 600px;

  @apply flex flex-col absolute;
}

.basinfo-row {
  height: 80px;

  @apply flex;
}

.value {
  letter-spacing: 2px;
  font-size: 22px;
}

.unit {
  margin-right: -1rem;
  margin-left: 6px;
  margin-top: 2px;
}
</style>
