<template>
  <!-- 养护管理特别处理 -->
  <ul
    v-if="
      menu2?.length > 0 &&
      ($route.name == 'curingManageCopy' || $route.name == 'curingBusinessCopy')
    "
  >
    <li v-for="menuItem in menu2" :key="menuItem.path">
      <router-link
        class="menuItem"
        :to="menuItem.path"
        ondragstart="return false"
      >
        {{ menuItem.title }}
      </router-link>
    </li>
  </ul>
  <!-- 收费系统特别处理 -->
  <!-- <ul v-else-if="menu3?.length > 0 && $route.name == 'chargeCopy'">
    <li v-for="menuItem in menu3" :key="menuItem.path">
      <router-link class="menuItem" :to="menuItem.path" ondragstart="return false">
        {{ menuItem.title }}
      </router-link>
    </li>
  </ul> -->
  <ul v-else>
    <li v-for="menuItem in menu1" :key="menuItem.path">
      <router-link
        class="menuItem"
        :to="menuItem.path"
        ondragstart="return false"
      >
        {{ menuItem.title }}
      </router-link>
    </li>
    <!-- 外部链接 -->
    <li v-for="(item, index) in dataset.menuList" :key="index">
      <router-link
        v-if="item.url"
        class="menuItem"
        :to="item.url"
        ondragstart="return false"
        :target="item.url == '/curingManageyh' ? '_blank' : ''"
      >
        {{ item.name }}
      </router-link>
      <a @click="tonewPath(item.externalLink)" class="menuItem" v-else>{{
        item.name
      }}</a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { routes } from '@/router/index';
import { computed, onBeforeMount, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { generateKey, getMenu } from '@/api/operation';

const dataset = reactive({
  value: '',
  menuList: [],
  oldotherMenu: []
});
onBeforeMount(() => {
  getTokenkey();
  getMenuList();
});

const tonewPath = async (val: any) => {
  await getTokenkey();
  if (val) {
    let concatStr = '&';
    if (val.indexOf('?') === -1) {
      concatStr = '?'
    }
    window.open(`${val}${concatStr}tokenKey=${dataset.value}`);
  }
};
const getMenuList = () => {
  getMenu()
    .then(res => {
      let list = [];
      res.dataList &&
        res.dataList.forEach(item => {
          // if (item.code !== 'LDJSC') {
          //   list.push(item);
          // }
          list.push(item);
        });
      // 生产环境
      dataset.menuList = list;
      // 开发使用 生产环境用上面的
      if (list.length === 0) {
        dataset.menuList = [
          {
            externalLink:
              'http://112.33.17.163:9090/abi/ebibase/showreport.do?resid=EANA$2$2$1$4e0be69902ef4a4686f2df474a4bfd31$bf66eb13234f460a8cfe24baa44a118e&showmenu=false&showparans=false&calcnow=true&id=chongqing_abi&pw=chongqing_abi',
            moduleCode: 'GS',
            name: '高速公路 +',
            url: null
          },
          {
            externalLink: 'http://183.64.175.153:8888/fvue/login',
            hide: 0,
            icon: null,
            id: '1440506777556824065',
            isAdmin: 0,
            moduleCode: 'HY',
            name: '运行监测',
            url: '/operationOverview'
          },
          {
            externalLink: 'http://183.64.175.153:8888/fvue/login',
            hide: 0,
            icon: null,
            id: '1440506777556824065',
            isAdmin: 0,
            moduleCode: 'HY',
            name: '养护系统',
            url: '/curingManageyh'
          },
          {
            externalLink: 'http://183.64.175.153:8888/fvue/login',
            hide: 0,
            icon: null,
            id: '1440506777556824065',
            isAdmin: 0,
            moduleCode: 'HY',
            name: '收费系统',
            url: '/charge'
          }
        ];
      }
    })
    .catch(() => {});
};
const getTokenkey = () => {
  generateKey().then(res => {
    dataset.value = res.data;
  });
};

const menu1 = computed(() => {
  const root = routes.find(e => e.path === '/');
  let newroute = [];
  if (root && root.children.length > 0) {
    root.children.forEach(ele => {
      if (ele.name === 'business' || ele.name === 'videoSurveillance') {
        newroute.push(ele);
      }
    });
  }
  // newroute = [
  //   { name: 'business', path: '/business', title: '业务概况', meta: { code: 'LDJSC' } },
  //   { name: 'operationOverview', path: '/operationOverview', title: '运行监测', meta: { code: 'LDJSC' } },
  //   { name: 'videoSurveillance', path: '/videoSurveillance', title: '视频监控', meta: { code: 'LDJSC' } },
  //   { name: 'curingManageCopy', path: '/curingManageyh', title: '养护管理', meta: { code: 'HY' } },
  //   { name: 'chargeCopy', path: '/charge', title: '收费系统', meta: { code: 'SF' } }
  // ];
  // return root ? root.children : [];

  return newroute;
});
//  养护
const menu2 = computed(() => {
  const root = routes.find(e => e.path === '/');
  let newroute = [];
  if (root && root.children.length > 0) {
    root.children.forEach(ele => {
      if (ele.name == 'curingManageCopy' || ele.name == 'curingBusinessCopy') {
        newroute.push(ele);
      }
    });
  }
  return newroute;
});
// // 收费
// const menu3 = computed(() => {
//   const root = routes.find(e => e.path === '/');
//   let newroute = [];
//   if (root && root.children.length > 0) {
//     root.children.forEach(ele => {
//       if (ele.name == 'chargeCopy') {
//         newroute.push(ele);
//       }
//     });
//   }
//   return newroute;
// });
const route = useRoute();
</script>

<style lang="postcss" scoped>
ul {
  @apply flex relative h-full items-end mx-auto;
}

li {
  @apply relative z-10 h-full;
}

.menuItem {
  font-weight: 600;
  font-size: 16px;
  line-height: 45px;

  white-space: nowrap;
  text-shadow: 2px 2px 2px #000;

  @apply px-8 h-full flex justify-center text-gray-300;
}

.router-link-active {
  color: #ffce5a;
  border-bottom: 4px solid rgb(var(--active));
  background: linear-gradient(transparent, rgba(236, 166, 56, 0.6));
  /* color: rgb(var(--active)); */
}

.stressLine {
  border-color: rgb(var(--active));
  background: rgba(0, 0, 0, 0.3);

  @apply absolute z-0 h-full left-0 w-32 transition-all border-b-4 duration-300;
}
.sfli {
  width: 250px;
}
</style>
