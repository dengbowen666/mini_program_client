import { request } from '@/utils/request'

export const getArticleDetail = (material_id, user_id) => {
  return request({
    url: '/api/article/getArticleDetail',
    method: 'get',
    data: {
      user_id,
      material_id,
    },
  })
}
