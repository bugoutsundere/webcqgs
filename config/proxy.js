const arrCommonProxyPath = [
  "^/boot-authorization/auth",
  "^/http-server-yonyu",
  "^/http-server-kpi",
  "^/http-server-yygl",
  "^/http-server-yhgl",
  '^/http-server-charge-management/publish',
  '^/http-server-charge-management/redis',
  '^/sys',
  '^/user',
  '^/external'
];

export default env => {
  const { VITE_SERVICE_BASE, VITE_IOT_BASE, VITE_APP_URI_OPERATION, VITE_SERVICE_BASE_NEW } = env;

  const proxyTable = {
    '^/http-server-charge-management/wsocket': {
      target: VITE_SERVICE_BASE,
      changeOrigin: true,
      ws: true
    },
    '^/manage': {
      target: VITE_IOT_BASE,
      secure: false,
      changeOrigin: true
    },
    '^/video': {
      target: VITE_IOT_BASE,
      secure: false,
      changeOrigin: true
    },
    // 消息服务的推送转发
    '^/wsmsg': {
      target: VITE_SERVICE_BASE,
      secure: false,
      changeOrigin: true,
      ws: true,
      // 实际地址没有这个wsmsg前缀
      pathRewrite: {
        '^/wsmsg': ''
      },
      // 解决ws代理断开后会导致dev server down掉的问题
      onProxyReqWs(proxyReq, req, socket, options, head) {
        socket.on('error', err => {
          console.error(err);
        });
      }
    },
    '^/user': {
      target: VITE_APP_URI_OPERATION,
      secure: false,
      changeOrigin: true
    },
    '^/http-server-base': {
      // target: VITE_IOT_BASE,
      target: VITE_SERVICE_BASE_NEW,
      secure: false,
      changeOrigin: true
    }
  };
  arrCommonProxyPath.forEach((item) => {
    if (proxyTable[item]) {
      return;
    }
    proxyTable[item] = {
      target: VITE_SERVICE_BASE,
      changeOrigin: true,
    };
  });
  return proxyTable
};
