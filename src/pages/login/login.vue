<template>
  <view class="login-container">
    <view class="logo">
      <!-- 可以在这里添加一个logo图片 -->
      <!-- 一张可行的网络图片 -->
      <image src="https://c-ssl.dtstatic.com/uploads/blog/202207/24/20220724012810_6865b.thumb.400_0.jpeg "
        mode="aspectFit" class="logo-image"></image>
    </view>
    <view class="login-content">
      <view class="title">哪都学知识分享平台</view>
      <view class="login-submit-box">
        <text class="loginsubmitbox-text" v-on:tap="wechatLogin">微信一键登录</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import login from '@/API/post/login'
import { useUser } from '@/stores';
import { storeToRefs } from 'pinia';
const userStore = toRefs(useUser())
const { userProfile, setToken, setUserId } = userStore

const { user_id } = userProfile.value
const { token } = userStore
//一个响应一个不响应
function wechatLogin() {

  if (!token) {
    //有登录态
    uni.switchTab({
      url: '/pages/index/index',
    })
  }
  else {
    //重新登录
    let code = ''
    uni.login({
      provider: 'weixin',
      success: function (loginRes) {
        code = loginRes.code;
        console.log('login登录', {
          code: loginRes.code,
        });
      },
      fail: function (loginRes) {
        console.log(111)
      }
    });

    // 获取用户信息
    uni.getUserProfile({
      desc: '获取你的昵称、头像',
      success: res => {
        console.log('获取你的昵称、头像', res);
        //  登录请求
        login({
          code: code,
        }).then(res => {
          uni.switchTab({
            url: '/pages/index/index',
          })
          console.log(res);

          if (res.code === 1) {

            // 登陆成功，后端返回用户id，token,等信息
            setUserId.value(res.data.userId)
            setToken.value(res.data.token)


            //这里token输出变化了，但是user_id没有变化，是因为token保持了对象的引用，而user_id是获取了就定死的，所以不会变化
            uni.switchTab({
              url: '/pages/index/index',
            })
          }
        }).catch(err => {
          console.log(err)
          // uni.switchTab({
          //   url: '/pages/index/index',
          // })
          uni.showModal({
            title: '登录失败',
            content: '请刷新小程序后重新操作',
          });
        })

      },
      fail: res => {
        console.log(2);
        console.log(res)
        //拒绝授权
        uni.showToast({
          title: '请刷新小程序后重新操作',
          icon: 'error',
          duration: 2000
        });
        return;
      }
    });
  }
}
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* background-image: url('https://source.unsplash.com/featured/?nature'); */
  background-size: cover;
  background-position: center;
}

.logo {
  margin-bottom: 40px;
}

.logo-image {
  width: 120px;
  height: 120px;
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.login-submit-box {
  width: 80%;
  margin-top: 20px;
}

.loginsubmitbox-text {
  display: inline-block;
  width: 100%;
  padding: 15px;
  font-size: 18px;
  text-align: center;
  color: #fff;
  background-color: #1AAD19;
  /* 微信绿 */
  border-radius: 5px;
}

.loginsubmitbox-text:active {
  opacity: 0.8;
}
</style>
