<template>
  <view class="container">
    <view class="header">
      <text> {{ starListSize || 0 }}张收藏夹</text>
      <uni-icons type="arrowleft" size="20" @click="back"></uni-icons>
    </view>
    <view class="main">
      <view class="star" v-for="item in starList" :key="item" @click="toStar(item.directoryId)">
        <view class="star-content">
          <view class="title">{{ item.directoryName }}</view>
          <view class="details">
            <view class="size">{{ item.articleSize }}篇文章</view>
            <!-- <view class="time">创建于：{{ item.created_time }}</view> -->
          </view>
        </view>
      </view>
      <view class="icon"><uni-icons type="right" color="" size="24" /></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import getMyFavorites from '@/API/get/star/getMyFavorites';
import { ref, onMounted } from 'vue';
import { useUser } from '@/stores/modules/useUser';
import pubsub from 'pubsub-js';

const { userProfile } = useUser();
const { user_id } = userProfile;
const starList = ref([]);
const pageNumber = ref(1);
const pageSize = ref(10);
const starListSize = ref(0);

const getStarList = async (favorites_id: string) => {
  const res = await getMyFavorites({
    userId: user_id,
    favoritesId: 0,
    pageNumber: pageNumber.value,
    pageSize: pageSize.value
  });
  console.log(res);


  if (res.code === 1) {
    starListSize.value = res.data.total;
    starList.value.push(...res.data.records);
  } else {
    uni.showToast({
      title: '错误',
      icon: 'error'
    });
  }
};

const toStar = (favorites_id: string) => {
  uni.navigateTo({
    url: `/pages/index/star/starArticles/starArticles?favorites_id=${favorites_id}`
  });
};

pubsub.subscribe('updateFavorites', () => {
  getStarList('');
})

onMounted(() => {
  getStarList('');
});


const back = () => {
  uni.navigateBack();
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.main {
  display: flex;
  flex-direction: column;
}

.star {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.star-content {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.size,
.time {
  color: #666;
  font-size: 14px;
}

.icon {
  visibility: hidden;
  /* Hide the icon by default */
}
</style>
