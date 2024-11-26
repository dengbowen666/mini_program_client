import { request } from '@/utils/request'
enum getAnnouncementApi {
  getAnnouncement = '/api/announcement/getAnnouncement',
}
export const getAnnouncement = (data: any) => {
  return request({
    url: getAnnouncementApi.getAnnouncement,
    method: 'get',
    data:data
  })
}
