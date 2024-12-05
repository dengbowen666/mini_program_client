<template>
  <view>
    <!-- <view class="title">
      一共收藏了{{ articles.length }}篇文章
    </view> -->
    <view v-for="item in articles" :key="item.articleId" @click="goArticleDetail(item.articleId)">
      <view class="title">
        <text>{{ item.title }}</text>
      </view>
      <view class="description">
        <text>{{ item.description }}</text>
        <text class="operate" @click="cancelStar(item.articleId)">取消收藏</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
// 获取路由传递过来的参数favorites_id
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app';
import { useUser } from '@/stores/modules/useUser';
import getMyFavorites from '@/API/get/star/getMyFavorites';
const { userProfile } = useUser()
const { user_id } = userProfile
const favorites_id = ref('')
const pageNumber = ref(1)
const pageSize = ref(10)
const articles = ref([])
import { goArticleDetail } from '@/hook/usegoArticleDetail'
onLoad((options) => {

  favorites_id.value = options.favorites_id
  getFavoriteArticles('init')
})
const getFavoriteArticles = async (type) => {
  if (type === 'init') {
    articles.value = []
  }
  else if (type === 'loadMore') {
    pageNumber.value++
  }
  const res = await getMyFavorites({
    userId: user_id,
    favoritesId: favorites_id.value,
    pageNumber: pageNumber.value,
    pageSize: pageSize.value
  })
  articles.value.push(...res.data.records)

}
import postStar from '@/API/post/favorites/postStar';
const cancelStar = async (articleId) => {
  postStar({
    article_id: articleId, favorites_id: favorites_id.value, type: "cancel", user_id: user_id
  }).then((res) => {
    if (res.code === 1) {
      uni.showToast({
        // 删除成功
        title: '取消收藏成功',
        icon: 'success',
        duration: 2000
      })
      getFavoriteArticles('init')

    }

  })

}
</script>

<style>
.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: grey 1px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operate {

  color: #fff;
  background: skyblue;
  padding: 5px;
  border-radius: 5px
}
</style>
