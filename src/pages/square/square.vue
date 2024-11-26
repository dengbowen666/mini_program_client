<template>
  <view class="container">


    <uni-card padding="0" spacing="0">
      <template v-slot:cover>
        <view class="custom-cover">
          <image class="cover-image" mode="aspectFill" :src="cover">
          </image>
          <view class="cover-content">
            <text class="uni-subtitle uni-white">今日热点</text>
          </view>
        </view>
      </template>
      <uni-list>

        <uni-list-item title="更多" showArrow></uni-list-item>
      </uni-list>

    </uni-card>
<view class="main">
  <view><text>作者排行</text>
<ul>
  <li v-for="(item,index) in authorRankings" :key="index">{{item.rank}}{{item.name}}{{ item.score }}</li>
</ul>

  </view>

  <view><text>资料排行</text>
  <ul>


    <li v-for="(item,index) in articleRankings" :key="index">{{item.name}}</li>
  </ul>
  </view>
</view>


  </view>
</template>
<script setup lang="ts">
import {ref} from 'vue'
     const cover='https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg'

    const   extraIcon= {
        color: '#4cd964',
        size: '22',
        type: 'gear-filled'
      }

function    actionsClick(text) {
      uni.showToast({
        title: text,
        icon: 'none'
      })
}
const authorRankings = ref([])
    const articleRankings = ref([])
import { getRankings } from '@/API/get/rankings/getRankings';
const getAuthorRankings = async () => {
 authorRankings.value = await getRankings({
    type: 'author',
    limit: 5
  });

}
const getArticleRankings = async () => {
  articleRankings.value= await getRankings({
    type: 'article',
    limit: 5
  });
}
</script>
<style lang="scss">
.container {
  overflow: hidden;
}

.custom-cover {
  flex: 1;
  flex-direction: row;
  position: relative;
}

.cover-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: rgba($color: #000000, $alpha: 0.4);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  font-size: 14px;
  color: #fff;
}

.card-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 45px;
  border-top: 1px #eee solid;
}

.card-actions-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.card-actions-item-text {
  font-size: 12px;
  color: #666;
  margin-left: 5px;
}

.cover-image {
  flex: 1;
  height: 150px;
}

.no-border {
  border-width: 0;
}
.main{
  display: flex;
  ul{
    list-style: none;
    padding: 0;
    margin: 0;
    li{
      padding: 10px;
      border-bottom: 1px solid #ccc;
    }
  }
  view{
    flex: 1;
    text-align: center;
  }
}
</style>

