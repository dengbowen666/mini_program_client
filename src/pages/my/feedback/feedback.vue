<template>
  <view class="feedback-container">
    <view class="feedback-item" v-for="(item, index) of aspects" :key="index">
      <text>方面{{ index + 1 }}:</text>
      <view class="star-rating">
        <view class="star" v-for="star in 5" :key="star" :class="{ 'active': stars[index] >= star }"
          @click="setRating(index, star)">
          <uni-icons type="star" color="" size="24" />
        </view>
      </view>
    </view>
    <button @click="submitFeedback">提交</button>
  </view>
</template>

<script setup lang="ts">
import { ref,computed } from 'vue';
import { useUser } from '../../../stores/modules/useUser'
const { userProfile } = useUser()
const { user_id } = userProfile
// 存储每个方面的评分
const stars = ref(new Array(5).fill(0));
const aspects = ref(['方面1', '方面2', '方面3', '方面4', '方面5']);
// 设置评分
const setRating = (index, star) => {
  if (star === stars.value[index]) {
    stars.value[index] = 0;
  } else {
    stars.value[index] = star;
  }

};
const feedbackData = computed(() => aspects.value.map((aspect, index) => ({
  aspect,
  rating: stars.value[index]
})));
// 将方面名称和评分组合成一个对象数组

// 提交反馈
import postFeedback from '../../../API/post/feedback/postFeedback'
const submitFeedback = () => {
  postFeedback({
    user_id,
    feedbackData

  })
  console.log('提交的评分为：', feedbackData);
  // 这里可以添加提交逻辑，比如发送请求到服务器
};
</script>

<style scoped>
.feedback-container {
  display: flex;
  flex-direction: column;

  padding: 20px;
}

.feedback-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;

}

.star-rating {
  display: flex;
}

.star {
  margin-right: 10px;
  cursor: pointer;
}

.star.active {
  color: gold;

  /* 当前选中的星星颜色 */
}

.iconfont {
  font-family: 'iconfont';
  /* 假设这是你的图标字体 */
}
</style>
