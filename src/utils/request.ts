import { useUser } from '@/stores'
const url_all = {
  DEV: 'http://47.108.183.218:8080', // 开发
}
let BASEURL = url_all['DEV']
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1.非http开头拼接地址

    options.url = BASEURL + options.url
    // 2.请求超时
    options.timeout = 5000
    // 3.请求头,添加小程序端请求头标识
    options.header = {
      ...options.header,
      // 'content-type': 'application/json',
      'source-client': 'miniapp',
    }
    // 添加token请求头标识
    const userstore = useUser()
    const token = userstore?.token
    // const token = memberStore.profile?.token

    options.header.authentication = token
  },
}
//

uni.addInterceptor('request', httpInterceptor)
export const request = (options = {}) => {
  return new Promise((resolve, rejects) => {
    handleRequest(options, resolve, rejects)
  })
}
// 发起请求
function handleRequest(options: any, resolve: Function, reject: Function) {
  uni.request({
    url: options.url,
    method: options.method,
    header: options.header,
    data: options.data,
    success: (response) => {
      return resolve(response.data)
    },
    fail: (fail) => {
      console.log('fail', fail)
      return reject(fail)
    },
  })
}
