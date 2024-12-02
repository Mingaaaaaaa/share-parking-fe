export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/parking/index',
    'pages/parking/detail/detail',
    'pages/rent/index',
    'pages/rent/publish/index',
    'pages/orders/index',
    'pages/admin/index',
    'pages/admin/audit/audit',
    'pages/admin/login/index',
  ],
  requiredPrivateInfos: ['getLocation', 'chooseLocation'],
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序的定位服务',
    },
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
