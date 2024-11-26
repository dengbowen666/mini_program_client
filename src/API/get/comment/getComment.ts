import { request } from '@/utils/request'
enum getCommentApi {
  getCommentApi = '/api/comment/getComment',
}
export const getComment = (data: any) => {
  return request({
    url: getCommentApi.getCommentApi,
    method: 'get',
    data: data,
  })
}
