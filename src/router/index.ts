import { createWebHashHistory, createRouter } from 'vue-router'

export const routes = [
  {
    path: '/',
    component: () => import('@/layout/default.vue'),
    redirect: '/business',
    children: [
      {
        name: 'business',
        path: '/business',
        title: '业务概况',
        meta: {
          code: 'LDJSC'
        },
        component: () => import('@/views/bussinessCopy/index.vue'),
      },
      {
        name: 'operationOverview',
        path: '/operationOverview',
        title: '运行监测',
        meta: {
          code: 'LDJSC'
        },
        component: () => import('@/views/roadVisualizationCopy/index.vue')
      },
      {
        name: 'videoSurveillance',
        path: '/videoSurveillance',
        title: '视频监控',
        meta: {
          code: 'LDJSC'
        },
        component: () => import('@/views/videoSurveillance/index.vue'),
      },
      {
        name: 'curingManageCopy',
        path: '/curingManageyh',
        title: '养护管理',
        meta: {
          code: 'HY'
        },
        component: () => import('@/views/curingManage/index.vue'),
      },
      // 养护管理业务概况
      {
        name: 'curingBusinessCopy',
        path: '/curingBusinessyh',
        title: '业务概况',
        meta: {
          code: 'HY'
        },
        component: () => import('@/views/curingBussiness/index.vue'),
      },
      {
        name: 'chargeCopy',
        path: '/charge',
        title: '收费系统',
        meta: {
          code: 'SF'
        },
        component: () => import('@/views/charge/index.vue'),
      },
      {
        name: 'bussiness',
        path: '/bussiness',
        title: '业务概况',
        meta: {
          code: 'LDJSC'
        },
        component: () => import('@/views/bussiness/index.vue'),
      }
    ],
    // children: [
    //   {
    //     name: 'bussiness',
    //     path: '/bussiness',
    //     title: '业务概况',
    //     meta: {
    //       code: 'LDJSC'
    //     },
    //     component: () => import('@/views/bussiness/index.vue'),
    //   },
    //   {
    //     name: 'operationOverview',
    //     path: '/operationOverview',
    //     title: '运行监测',
    //     meta: {
    //       code: 'LDJSC'
    //     },
    //     component: () => import('@/views/roadVisualization/index.vue')
    //   },
    //   {
    //     name: 'bussinessCopy',
    //     path: '/bussiness-new',
    //     title: '业务概况',
    //     meta: {
    //       code: 'LDJSC'
    //     },
    //     component: () => import('@/views/bussinessCopy/index.vue'),
    //   },
    //   {
    //     name: 'operationOverviewCopy',
    //     path: '/operationOverview-new',
    //     title: '运行监测',
    //     meta: {
    //       code: 'LDJSC'
    //     },
    //     component: () => import('@/views/roadVisualizationCopy/index.vue')
    //   },
    //   {
    //     name: 'videoSurveillanceCopy',
    //     path: '/videoSurveillance-new',
    //     title: '视频监控',
    //     meta: {
    //       code: 'LDJSC'
    //     },
    //     component: () => import('@/views/videoSurveillance/index.vue'),
    //   },
    //   {
    //     name: 'curingManageCopy',
    //     path: '/curingManageyh',
    //     title: '养护管理',
    //     meta: {
    //       code: 'HY'
    //     },
    //     component: () => import('@/views/curingManage/index.vue'),
    //   },
    //   // 养护管理业务概况
    //   {
    //     name: 'curingBussinessCopy',
    //     path: '/curingBussinessyh',
    //     title: '业务概况',
    //     meta: {
    //       code: 'HY'
    //     },
    //     component: () => import('@/views/curingBussiness/index.vue'),
    //   },
    //   {
    //     name: 'chargeCopy',
    //     path: '/charge',
    //     title: '收费系统',
    //     meta: {
    //       code: 'SF'
    //     },
    //     component: () => import('@/views/charge/index.vue'),
    //   },
    //   // {
    //   //   name: 'operation',
    //   //   path: '/operation',
    //   //   title: '运营概况',
    //   //   component: () => import('@/views/operation/index.vue'),
    //   // },
    //   // {
    //   //   name: 'management',
    //   //   path: '/management',
    //   //   title: '经营概况',
    //   //   component: () => import('@/views/management/index.vue'),
    //   // },
    //   // {
    //   //   name: 'warning',
    //   //   path: '/warning',
    //   //   title: '预警信息',
    //   //   component: () => import('@/views/warning/index.vue'),
    //   // },
    //   // {
    //   //   name: 'realTimeMonitoring',
    //   //   path: '/realTimeMonitoring',
    //   //   title: '营运现场',
    //   //   component: () => import('@/views/realTimeMonitoring/index.vue'),
    //   // },
    //   // {
    //   //   name: 'chargeInfo',
    //   //   path: '/chargeInfo',
    //   //   title: '收费概况',
    //   //   component: () => import('@/views/ChargeInfo/index.vue'),
    //   // },
    // ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  },
  routes,
})

export default router
