<template>
  <view class="history">
    <scroll-view :scroll-y="true" class="scroll-y" @scrolltolower="updateHistorys">

      <viewHistoryItem v-for="item in ViewHistory" :item="item"></viewHistoryItem>

    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import viewHistoryItem from "./components/viewHistoryItem.vue"
import { getViewHistory } from '@/API/get/history/getViewHistory'

interface historyItem {
  article_id: number
  nickname: string
  score: string
  viewTime: string
  description: string
  title: string
}
const ViewHistory = ref<historyItem[]>([
  // {
  //   article_id: 1,
  //   nickname: "用户A",
  //   score: "90",
  //   viewTime: "2024-11-01",
  //   description: "这是一条描述信息打开大家卡夫卡萨凡纳卡",
  //   title: "微积分"
  // },
  // {
  //   article_id: 2,
  //   nickname: "用户B",
  //   score: "80",
  //   viewTime: "2024-11-01",
  //   description: "这是一条描述信息打开大家卡夫卡萨凡纳卡",
  //   title: "微积分"
  // },
  // {
  //   article_id: 3,
  //   nickname: "用户C",
  //   score: "70",
  //   viewTime: "2024-11-01",
  //   description: "这是一条描述信息打开大家卡夫卡萨凡纳卡",
  //   title: "微积分"
  // },


])
const index = ref(1)
onMounted(async () => {
  const res = await getHistory()
  ViewHistory.value = res.data.records
});
import { useUser } from '@/stores';
const user = useUser()
const userProfile = user.userProfile
const user_id = userProfile.user_id

const getHistory = () => {
  return getViewHistory({
    pageSize: 5,
    user_id: user_id,
    pageNum: index.value
  })
}
const updateHistorys = () => {
  index.value++
  getHistory().then((res) => {
    ViewHistory.value = [...ViewHistory.value, ...res]
  })
}

</script>

<style>
.history {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.scroll-y {
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
}
</style>
