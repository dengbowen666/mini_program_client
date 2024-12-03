<script setup lang="ts">

const goToEdit = () => {

  uni.navigateTo({ url: '/pages/profile_edit/profile_edit' })
}
const goToAbout = () => {
  uni.navigateTo({ url: '/pages/my/about/about' })
}
// const goToFeedback = () => {
//   uni.navigateTo({ url: '/pages/my/feedback/feedback' })
// }
import { ref } from 'vue'
import { useUser } from '@/stores/modules/useUser'
import { storeToRefs } from 'pinia'
const userUser = useUser()
const { userProfile } = storeToRefs(userUser)
// const { avatar, nickname } = userProfile.value
// 事实证明，直接用userProfile.avator即可做到实时更新，解构赋值反而不行，失去了响应式
</script>

<template>
  <view class="my">
    <image class="bg-img" src="../../static/images/bg.jpg"></image>
    <view class="avator">

      <image class="avator_img" :src="`${userProfile.avatar}`"></image>

      <text class="name">{{ userProfile.nickname||"开朗的大山" }}</text>


    </view>
    <view>
      <!-- 选项列表 -->
      <view class="option-list">

        <view class="option-item" @click="goToEdit"><text>编辑信息</text><text>></text></view>
        <view class="option-item" @click="goToAbout"><text>关于小程序</text><text>></text></view>
        <!-- <view class="option-item" @click="goToFeedback"><text>反馈</text><text>></text></view> -->
        <view class="option-item"><text>退出登录</text><text>></text></view>
      </view>
    </view>



  </view>
</template>

<style lang="scss">
.avator {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 400rpx;
  background-color: rgba(128, 128, 128, 0.656);
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
  background: #000;
}

.avator_img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  margin-bottom: 10rpx;
  background: #ccc;
}

.name {
  font-size: 40rpx;
  font-weight: bold;
  color: #000000;
}

.option-list {

  background-color: #fff;
  border-radius: 10rpx;
  margin: 30rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.5);
}

.option-item {
  display: flex;
  justify-content: space-between;

  align-items: center;
  border-bottom: grey solid 1rpx;
  padding: 30rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #222;
}
</style>
