<template>
  <view class="container">

    <view class="profile_edit">个人信息</view>
    <view class="infoList">
      <view class="infoItem">
        <view class="infoItemLeft">头像</view>
        <view class="infoItemRight">
          <image :src="`${avatar}`" mode="aspectFill" class="avatar" @click="chooseAvatar"></image>
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
          <!-- <input type="text" v-model="sex" :placeholder="sex" class="input"> -->
          <!-- 下拉框男女 -->
          <picker mode="selector" :range="['男', '女']" @change="sexChange">

            {{ sex }}

          </picker>

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
const { setProfile, userProfile,setUserId } = userStore
import { ref, reactive, onMounted } from 'vue'
const nickname = ref('')
const signature = ref('')
const avatar = ref('')
const sex = ref('')
const school = ref('')
let userId = ref()
onMounted(() => {
  // 到达个人界面，就从userStore中获取用户信息
  loadUserProfile()

})

const sexChange = (e) => {
  // e.detail.value 是数组中的索引，我们需要根据索引来设置 sex.value
  sex.value = e.detail.value === '0' ? '男' : '女';
};



const loadUserProfile = () => {
  console.log(userStore.token);

  nickname.value = userStore.userProfile.nickname
  signature.value = userStore.userProfile.intro
  avatar.value = userStore.userProfile.avatar
  sex.value = userStore.userProfile.sex
  school.value = userStore.userProfile.school
  userId.value = userStore.userProfile.user_id
}

const saveProfile = () => {
  // 检验输入是否都有数据
  if (!nickname.value || !avatar.value || !sex.value || !school.value) {
    wx.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }

  if (nickname.value.length > 10) {
    wx.showToast({
      title: '昵称长度不能超过10个字符',
      icon: 'none'
    });
    return;
  }
  if (signature.value.length > 50) {
    wx.showToast({
      title: '个性签名长度不能超过50个字符',
      icon: 'none'
    });
    return
  }
  if (nickname.value.length > 6) {
    wx.showToast({
      title: '昵称长度不能超过6个字符',
      icon: 'none'
    });
    return
  }
  const formData = {
    userId: Number(userId.value),
    nickname: nickname.value,
    intro: signature.value,
    sex: sex.value,
    school: school.value,
  }
  uni.uploadFile({
    url: 'http://47.108.183.218:8080/api/user/updateInfo', // 服务器接口地址
    filePath: avatar.value, // 头像文件路径
    name: 'avatar', // 文件字段名
    formData: formData,
    header: {
      'Content-Type': 'multipart/form-data',
      authentication: userStore.token,
    },
    success: (res) => {
      // 上传成功后的处理

      if (res) {
        // 更新用户信息
        setProfile({
          nickname: nickname.value,
          intro: signature.value,
          avatar: avatar.value, // 可能需要使用服务器返回的URL
          sex: sex.value,
          school: school.value,

        });
        console.log(userId.value);

        setUserId(Number(userId.value))
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });

      } else {
        console.log(res);

        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });

      }
      loadUserProfile()
    },
    fail: () => {
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      });
    }
  });

};
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1, // 默认9，设置为1表示只能选择一张图片
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album'],
    success: (res) => {
      // res.tempFilePaths 是选择的图片的本地文件路径数组
      if (res.tempFilePaths.length > 0) {
        avatar.value = res.tempFilePaths[0]; // 设置头像的本地路径
        //检查文件后缀名是否为jpg、jpeg、png、gif
        const fileExt = avatar.value.split('.').pop().toLowerCase();
        if (fileExt !== 'jpg' && fileExt !== 'jpeg' && fileExt !== 'png' && fileExt !== 'gif') {
          wx.showToast({
            title: '请上传jpg、jpeg、png，gif格式的图片',
            icon: 'none'
          });
          return;
        }
        console.log('选择的头像路径：', res.tempFilePaths[0]);
      }
    }
  });
};
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
  background-color: #222;
}

.saveBtn {
  width: 200rpx;
  background-color: #79a3cf;
  color: #fff;
  border-radius: 10rpx;

}
</style>
