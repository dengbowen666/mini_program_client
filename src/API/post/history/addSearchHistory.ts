import { request } from '@/utils/request'

const addSearchHistory = (userId: number, keyword: string) => {
  return request({
    url: '/api/searchHistory/addSearchHistory',
    method: 'post',
    data: {
      userId: userId,
      keyword: keyword,
    },
  })
}

export default addSearchHistory
