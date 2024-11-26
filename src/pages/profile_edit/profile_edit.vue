<template>
  <view class="container">

    <view class="profile_edit">个人信息</view>
    <view class="infoList">
      <view class="infoItem">
        <view class="infoItemLeft">头像</view>
        <view class="infoItemRight">
          <image :src="`${avatar_url}`" mode="aspectFill" class="avatar" @click="chooseAvatar"></image>
        </view>
      </view>
      <view class="infoItem">
        <view class="infoItemLeft">个签</view>
        <view class="infoItemRight">
          <input type="text" v-model="signature" :placeholder="signature" class="input">
        </view>
      </view>
    </view>
    <view class="infoList">
      <view class="infoItem">
        <view class="infoItemLeft">昵称</view>
        <view class="infoItemRight"><input type="text" v-model="nickname" :placeholder="nickname" class="input"></view>
      </view>
      <view class="infoItem">
        <view class="infoItemLeft">学校</view>
        <view class="infoItemRight">
          <input type="text" v-model="school" :placeholder="school" class="input">
        </view>
      </view>
      <view class="infoItem">
        <view class="infoItemLeft">性别</view>
        <view class="infoItemRight">
          <input type="text" v-model="sex" :placeholder="sex" class="input">
        </view>
      </view>



    </view>
    <button class="saveBtn" @click="saveProfile">
      保存
    </button>
  </view>
</template>

<script setup lang="ts" >


import { useUser } from '@/stores/modules/useUser'
const userStore = useUser()
const { setProfile, userProfile } = userStore
import { ref, reactive, onMounted } from 'vue'
const nickname = ref('')
const signature = ref('')
const avatar_url = ref('')
const sex = ref('')
const school = ref('')
onMounted(() => {
  // 到达个人界面，就从userStore中获取用户信息
  loadUserProfile()

})
const loadUserProfile = () => {
  nickname.value = userStore.userProfile.nickname
  signature.value = userStore.userProfile.intro
  avatar_url.value = userStore.userProfile.avatar_url
  sex.value = userStore.userProfile.sex
  school.value = userStore.userProfile.school

}
import updateInfo from '@/API/post/updateInfo';
const saveProfile = () => {
  updateInfo({
    nickname: nickname.value,
    signature: signature.value,
    avatar_url: avatar_url.value,
    sex: sex.value,
    school: school.value
  }).then(res => {
    console.log(res)
    if (res.code === 1) {
      // 成功就把用户信息保存到pinia
      const user_id = res.user_id
      setProfile({
        nickname: nickname.value,
        signature: signature.value,
        avatar_url: avatar_url.value,
        sex: sex.value,
        school: school.value,
        user_id: user_id
      })

      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '保存失败',
      })
    }
  })
}
const chooseAvatar = () => {

}
</script>

<style>
.container {
  position: relative;
  background-color: hsl(0, 0%, 91%);
  height: 100vh;
}

.return {
  position: absolute;
  top: 40rpx;
  left: 0rpx;
  color: #000;

  padding: 0rpx 25rpx;
  font-size: 30rpx;
}

.profile_edit {
  font-size: 40rpx;
  font-weight: bold;
  padding: 20rpx;
  padding-top: 140rpx;

}

.infoList {
  margin: 20rpx;

  border-radius: 10rpx;
  background-color: #fff;
}

.infoItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid #ccc;

 
}

.infoItem:last-child {
  border-bottom: 1rpx solid #ccc;
}

.infoItemLeft {
  font-size: 30rpx;
}

.infoItemRight {
  display: flex;
  align-items: center;
  color: grey;
  font-size: 30rpx;
}

.avatar {

  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.saveBtn {
  width: 200rpx;
  background-color: #79a3cf;
  color: #fff;
  border-radius: 10rpx;

}
</style>
