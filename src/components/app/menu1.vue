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
        :target="
          menuItem.name == 'curingManageCopy' || menuItem.name == 'chargeCopy'
            ? '_blank'
            : ''
        "
      >
        {{ menuItem.title }}
      </router-link>
    </li>
    <!-- <div class="stressLine" :style="stressLineStyle"></div> -->
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
    <li v-for="(item, index) in dataset.oldotherMenu" :key="index">
      <a
        @click="tonewPath(item.externalLink)"
        class="menuItem"
        :class="item.code == 'SF' ? 'sfli' : ''"
        >{{ item.name }}</a
      >
    </li>
    <!-- <li>
      <a
        @click="tonewPath('http://183.64.175.153:6005/platform4.html')"
        class="menuItem"
        >收费系统</a
      >
    </li>
    <li>
      <a
        @click="tonewPath('http://183.64.175.153:8888/fvue/login')"
        class="menuItem"
        >养护系统</a
      >
    </li>
    <li>
      <a class="menuItem" style="width: 200px">高速公路+（建设中）</a>
    </li> -->
    <div class="stressLine" :style="stressLineStyle"></div>
  </ul>
</template>

<script lang="ts" setup>
import { routes } from "@/router/index";
import { computed, onMounted, reactive, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { generateKey, getMenu } from "@/api/operation";

onBeforeMount(() => {
  getTokenkey();
  getMenuList();
});
const dataset = reactive({
  value: "",
  menuList: [
    {
      id: "1440508084007022594",
      code: "JD",
      name: "机电系统",
      parentId: null,
      icon: null,
      scope: 1,
      sort: 1,
      type: 1,
      url: null,
      externalLink: "http://36.110.47.222:28891/",
      redirect: null,
      hide: 0,
      moduleCode: "JD",
      remark: null,
      children: null,
      permissionList: null,
      isAdmin: null,
    },
    {
      id: "1440516354075602946",
      code: "LDJSC",
      name: "运行监测",
      parentId: null,
      icon: null,
      scope: 1,
      sort: 1,
      type: 1,
      url: null,
      externalLink: "http://36.110.103.178:10001/",
      redirect: null,
      hide: 0,
      moduleCode: "LDJSC",
      remark: null,
      children: null,
      permissionList: null,
      isAdmin: null,
    },
    {
      id: "1440508244535619585",
      code: "SF",
      name: "收费系统（建设中，不可点击）",
      parentId: null,
      icon: null,
      scope: 1,
      sort: 1,
      type: 1,
      url: "",
      externalLink: "http://183.64.175.153:6005/platform.html",
      redirect: null,
      hide: 0,
      moduleCode: "SF",
      remark: null,
      children: null,
      permissionList: null,
      isAdmin: null,
    },
    {
      id: "1440506777556824065",
      code: "HY",
      name: "养护系统",
      parentId: null,
      icon: null,
      scope: 1,
      sort: 1,
      type: 1,
      url: null,
      externalLink: "http://119.3.200.177:",
    },
  ],
  oldotherMenu: [],
});
const menuCode = computed(() => {
  let codeList = [];
  let oldotherMenu = [];
  dataset.menuList.forEach((item) => {
    codeList.push(item.code);
    if (item.code !== "LDJSC") {
      oldotherMenu.push(item);
    }
  });
  dataset.oldotherMenu = oldotherMenu;
  return codeList;
});
// 老路由
const menu = computed(() => {
  const root = routes.find((e) => e.path === "/");
  let newroute = [];
  let oldotherMenu = [];
  dataset.menuList.forEach((item) => {
    if (root && root.children.length > 0) {
      root.children.forEach((ele) => {
        if (
          ele.name.substring(ele.name.length - 4) !== "Copy" &&
          ele.meta.code == item.code
        ) {
          newroute.push(ele);
        }
      });
    }
    if (item.code !== "LDJSC") {
      oldotherMenu.push(item);
    }
  });
  dataset.oldotherMenu = oldotherMenu;
  return newroute;
});

// 新路由
const menu1 = computed(() => {
  const root = routes.find((e) => e.path === "/");
  let newroute = [];
  dataset.menuList.forEach((item) => {
    if (root && root.children.length > 0) {
      root.children.forEach((ele) => {
        if (
          ele.name.substring(ele.name.length - 4) == "Copy" &&
          ele.name !== "curingBussinessCopy" &&
          ele.meta.code == item.code
        ) {
          newroute.push(ele);
        }
      });
    }
  });
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

const tonewPath = async (val: any) => {
  await getTokenkey();
  if (val) {
    window.open(val + "?tokenKey=" + dataset.value);
  }
};
const getTokenkey = () => {
  generateKey().then((res) => {
    dataset.value = res.data;
  });
};
const getMenuList = () => {
  getMenu().then((res) => {
    dataset.menuList = res.dataList;
  });
};
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
  line-height: 16px;
  white-space: nowrap;
  text-shadow: 2px 2px 2px #000;

  @apply w-32 h-full flex items-center justify-center transition-all duration-500 text-gray-300;
}

.router-link-active {
  color: #ffce5a;
  border-bottom: 2px solid #fff;
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
