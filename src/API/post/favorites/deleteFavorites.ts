import { request } from '@/utils/request'
enum deleteFavoritesApi {
  deleteFavoritesApi = '/api/star/deleteFavorites',
}
const deleteFavorites = (params: any) => {
  return request({
    url: deleteFavoritesApi.deleteFavoritesApi,
    method: 'post',
    data: params,
  })
}

export default deleteFavorites
