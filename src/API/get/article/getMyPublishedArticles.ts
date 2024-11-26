import { request } from '@/utils/request'
enum getMyPublishedArticlesApi {
  getMyPublishedArticlesApi = '/api/article/getMyPublishedArticles',
}
export const getMyPublishedArticles = (data: any) => {
  return request({
    url: getMyPublishedArticlesApi.getMyPublishedArticlesApi,
    method: 'get',
    data: data,
  })
}
