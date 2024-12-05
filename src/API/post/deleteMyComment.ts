import { request } from '@/utils/request'

const deleteMyComment = (data: any) => {
  return request({
    url: '/api/comment/deleteMyComment',
    method: 'post',
    data: data,
  })
}

export default deleteMyComment
