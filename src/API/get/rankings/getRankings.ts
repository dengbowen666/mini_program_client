import { request } from '@/utils/request'
enum getRankingsApi {
  getRankingsApi = '/api/getRankings',
}
export const getRankings = (data: any) => {
  return request({
    url: getRankingsApi.getRankingsApi,
    method: 'get',
   data:data,
  })
}
