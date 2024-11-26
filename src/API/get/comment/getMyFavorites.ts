import { request } from '@/utils/request'
enum getMyFavoritesApi {
  getMyFavoritesApi = '/api/getMyFavorites',
}
export const getMyFavorites = (data: any) => {
  return request({
    url: getMyFavoritesApi.getMyFavoritesApi,
    method: 'get',
   data
  })
}
