import { request } from '@/utils/request'

export const changeCompetence = (materialId, competence) => {
  return request({
    url: '/api/article/changeCompetence',
    method: 'post',
    data: {
      articleId: materialId,
      competence,
    },
  })
}
