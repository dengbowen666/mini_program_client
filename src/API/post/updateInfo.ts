import {request} from '@/utils/request'
enum updateInfoApi {
  // 更新用户信息
  UPDATE_USER_INFO = '/api/user/updateInfo',
}
const updateInfo = ( params: any) => {
return request({
  url: updateInfoApi.UPDATE_USER_INFO,
  method: 'post',
  data: params
})
}

export default updateInfo
