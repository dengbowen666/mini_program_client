import { request } from '@/utils/request'

const getMyFavorites = (params: any) => {
  return request({
    url: '/api/star/getMyStars',
    method: 'get',
    params: params,
  })
}

export default getMyFavorites
