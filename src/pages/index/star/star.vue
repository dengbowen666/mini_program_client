<template>
  <view class="container">
    <view class="header">
      <text> {{ starListSize }}张收藏夹</text>
      <uni-icons type="arrowleft" size="20" @click="back"></uni-icons>
    </view>
    <view class="main">
      <view class="star" v-for="item in starList" :key="item.favorites_id" @click="toStar(item.favorites_id)">
        <view class="star-content">
          <view class="title">{{ item.folder_name }}</view>
          <view class="details">
            <view class="size">{{ item.article_size }}篇文章</view>
            <view class="time">创建于：{{ item.created_time }}</view>
          </view>
        </view>
      </view>
      <view class="icon"><uni-icons type="right" color="" size="24" /></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import  getMyFavorites  from '@/API/get/star/getMyFavorites';
import { ref, onMounted } from 'vue';
import { useUser } from '@/stores/modules/useUser';

const { userProfile } = useUser();
const { user_id } = userProfile;
const starList = ref([{
  favorites_id: '1',
  folder_name: '技术文章',
  article_size: 25,
  created_time: '2023-01-15'
},
{
  favorites_id: '2',
  folder_name: '个人理财',
  article_size: 15,
  created_time: '2023-03-22'
},
{
  favorites_id: '3',
  folder_name: '旅游攻略',
  article_size: 40,
  created_time: '2023-05-01'
},
{
  favorites_id: '4',
  folder_name: '健康生活',
  article_size: 30,
  created_time: '2023-07-12'
},
{
  favorites_id: '5',
  folder_name: '美食食谱',
  article_size: 50,
  created_time: '2023-09-30'
}]);
const pageNumber = ref(1);
const pageSize = ref(10);
const starListSize = ref(0);

const getStarList = async (favorites_id: string) => {
  const res = await getMyFavorites({
    user_id,
    favorites_id: favorites_id,
    pageNumber: pageNumber.value,
    pageSize: pageSize.value
  });

  if (res.code === 200) {
    starListSize.value = res.data.favorites_size;
    starList.value.push(...res.data.favorites);
  } else {
    uni.showToast({
      title: res.msg,
      icon: 'error'
    });
  }
};

const toStar = (favorites_id: string) => {
  uni.navigateTo({
    url: `/pages/index/star/starArticles/starArticles?favorites_id=${favorites_id}`
  });
};

// uni.onReachBottom(() => {
//   pageNumber.value++;
//   getStarList('');
// });

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
