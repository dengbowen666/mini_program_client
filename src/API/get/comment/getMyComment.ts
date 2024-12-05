import { request } from '@/utils/request'

export const getMyComment = (data: any) => {
  return request({
    url: '/api/comment/getMyComment',
    method: 'get',
    data: data,
  })
}
