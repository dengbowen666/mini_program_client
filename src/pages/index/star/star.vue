<template>
  <view class="container">
    <view class="header">
      <text> {{ starListSize || 0 }}张收藏夹</text>
      <uni-icons type="arrowleft" size="20" @click="back"></uni-icons>
    </view>
    <view class="main">
      <view class="star" v-for="item in starList" :key="item">
        <view class="star-content" @click="toStar(item.directoryId)">
          <view class="title">{{ item.directoryName }}</view>
          <view class="details">
            <view class="size">{{ item.articleSize }}篇文章</view>

          </view>
        </view>
        <view><uni-icons type="trash" color="" size="24" @click.stop="deleteStar(item.directoryId)" /></view>
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
    starList.value = res.data.records;
    // starList.value.push(...res.data.records);
  } else {
    uni.showToast({
      title: '获取收藏夹失败',
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
  console.log('updateFavorites');

  getStarList('');
})

onMounted(() => {
  getStarList('');
});


const back = () => {
  uni.navigateBack();
};

import deleteFavorites from '@/API/post/favorites/deleteFavorites'

const deleteStar = async (favorites_id: string) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该收藏夹吗？',
    success: async (res) => {
      if (res.confirm) {
        const res = await deleteFavorites({ id: Number(favorites_id) });
        console.log('deleteFavorites', res);

        if (res.code === 1) {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          });
          getStarList('');
        } else {
          uni.showToast({
            title: '删除失败',
            icon: 'error'
          });
        }
      }
    }
  });

}
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
  flex: 1;
  justify-content: start;
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
