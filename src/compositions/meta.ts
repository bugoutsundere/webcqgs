import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch } from 'vue'

export function useFetchMeta(name: string): any {
  const store = useStore(key)
  const meta = computed(() => store.state.meta)

  const { data } = useRequest<any>(
    () => genConfig(`/http-server-kpi/publish/jsc/panelMemo?pgType=${name}`)
    // {
    //   ready: computed(() => !meta.value.hasOwnProperty(name)),
    //   cacheKey: `${name}-meta`,
    //   staleTime: 3600000, // 60 minutes
    // }
  )

  const fetchedMeta = computed(() => {
    if (meta.value.hasOwnProperty(name)) {
      return meta.value[name]
    }
    const list = data.value?.msgContent
    const arr: any = {}
    if (list?.length > 0) {
      list.forEach(({ panelCode, desc1 }: any) => {
        arr[panelCode] = desc1
      })
      return arr
    }
    return null
  })

  watch(
    fetchedMeta,
    () => {
      if (fetchedMeta.value && !meta.value.hasOwnProperty(name)) {
        store.commit('saveMeta', {
          page: name,
          meta: fetchedMeta.value,
        })
      }
    },
    { immediate: true }
  )
  return { fetchedMeta }
}
