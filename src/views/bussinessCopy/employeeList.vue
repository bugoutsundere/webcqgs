<template>
  <Module
    class="h-1/3"
    :info="bsMeta && bsMeta['emplRate']"
    :loading="loading"
    :error="error"
  >
    <template #title>公司人员占比</template>
    <!-- <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="options" v-model="latest" />
    </template> -->
    <template v-if="!loading">
      <processBar :processValue="processValue"></processBar>
      <!-- <Ect :options="ectOpts" v-if="activeCom === 'list' && dataList?.length > 0" />
      <Ect :options="comEctOpts" v-else-if="activeCom !== 'list' && comData?.length > 0" />
      <Empty v-else /> -->
    </template>
  </Module>
</template>
<script lang="jsx">
import processBar from "./processBar.vue";
import { staffCountTmp } from "@/api/businessOverview";
export default {
  components: {
    processBar,
  },
  data() {
    return {
      ectOpts: {},
      error: "",
      loading: false,
      options: [
        { name: "最新", value: true },
        // { name: "月", value: false },
      ],
      latest: true,
      processValue: [
        {
          name: '潼荣高速',
          total: 807,
          types : [
            {
          name: "1",
          data: 500,
        },
        {
          name: "2",
          data: 100,
        },
        {
          name: "3",
          data: 100,
        },
        {
          name: "4",
          data: 492,
        }
          ]
        },
        {
          name: '新建公司',
          total: 723,
          types : [
            {
          name: "1",
          data: 400,
        },
        {
          name: "2",
          data: 100,
        },
        {
          name: "3",
          data: 123,
        },
        {
          name: "4",
          data: 100,
        }
          ]
        },
        {
          name: '新建公司',
          total: 723,
          types : [
            {
          name: "1",
          data: 400,
        },
        {
          name: "2",
          data: 100,
        },
        {
          name: "3",
          data: 123,
        },
        {
          name: "4",
          data: 100,
        }
          ]
        },
        {
          name: '新建公司',
          total: 723,
          types : [
            {
          name: "1",
          data: 400,
        },
        {
          name: "2",
          data: 100,
        },
        {
          name: "3",
          data: 123,
        },
        {
          name: "4",
          data: 100,
        }
          ]
        },
        {
          name: '新建公司',
          total: 723,
          types : [
            {
          name: "1",
          data: 400,
        },
        {
          name: "2",
          data: 100,
        },
        {
          name: "3",
          data: 123,
        },
        {
          name: "4",
          data: 100,
        }
          ]
        }
      ],
    };
  },
  mounted() {
    // console.log('人员占比哈哈哈哈');
    this.getData();
  },
  methods: {
    async getData() {
      const res = await staffCountTmp();
      const data = res.msgContent;
      this.processValue = [];
      data.map(item=>{
        const obj = {
          name: item.sectionName,
          total: item.roadStaff+item.serviceareaStaff+item.clearStaff+item.otherStaff,
          types : [
            {
              name: "公路业务",
              data: item.roadStaff,
            },
            {
              name: "服务区",
              data: item.serviceareaStaff,
            },
            {
              name: "清障",
              data: item.clearStaff,
            },
            {
              name: "其他",
              data: item.otherStaff,
            },
          ]
        }
        this.processValue.push(obj);
      })
    },
  },
};
</script>




