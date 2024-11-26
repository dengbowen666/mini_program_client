<template>
  <view class="history-item" @click="goArticleDetail(article_id)">
    <view class="head">
    <text class="history-item__title">{{ title }}</text>
    <text class="history-item__time">{{ viewTime }}</text></view>
    <view class="history-item_description">{{ description }}</view>
    <view class="history-item__foot">
      <text class="name">{{ nickname }}</text>
      <text>热度：{{ score }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { goArticleDetail } from '@/hook/usegoArticleDetail';

// 接收props参数
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const { title, viewTime, description, nickname, score,article_id } = props.item
</script>

<style scoped>
.history-item {
  background-color: #eee;

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 16px;
  margin-bottom: 8px;
  color: #222;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.history-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.history-item__title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.history-item__time {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 12px;
}

.history-item_description {
  font-size: 13px;
  color: #aaa;
  margin-top: 6px;
  margin-bottom: 6px;
}
.head{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.history-item__foot {
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 14px;
  color: #aaa;
}

.history-item__foot text:first-child {
  padding-right: 10px;
  line-height: 10px;
  color: #656464;
  font-size: 10px;
  font-weight: 500;
  border-right: #222 solid 1px;
}

.history-item__foot text:last-child {
  margin-left: 10px;
  color: #dd9746;
  font-size: 13px;
  font-weight: 500;
}
</style>
