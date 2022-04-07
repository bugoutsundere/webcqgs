<script lang="jsx">
import { formatStake } from "@/utils/road";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  render() {
    const { data } = this;
    if (!data) {
      return null;
    }
    const { name, stakemark, sectionnam } = data;
    return (
      <div>
        <div class="title">{name}</div>
        <div class="content">
          <span>{formatStake(stakemark)}</span>
          <div>
            <span>位置：{ sectionnam }</span>
          </div>
        </div>
      </div>
    );
  },
};
</script>
