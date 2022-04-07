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
    const { gantry_nam, gantry_mpo } = data;
    return (
      <div>
        <div class="title">{gantry_nam}</div>
        <div class="content">
          <span>{formatStake(gantry_mpo)}</span>
        </div>
      </div>
    );
  },
};
</script>
