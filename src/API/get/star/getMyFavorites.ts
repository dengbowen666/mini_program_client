import { request } from '@/utils/request'
enum getMyFavoritesApi {
  getMyFavoritesApi = '/api/user/getMyFavorites',
}
const getMyFavorites = (params: any) => {
  return request({
    url: getMyFavoritesApi.getMyFavoritesApi,
    method: 'get',
    params: params,
  })
}

export default getMyFavorites
