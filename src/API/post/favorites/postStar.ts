import { request } from '@/utils/request'
enum postStarApi {
  postStarApi = '/api/favorites/postStar',
}
const postStar = (data: any) => {
  return request({
    url: postStarApi.postStarApi,
    method: 'post',
    data: data,
  })
}

export default postStar
