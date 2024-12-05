import { request } from '@/utils/request'

const getMyFavorites = (params: any) => {
  return request({
    url: '/api/star/getMyStars',
    method: 'get',
    data:params
  })
}

export default getMyFavorites
