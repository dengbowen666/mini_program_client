import { request } from '@/utils/request'
enum addViewHistoryApi {
  addViewHistoryApi = '/api/history/addViewHistory',
}
const addViewHistory = (data: any) => {
  return request({
    url: addViewHistoryApi.addViewHistoryApi,
    method: 'post',
    data: data,
  })
}

export default addViewHistory
