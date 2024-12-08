<template>
  <view v-for="(yearComments, year) in comments" :key="year">
    <view class="year">{{ year }}年</view>
    <view class="postItem" v-for="(comment, commentIndex) in yearComments" :key="commentIndex">
      <view class="left">
        <view class="day">{{ comment.postDay }}</view>
        <view class="month">{{ comment.postMonth }}月</view>
      </view>
      <view class="main">
        <view class="title">{{ comment.content }}</view>


      </view>
      <view class="right">
        <view class="status" :class="stateClass(comment.state)">{{ stateTrans(comment.state) }}</view>
        <view class="delete_btn">
          <view><uni-icons type="trash" color="" size="24" @click="deleteComment(comment.commentId)" />
            <uni-icons type="redo" color="" size="24" @click="jumpToArticle(comment.materialId)" />
          </view>
        </view>
      </view>

    </view>

  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useUser } from '@/stores/modules/useUser';
import { getMyComment } from '@/API/get/comment/getMyComment'
const { userProfile } = useUser();
const { user_id } = userProfile;
const pageNumber = ref(1)
const pageSize = ref(10)
onMounted(() => {
  getComments()
})
const comments = ref({})
async function getComments() {
  comments.value = {}
  const res = await getMyComment(

    {
      user_id: user_id,
      pageNumber: pageNumber.value,
      pageSize: pageSize.value
    });
  if (res.code == 1) {
    console.log(res.data.records);

    groupByYear(res.data.records)
  }
  console.log(comments.value);

}
function groupByYear(results: object[]) {

  for (const comment of results) {
    const uploadTime = comment.commentTime;
    // 提取年、月、日、小时、分钟、秒
    const y = uploadTime[0];
    const m = uploadTime[1].toString().padStart(2, '0'); // 确保月份是两位数
    const d = uploadTime[2].toString().padStart(2, '0'); // 确保日期是两位数
    const hours = uploadTime[3].toString().padStart(2, '0'); // 确保小时是两位数
    const minutes = uploadTime[4].toString().padStart(2, '0'); // 确保分钟是两位数
    const seconds = uploadTime[5].toString().padStart(2, '0'); // 确保秒是两位数

    // 格式化为YYYY-MM-DDTHH:mm:ssZ格式
    const formattedTime = `${y}-${m}-${d}T${hours}:${minutes}:${seconds}Z`;
    const date = new Date(formattedTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate() - 1;
    comment.postMonth = convertToChineseNumber(month); // 确保月份是两位数
    comment.postDay = day.toString().padStart(2, "0")
    // 确保日期是两位数
    if (!comments.value[year]) {
      comments.value[year] = []; // 修正这里，确保是通过.value访问和修改ref的值
    }
    comments.value[year].push(comment);
  }
  console.log(comments.value);

}
function convertToChineseNumber(num: number) {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  return chineseNumbers[num];
}
const stateClass = (state: number) => {

  switch (state) {
    case 1:
      return 'status-published';
    case 0:
      return 'status-pending';
    case 2:
      return 'status-rejected';
    default:
  }
}
import deleteMyComment from '@/API/post/deleteMyComment'
const deleteComment = async (commentId: number) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该评论吗？',
    success: async function (res) {
      if (res.confirm) {
        await deleteMyComment({
          commentId: commentId,
          userId: user_id
        })
        getComments()
      }
    }


  })




}
const stateTrans = (state: number) => {
  switch (state) {
    case 1:
      return '已发布';
    case 0:
      return '待审核';
    case 2:
      return '已拒绝';
    default:
  }
}
import { goArticleDetail } from '@/hook/usegoArticleDetail';
const jumpToArticle = (articleId: string) => {
  goArticleDetail(articleId)
}
</script>

<style scoped>
.year {
  padding-left: 30rpx;
  padding-top: 20rpx;
  font-weight: 300;
}

.postItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;

}

.postItem .left {
  width: 100rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.postItem .left .day {
  font-size: 20px;
}

.postItem .left .month {
  font-size: 12px;
  color: #999;
}

.postItem .main {
  flex: 1;
  padding-left: 20rpx;
}

.postItem .main .title {
  margin-top: 3px;
  font-size: 16px;
  font-weight: 500;
  color: #333;


}

.right {

  width: 240rpx;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

}

.status {
  width: 100rpx;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10rpx;
  background-color: #f5f5f5;
  color: #999;
  font-size: 12px;
  margin-left: 10rpx;

}

.status-published {
  background-color: #e0f9d7;
  color: #67c23a;
}

.status-pending {
  background-color: #f9e3a2;
  color: #faad14;
}

.status-rejected {
  background-color: #fde2e2;
  color: #f56c6c;
}
</style>
