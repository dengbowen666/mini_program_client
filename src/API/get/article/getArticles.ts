import { request } from '@/utils/request'
enum getArticlesApi {
  getArticlesApi = '/api/article/getArticles',
}
export const getArticles= (data: any) => {
  return request({
    url: getArticlesApi.getArticlesApi,
    method: 'get',
    data: data,
  })
}
