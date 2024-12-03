import { request } from "@/utils/request"

export const getArticleDetail = (material_id) => {
  return request({
    url: '/api/article/getArticleDetail',
    method: 'get',
    data: {
      material_id
    }
  })
}
