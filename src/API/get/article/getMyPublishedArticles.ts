import { request } from '@/utils/request'

export const getMyPublishedArticles = (data: any) => {
  return request({
    url: '/api/article/getMyPostArticle',
    method: 'get',
    data: data,
  })
}
