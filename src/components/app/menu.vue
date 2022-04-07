<template>
  <!-- <div> -->
  <!-- <div v-if="$route.path.substring($route.path.length - 3) == 'new'"></div>
  <div v-else></div>
</div> -->
  <ul
    v-if="
      menu2?.length > 0 &&
      ($route.name == 'curingManageCopy' ||
        $route.name == 'curingBussinessCopy')
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
  <ul v-else-if="menu3?.length > 0 && $route.name == 'chargeCopy'">
    <li v-for="menuItem in menu3" :key="menuItem.path">
      <router-link
        class="menuItem"
        :to="menuItem.path"
        ondragstart="return false"
      >
        {{ menuItem.title }}
      </router-link>
    </li>
  </ul>
  <ul
    v-else-if="
      menu1?.length > 0 &&
      $route.path.substring($route.path.length - 3) == 'new'
    "
  >
    <li v-for="menuItem in menu1" :key="menuItem.path">
      <router-link
        class="menuItem"
        :to="menuItem.path"
        ondragstart="return false"
        :target="menuItem.name == 'curingManageCopy' ? '_blank' : ''"
      >
        {{ menuItem.title }}
      </router-link>
    </li>
  </ul>
  <ul v-else>
    <li v-for="menuItem in menu" :key="menuItem.path">
      <router-link
        class="menuItem"
        :to="menuItem.path"
        ondragstart="return false"
      >
        {{ menuItem.title }}
      </router-link>
    </li>
    <li v-for="(item, index) in dataset.menuList" :key="index">
      <a
        @click="tonewPath(item.externalLink)"
        class="menuItem"
        >{{ item.name }}</a
      >
    </li>
    <!-- <div class="stressLine" :style="stressLineStyle"></div> -->
  </ul>
</template>

<script lang="ts" setup>
import { routes } from "@/router/index";
import { computed, onBeforeMount, reactive } from "vue";
import { useRoute } from "vue-router";
import { generateKey, getMenu } from "@/api/operation";

const dataset = reactive({
  value: "",
  menuList: [],
  oldotherMenu: [],
});
onBeforeMount(() => {
  getTokenkey();
  getMenuList();
});

const tonewPath = async (val: any) => {
  await getTokenkey();
  if (val) {
    window.open(val + "?tokenKey=" + dataset.value);
  }
};
const getMenuList = () => {
  getMenu().then((res) => {
    let list = [];
    res.dataList &&
      res.dataList.forEach((item) => {
        if (item.code !== "LDJSC") {
          list.push(item);
        }
      });
    dataset.menuList = list;
  });
};
const getTokenkey = () => {
  generateKey().then((res) => {
    dataset.value = res.data;
  });
};
const menu = computed(() => {
  const root = routes.find((e) => e.path === "/");
  let newroute = [];
  if (root && root.children.length > 0) {
    root.children.forEach((ele) => {
      if (ele.name.substring(ele.name.length - 4) !== "Copy") {
        newroute.push(ele);
      }
    });
  }
  // return root ? root.children : [];
  return newroute;
});

const menu1 = computed(() => {
  const root = routes.find((e) => e.path === "/");
  let newroute = [];
  if (root && root.children.length > 0) {
    root.children.forEach((ele) => {
      if (
        ele.name.substring(ele.name.length - 4) == "Copy" &&
        ele.name != "curingBussinessCopy"
      ) {
        newroute.push(ele);
      }
    });
  }
  // return root ? root.children : [];
  return newroute;
});
//  养护
const menu2 = computed(() => {
  const root = routes.find((e) => e.path === "/");
  let newroute = [];
  if (root && root.children.length > 0) {
    root.children.forEach((ele) => {
      if (ele.name == "curingManageCopy" || ele.name == "curingBussinessCopy") {
        newroute.push(ele);
      }
    });
  }
  // return root ? root.children : [];
  return newroute;
});
// 收费
const menu3 = computed(() => {
  const root = routes.find((e) => e.path === "/");
  let newroute = [];
  if (root && root.children.length > 0) {
    root.children.forEach((ele) => {
      if (ele.name == "chargeCopy") {
        newroute.push(ele);
      }
    });
  }
  // return root ? root.children : [];
  return newroute;
});
const route = useRoute();

const stressLineStyle = computed(() => {
  const activeRouteIndex = menu.value.map((e) => e.path)?.indexOf(route.path);
  return {
    transform: `translateX( ${activeRouteIndex * 100}%)`,
  };
});
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

  @apply px-8 h-full flex justify-center transition-all duration-500 text-gray-300;
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
