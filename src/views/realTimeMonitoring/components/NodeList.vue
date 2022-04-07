
  
  <template>
  <div class="timeline">
    <div class="labelLine">
      <div
        class="timeItem"
        :class="{ finish: item.status === 1 }"
        v-for="item in list"
        :key="item.id"
      >
        <div>{{ item.name }}</div>
      </div>
    </div>

    <div class="timeBar">
      <div
        class="time"
        :class="{ finish: item.status === 1 }"
        :style="`animation-delay: ${index * 500}ms;`"
        v-for="(item, index) in list"
        :key="index"
      ></div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { computed, defineProps } from 'vue'


const props = defineProps({
  data: {
    type: Array,
    default: null,
  },
})

const list = computed(() => props.data as Array<any>)
</script>

  <style lang="postcss" scoped>
.timeline {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  right: 10px;
  bottom: 0;
}
.labelLine {
  width: 100%;
  display: flex;
  justify-content: center;
}
.timeItem {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  &.finish {
    color: turquoise;
  }
}

.timeBar {
  margin-top: 8px;
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #000;
  display: flex;
  border-radius: 2px;
  & .time {
    height: 100%;
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 1px;
    border: 1px solid transparent;
    &.finish {
      background: rgb(33, 187, 172);
      border: 1px solid rgb(117, 255, 241);
      animation-iteration-count: infinite;
      animation-name: timeAni;
      animation-timing-function: ease-in-out;
      animation-duration: 2s;
    }
  }
}
</style>
  