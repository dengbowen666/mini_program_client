import { request } from '@/utils/request'

const deleteSearchHistory = (searchHistoryId) => {
  return request({
    url: '/api/searchHistory/deleteSearchHistory',
    method: 'post',
    data: {
      searchHistoryId, // 搜索历史记录ID
    },
  })
}

export default deleteSearchHistory
