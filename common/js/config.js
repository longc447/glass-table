/**
 * 镜片一站式采购平台
 */
const x = {
  // baseUrl: 'https://jqh.tongzhounetwork.ltd',
  baseUrl: 'https://feifeng.tongzhounetwork.ltd',
  imgDomain: 'https://feifeng.tongzhounetwork.ltd',
  h5Domain: 'https://feifeng.tongzhounetwork.ltd/h5',
  mpKey: 'IB7BZ-4BMCD-43J4O-HS2HW-DZSGF-LGBHX',
  //小程序appid wx0f57e059962fab6a
}
const globalConfig = {
  // 价格保护 3是无保护 0是有保护
  is_wholesaler: 0,
  // 是否强制登陆 0不强制 1强制


  isMustLogin: 0,
  // 是否开启定位功能 0关闭 1开启
  isEnableLocation: 0
}
let param = {
  //客服地址
  webSocket: '',
  //本地端主动给服务器ping的时间, 0 则不开启 , 单位秒 
  pingInterval: 1500,
  // 超时时间 超出时间段将重连系统 单位秒
  // timeout : 15000,
  // api安全
  apiSecurity: false,
  // 公钥
  publicKey: ``,
}
Object.assign(param, x)
export default {
  ...param,
  ...x,
  ...globalConfig
}
