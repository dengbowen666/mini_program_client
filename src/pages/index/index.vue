<script setup lang="ts">
import { onMounted } from 'vue'
import CustomNavbar from './components/CustomNavbar.vue'
import notice from '../../components/notice.vue';
import getUserInfo from '@/API/get/getUserInfo';
import { useUser } from '@/stores/modules/useUser';
import { storeToRefs } from 'pinia';
const user = useUser();
const {setProfile}= user;
const { userProfile } = storeToRefs(user);
const { user_id } = userProfile.value;
const { token } = user
import { ref } from 'vue'
const showchoice = ref(false)
const goToChoice = () => {
  showchoice.value = true
}

onMounted(() => {
  getUser()
});

const getUser = async () => {
  const res = await getUserInfo({
    user_id: user_id,
    //  token在请求头里
  })
  if (res.code != '1') {
    uni.showToast({
      title: '获取用户信息失败,重新登录',
      icon: 'error',
    }).then(() => {
      // uni.navigateTo({
      //   url: '/pages/login/login'
      // })
    })
  } else {
    setProfile(res.data,user_id)
  }
}
const goFind = () => {
  uni.navigateTo({
    url: '/pages/index/find/find'
  })
}
const goUpload = () => {
  uni.navigateTo({
    url: '/pages/index/upload/upload'
  })
}
const goStar = () => {
  uni.navigateTo({
    url: '/pages/index/star/star'
  })
}
const goHistory = () => {
  uni.navigateTo({
    url: '/pages/index/history/history'
  })
}
const goPublished = () => {
  uni.navigateTo({
    url: '/pages/index/published/published'
  })
}
const goPublishedComments = () => {
  uni.navigateTo({
    url: '/pages/index/published/publishedComments'
  })
}
const goDownloaded = () => {
  uni.navigateTo({
    url: '/pages/index/downloaded/downloaded'
  })
}

</script>

<template>
  <CustomNavbar></CustomNavbar>
  <notice></notice>
  <view class="choice">
    <image class="bg-img" src="../../static/images/bg.jpg"></image>


    <view class="card" style="background: #0e3873;" @click="goFind">
      <text>寻找</text>
      <text class="desc">Search</text>
    </view>
    <!-- 卡片，跳转上传资料 -->
    <view class="card" @click="goUpload" style="background: orange;">
      <text>上传</text>
      <text class="desc">Upload</text>
    </view>

    <!-- 卡片，展示我的收藏预览，支持点进去查看我收藏的资料详情 -->




    <view class="card" style="background:rgb(42, 179, 179)" @click="goStar">
      <text>收藏</text>
      <text class="desc">Star</text>

    </view>
    <view class="card" @click="goHistory">
      <text>历史</text>
      <text class="desc">History</text>

    </view>
    <!-- 卡片展示我的下载 -->
    <view class="card" style="background: #0e7341" @click="goDownloaded">
      <text>我的下载</text>
      <text class="desc">Downloaded</text>

    </view>
    <view v-if="!showchoice" class="card" style="background: #bf98d2" @click="goToChoice">
      <text>我的发布</text>
      <text class="desc">Published</text>
    </view>
    <view v-else class="publishchoice card" style="background: #bf98d2">

      <uni-icons type="close" color="" size="20" class="button" @click="showchoice = !showchoice" />

      <text @click="goPublishedComments" class="commentBtn">评论</text>
      <text @click="goPublished" class="articleBtn">文章</text>
    </view>
  </view>
</template>

<style lang="scss">
.choice {
  margin-top: 100rpx;
  display: flex;
  background-color: transparent;
  flex-wrap: wrap;
  justify-content: space-around;




  .card {
    margin-bottom: 50rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    width: 40%;
    height: 180rpx;
    border-radius: 10rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.658);
    background: #222;

    text {
      color: #fff;
      width: 70%;
      font-size: 40rpx;
      margin-left: 20rpx;
      margin-top: 20rpx;
      padding-bottom: 10rpx;
      border-bottom: #fff solid 2px;
    }

    .desc {
      font-size: 35rpx;
      margin-left: 20rpx;
      margin-top: 10rpx;
      border: none;
    }
  }

  .bg-img {
    position: fixed;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .publishchoice {
    position: relative;
    flex-direction: row;
    align-items: center;
    text-align: center;
    // animation: show 0.4s ease-in-out;

    .button {
      position: absolute;
      right: 0;
      top: 0;
      border-bottom: none;

    }

    .commentBtn {
      border-bottom: #fff solid 2px;
      border-right: #fff solid 2px;
      border-radius: 50%;
      padding: 20rpx;
    }

    .articleBtn {
      border-bottom: #fff solid 2px;
      border-right: #fff solid 2px;
      border-radius: 50%;
      padding: 20rpx;
      margin-right: 20rpx;
    }

  }

  // @keyframes show {
  //   0% {
  //     opacity: 0;
  //     scale: 0.8;
  //   }

  //   100% {
  //     opacity: 1;
  //     scale: 1;

  //   }

  // }
}

//
</style>
