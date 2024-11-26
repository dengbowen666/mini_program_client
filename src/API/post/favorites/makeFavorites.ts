import { request } from '@/utils/request'
enum makeFavoritesApi {
  makeFavoritesApi = '/api/star/makeFavorites',
}
const makeFavorites = (params: any) => {
  return request({
    url: makeFavoritesApi.makeFavoritesApi,
    method: 'post',
    data: params,
  })
}

export default makeFavorites
