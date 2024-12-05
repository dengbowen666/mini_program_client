import { request } from '@/utils/request'

export const getAnnouncementDetail = (id) => {
  return request({
    url: '/api/announcement/getAnnouncementDetail',
    method: 'get',
    data: {
      announcementId: id
    }
  })
}
