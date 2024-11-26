<script setup lang="ts">
// 获取安全距离
const safeArea = uni.getSystemInfoSync().safeArea;
</script>

<template>
  <view class="navbar" :style="`padding-top: ${safeArea.top}px`">
    <!-- logo文字 -->
    <view class="logo">
      <text class="logo-image">哪儿都学</text>
      <text class="logo-text">丰富 · 便捷 · 实用</text>
    </view>
    <!-- 搜索条 -->

  </view>
</template>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  background-image: url(@/static/images/navigator_bg.png);
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    padding-top: 20rpx;
    padding-bottom: 60rpx;

    .logo-image {
      width: 166rpx;
      height: 39rpx;
     color: #fff;
      font-size: 36rpx;
      font-weight: bold;
      line-height: 28rpx;
    }

    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
  }



  .icon-scan {
    font-size: 30rpx;
    padding: 15rpx;
  }
}
</style>
