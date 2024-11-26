import { request } from '@/utils/request'
enum postCommentApi {
  postCommentApi = '/api/comment/postComment',
}
const postComment = (params: any) => {
  return request({
    url: postCommentApi.postCommentApi,
    method: 'post',
    data: params,
  })
}

export default postComment
