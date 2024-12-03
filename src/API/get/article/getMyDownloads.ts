import { request } from '@/utils/request'

export const getMyDownloads = (user_id,pageNum,pageSize) => {
  return request({
    url: '/api/download/myDownloads',
    method: 'get',
    data: {
      user_id,
      pageNum,
      pageSize,
    },
  })
}
