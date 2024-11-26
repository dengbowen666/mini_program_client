import { request } from '@/utils/request'
enum deleteArticleApi {
  deleteArticleApi = '/api/user/deleteArticle',
}
const deleteArticle = (data: any) => {
  return request({
    url: deleteArticleApi.deleteArticleApi,
    method: 'post',
   data:data,
  })
}

export default deleteArticle
