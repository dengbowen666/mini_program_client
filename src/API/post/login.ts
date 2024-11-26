import { request } from '@/utils/request'
enum loginApi {
  loginApi = '/api/user/login',
}
const login = (params: any) => {
  return request({
    url: loginApi.loginApi,
    method: 'post',
    data: params,
  })
}

export default login
