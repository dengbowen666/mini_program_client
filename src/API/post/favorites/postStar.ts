import { request } from '@/utils/request'
enum postStarApi {
  postStarApi = '/api/star/postStar',
}
const postStar = (data: any) => {
  return request({
    url: postStarApi.postStarApi,
    method: 'post',
    data: data,
  })
}

export default postStar
