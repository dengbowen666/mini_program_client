<template>
  <view class="search">
    <view class="input">
      <input placeholder="请输入关键词" v-model="keyword" />
      <uni-icons type="search" color="" size="24" @click="search(keyword)" />
    </view>
    <view class="searchHistory" v-if="isshowHistory">
      <view class="tipsbar"><span>搜索历史</span>
        <span>
          <uni-icons type="trash" color="" size="24" @click="clearHistory" />
          <uni-icons type="down" color="" size="24" @click="isfold = false" v-if="isfold" />
          <uni-icons type="up" color="" size="24" @click="isfold = true" v-else />
        </span>
      </view>
      <view class="historyList" v-if="isfold == false">
        <text v-for="item in historyResult" :key="item" @click="search(item), keyword = item" class="historyItem">{{ item
        }}</text>
      </view>
    </view>
    <scroll-view :scroll-y="true" class="scroll-y" @scrolltolower="updateResults"
      v-if="!isshowHistory && searchResult.length > 0">


      <view class="searchResult">
        <article_preview v-for="item in searchResult" :key="item" :post="item">{{ item }}</article_preview>

      </view>
    </scroll-view>
    <view class="noResult" v-if="!isshowHistory && searchResult.length === 0">空空如也</view>
  </view>
</template>

<script setup lang="ts">
import article_preview from '../components/article_preview.vue'
import { ref, onMounted, watch } from 'vue'
import { useUser } from '@/stores/modules/useUser'
const userStore = useUser()
const { userProfile } = userStore
const user_id = userProfile.user_id
const historyResult = ref([])
const isshowHistory = ref(true)
import { getSearchHistory } from '@/API/get/history/getSearchHistory'
import addSearchHistory from '@/API/post/history/addSearchHistory'
onMounted(async () => {
  // 获取用户搜索历
  isshowHistory.value = true
  const res = await getSearchHistory({
    userId: user_id,
  })
  if (res.code === 1) {
    console.log(res.data);


    const result = res.data.map((item: any) => item.keyword)
    historyResult.value = Array.from(new Set(result))
    console.log(historyResult.value);

  }
});

// 得到返回一个数组，呈现给用户搜索历史


const keyword = ref('')
import { getArticles } from '@/API/get/article/getArticles'
const searchResult = ref([])
const index = ref(1)
const search = async (keyword: string) => {
  if (keyword.trim().length === 0) {
    uni.showToast({
      title: '请输入关键词',
      icon: 'none'
    })
    return
  }

  index.value = 1
  uni.showLoading({
    title: '加载中',
  })
  try {


    const res = await getArticles({
      type: 'search',
      keyword: keyword,
      page: index.value,
      pageSize: 10,
      sort: 'time',
      userId: user_id
    })
    await addSearchHistory(Number(user_id), keyword)
    uni.hideLoading()
    if (res.code === 1) {
      searchResult.value = res.data.records
      console.log(isshowHistory.value, searchResult.value);
      isshowHistory.value = false
    }
    else {
      uni.showToast({
        title: '搜索失败',
        icon: 'none'
      })
    }
  }
  catch (error) {
    uni.showToast({
      title: '请求失败'
    })
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
    pageSize: 10,
    userId: user_id
  })
  if (res.code === 1) {
    searchResult.value = [...searchResult.value, ...res.data]
  }
}
watch(() => keyword.value, () => {
  if (keyword.value.trim().length === 0) {
    getSearchHistory({
      userId: user_id,
    }).then(res => {
      if (res.code === 1) {
        const result = res.data.map((item: any) => item.keyword)
        historyResult.value = Array.from(new Set(result))
        isshowHistory.value = true
      }

    })


  }
})
const isfold = ref(false)
import deleteSearchHistory from '@/API/post/history/deleteSearchHistory'
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({
          title: '清空中...',
        })
        deleteSearchHistory(
          0
        ).then(res => {

          if (res.code === 1) {
            uni.hideLoading()
            uni.showToast({
              title: '清空成功',
              icon: 'success'
            })
            getSearchHistory({
              userId: user_id,
            }).then(res => {
              if (res.code === 1)
              historyResult.value=res.data.map((item: any) => item.keyword)
            })
          }
          else {
            uni.hideLoading()
            uni.showToast({
              title: '清空失败',
              icon: 'none'
            })
          }
        })

      }
    }
  })
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
  justify-content: space-between;
  align-items: center;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  box-sizing: border-box;

}

.searchHistory {
  flex-grow: 1;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.noResult {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #ccc;

}

.historyItem {
  margin-bottom: 10px;
  margin-right: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #e4e0e0;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tipsbar {
  width: 100%;
  display: flex;
  justify-content: space-between;

}

.historyList {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.historyItem:hover {
  background-color: #e6e6e6;
}
</style>
