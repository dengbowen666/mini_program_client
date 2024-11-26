import { request } from '@/utils/request'
enum postFeedbackApi {
  postFeedbackApi = '/api/viewHistory/postFeedback',
}
const postFeedback = (data: any) => {
  return request({
    url: postFeedbackApi.postFeedbackApi,
    method: 'post',
    data: data,
  })
}

export default postFeedback
