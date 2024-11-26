import { request } from "@/utils/request"
enum getArticleDetailApi {
  getArticleDetail = "/api/article/getArticleDetail"
}
export const getArticleDetail = (data: any) => {
  return request({
    url: getArticleDetailApi.getArticleDetail,
    method: "get",
   data
  })
}
