import { request } from '@/utils/request'
enum getSearchHistoryApi {
  getSearchHistoryApi = '/api/searchHistory/getSearchHistory',
}
export const getSearchHistory = (data: any) => {
  return request({
    url: getSearchHistoryApi.getSearchHistoryApi,
    method: 'get',
    data: data,
  })
}
