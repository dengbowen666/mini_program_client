import { request } from '@/utils/request'
enum postDownLoadApi{
  postDownLoad= '/api/postDownLoad',
}
const postDownLoad = (params: any) => {
  return request({
    url: postDownLoadApi.postDownLoad,
    method: 'post',
    data: params,
  })
}

export default postDownLoad
