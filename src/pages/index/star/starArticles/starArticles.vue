<template>
  <view>
    <view v-for="item in articles" :key="item.article_id" @click="goArticleDetail(item.article_id)">
      <view class="title">
        <text>{{ item.title }}</text>
      </view>
      <view class="description">
        <text>{{ item.description }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
// 获取路由传递过来的参数favorites_id
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app';
import { useUser } from '@/stores/modules/useUser';
import { getMyFavorites } from '@/API/get/comment/getMyFavorites';
const { userProfile } = useUser()
const { user_id } = userProfile
const favorites_id = ref('')
const pageNumber = ref(1)
const pageSize = ref(10)
const articles = ref([])
import { goArticleDetail } from '@/hook/usegoArticleDetail'
onLoad((options) => {

  favorites_id.value = options.favorites_id
  getFavoriteArticles()
})
const getFavoriteArticles = async () => {
  const res = await getMyFavorites({
    user_id,
    favorites_id: favorites_id.value,
    pageNumber: pageNumber.value,
    pageSize: pageSize.value
  })
  articles.value.push(...res.data.articles)
}
uni.onReachBottom(() => {
  pageNumber.value++
  getFavoriteArticles()
})
</script>

<style></style>
