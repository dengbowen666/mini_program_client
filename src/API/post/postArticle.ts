enum postArticleApi {
  POST_ARTICLE = 'http://47.108.183.218:8080/api/article/upload',
}
interface articleDetail {
  title: string
  tags: string[]
  desc: string
  limit: string
}

import { useUser } from '@/stores/modules/useUser'

const postArticle = async (tempFilePath: string, articleDetail: articleDetail) => {
  const { userProfile } = useUser()
  console.log(userProfile)

  const user_id = userProfile.user_id
  const { token } = useUser()
  console.log(user_id, token)

  // 疑问。这个token是多久获取的，写在函数之外可行吗，这个ts文件是多久执行的

  // const publishTime = new Date().toLocaleString()
  const { title, tags, desc, limit } = articleDetail
 const tagsString = tags.join(',')
  // 添加其他内容到FormData对象中
  console.log(tempFilePath,articleDetail)
  const formData = {
    title,
    tags: tagsString,
    description: desc,
    limit,
    user_id: user_id,
  }
  console.log(formData);


  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: postArticleApi.POST_ARTICLE, // 开发者服务器URL
      filePath: tempFilePath,
      name: 'file', // 后台用来解析的文件名
      formData: formData,
      header: {
        'Content-Type': 'multipart/form-data',
        authentication: token,
      },
      success: function (res) {
        const data = res.data // 获取上传结果
        resolve(data)
      },
      fail: function (error) {
        console.error(error)
        reject(error)
      },
    })
  })
  // 发送请求
}
export default postArticle
