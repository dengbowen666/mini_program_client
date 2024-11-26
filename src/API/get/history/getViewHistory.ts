import { request } from '@/utils/request'
enum getViewHistoryApi {
  getViewHistoryApi = '/api/history/getViewHistory',
}
export const getViewHistory = (data: any) => {
  return request({
    url: getViewHistoryApi.getViewHistoryApi,
    method: 'get',
    data: data,
  })
}
