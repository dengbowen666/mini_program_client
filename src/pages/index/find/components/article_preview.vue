<!-- 文章的预览一小块，介绍文章基本信息，可供点击进入详情 -->
<template>
	<view>
  <view class="post">
        <view class=" post-head">
          <view class="post-title">{{ post.title }}</view>
          <view style="display:flex">
            <view class="post-tag" v-for="tag in post.tag">{{ tag }}</view>
          </view>
        </view>
        <view class="post-meta">
          <view class="post-time">{{ post.time }}</view>
          <view class="post-popularity">热度: {{ post.popularity }}</view>
          <view class="post-description">{{ post.des }}</view>

        </view>
      </view>
    </view>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
//获取props参数
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<style>
.posts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}

/* 帖子列表项样式 */
.post {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 帖子标题样式 */
.post-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* 帖子元数据样式 */
.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

/* 帖子时间样式 */
.post-time {
  flex-basis: 100%;
  margin-bottom: 5px;
}

/* 帖子热度样式 */
.post-popularity {
  margin-bottom: 5px;
}

/* 帖子描述样式 */
.post-description {
  flex-basis: 100%;
  margin-bottom: 5px;
  color: #444;
}

.post-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

}

/* 帖子标签样式 */
.post-tag {
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  text-transform: uppercase;
  font-size: 12px;
  padding: 2px 4px;
  height: 20px;
}
</style>
