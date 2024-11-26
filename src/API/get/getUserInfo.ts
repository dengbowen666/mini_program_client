import { request } from "@/utils/request";
enum getInfoApi {
  GET_INFO="/api/user/getUserInfo"
}
const
  getUserInfo = (data: any) => {
    return request({
      url: getInfoApi.GET_INFO,
      method: "get",
      data:data
    })
  }
export default getUserInfo
