<template>
  <view class="search">
    <view class="input">
      <input placeholder="请输入关键词" v-model="keyword" class="input" />
      <uni-icons type="search" color="" size="24" @click="search(keyword)" />
    </view>
    <view class="searchHistory" v-if="isshowHistory">
      <text v-for="item in historyResult" :key="item" @click="search(item)">{{ item }}</text>

    </view>
    <scroll-view :scroll-y="true" class="scroll-y" @scrolltolower="updateResults" v-if="!isshowHistory&&searchResult.length>0">


      <view class="searchResult">
        <view v-for="item in searchResult" :key="item" @click="getArticleDetail(item.id)">{{ item }}</view>

      </view>
    </scroll-view>
    <view class="noResult" v-if="!isshowHistory&&searchResult.length===0">空空如也</view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUser } from '@/stores/modules/useUser'
const userStore = useUser()
const { userProfile } = userStore
const user_id = userProfile.user_id
const historyResult = ref([])
const isshowHistory = ref(true)
import { getSearchHistory } from '@/API/get/history/getSearchHistory'
onMounted(async () => {
  // 获取用户搜索历
  isshowHistory.value = true
  historyResult.value = await getSearchHistory({
    userId: user_id,
  })
});

// 得到返回一个数组，呈现给用户搜索历史


const keyword = ref('')
import { getArticles } from '@/API/get/article/getArticles'
const searchResult = ref([])
const index = ref(0)
const search = async (keyword: string) => {
  isshowHistory.value = false
  index.value = 0
  const res = await getArticles({
    type: 'search',
    keyword: keyword,
    page: index.value,
    pageSize: 10
  })
  if (res.code === 1) {
    searchResult.value = res.data.records
    console.log(isshowHistory.value, searchResult.value);

  }
  // 得到返回一个数组，呈现给用户搜索结果,点击进入文章详情,返回的数据包括文章id，文章标题，文章内容，文章作者，文章发布时间，文章评论数，文章收藏数
}
import { getArticleDetail } from '@/API/get/article/getArticleDetail'
const updateResults = async () => {
  index.value++
  const res = await getArticles({
    type: 'search',
    keyword: keyword.value,
    pageNumber: index.value,
    pageSize: 10
  })
  if (res.code === 1) {
    searchResult.value = [...searchResult.value, ...res.data]
  }
}
</script>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  height: 100vh;

}

.input {
  width: 100%;
  display: flex;
  align-items: center;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  box-sizing: border-box;

}

.searchHistory {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
