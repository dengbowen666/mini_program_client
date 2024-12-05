<template>
  <view v-for="(yearPosts, year) in postsResult" :key="year">
    <view class="year">{{ year }}年</view>
    <view class="view-item" v-for="(view, viewIndex) in yearPosts" :key="view.article_id">
      <view class="left">
        <view class="day">{{ view.postDay }}</view>
        <view class="month">{{ view.postMonth }}月</view>
      </view>
      <view class="main" @click="goArticleDetail(view.id)">
        <view class="title">{{ view.title }}</view>
        <view class="description">{{ view.description }}</view>
      </view>
      <view class="right">
        <view class="status" :class="statusClass(view.pending)">{{ view.pending }}</view>
        <view class="set">
          <view class="uni-list">
            <view class="uni-list-cell">
              <view class="uni-list-cell-db">
                <picker mode="selector" @change="bindPickerChange(viewIndex, year, $event)"
                  :value="array.findIndex((item) => item === view.competence)" :range="array">
                  <view class="uni-input">{{ array.find((item) => item === view.competence) || '请选择' }}</view>
                </picker>
              </view>
            </view>
          </view>
          <view @click="deleteAtc(view.id)" class="delete_btn">
            <view><uni-icons type="trash" color="" size="16" /></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">

import { onMounted } from 'vue';
import { ref } from 'vue';

const posts = ref([{
  article_id: '1',
  viewTime: '2024-03-15T08:00:00Z',
  title: '文章1',
  description: '这是文章1的描述'
},
{
  article_id: '2',
  viewTime: '2024-03-16T09:00:00Z',
  title: '文章2',
  description: '大倒苦水艰苦拉萨解放咔叽饭卡减肥咖啡就的方法烦烦烦说法'
},
{
  article_id: '3',
  viewTime: '2024-04-01T10:00:00Z',
  title: '文章3'
},
]);
const postsResult = ref({});
import { useUser } from '@/stores/modules/useUser';

import { getMyPublishedArticles } from '@/API/get/article/getMyPublishedArticles';
const { userProfile } = useUser();
const { user_id } = userProfile;
async function getPosts() {
  postsResult.value = {};
  const res = await getMyPublishedArticles({
    sort: 'time',
    userId: user_id,
    page: pageNumber.value,
    pageSize: 10
  });
  if (res.code == 1) {

    groupByYear(res.data.records);
  } else {
    wx.showToast({
      title: res.msg,
      icon: 'error',
      duration: 2000
    });
  }
}
// 分组函数
function groupByYear(articles: object[]) {

  for (const article of articles) {
    const uploadTime = article.uploadTime;
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
    const day = date.getDate();
    article.postMonth = convertToChineseNumber(month); // 确保月份是两位数
    article.postDay = day.toString().padStart(2, "0")
    // 确保日期是两位数
    if (!postsResult.value[year]) {
      postsResult.value[year] = []; // 修正这里，确保是通过.value访问和修改ref的值
    }
    postsResult.value[year].push(article);
  }
  console.log(postsResult.value);

}
function convertToChineseNumber(num: number) {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  return chineseNumbers[num];
}
const pageNumber = ref(1);
// 调用获取视图历史的函数
onMounted(() => {
  getPosts();
});
// uni.onReachBottom(() => {
//  pageNumber.value++
//   getposts();
// })
const index = ref(0);
const array = ['仅阅读', '可下载'];
function bindPickerChange(viewIndex, year, e) {
  const newCompetence = array[e.detail.value];
  const yearPosts = postsResult.value[year];
  const view = yearPosts[viewIndex];
  view.competence = newCompetence;
  // 保存到后端
  update(view.id, newCompetence);
}
import { changeCompetence } from '@/API/get/article/changeCompetence'
async function update(articleId, competence) {
  try {
    const res = await changeCompetence(articleId, competence);
    if (res.code === 1) {
      // 更新成功
      wx.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 2000
      });
    } else {
      // 更新失败
      wx.showToast({
        title: res.msg,
        icon: 'error',
        duration: 2000
      });
    }
  } catch (err) {
    // 处理错误
    wx.showToast({
      title: '更新失败',
      icon: 'error',
      duration: 2000
    });
  }
}

import deleteArticle from '@/API/post/deleteArticle'
import { goArticleDetail } from '@/hook/usegoArticleDetail';
const deleteAtc = (article_id: string) => {
  // 确认是否删除提示
  uni.showModal({
    title: '提示',
    content: '确定要删除这篇文章吗？',
    success(res) {
      if (res.confirm) {
        // 调用删除文章的API
        //删除文章
        deleteArticle({
          articleId: article_id,
          userId: user_id,
        }).then((res) => {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          // 删除成功后刷新页面
          getPosts();
        }).catch((err) => {
          wx.showToast({
            title: '删除失败',
            icon: 'error',
            duration: 2000
          })
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}


const statusClass = (pending) => {
  switch (pending) {
    case '已发布':
      return 'status-published';
    case '待审核':
      return 'status-pending';
    case '未通过':
      return 'status-rejected';
    default:
      return '';
  }
};
</script>

<style>
.year {
  padding-left: 30rpx;
  padding-top: 20rpx;
  font-weight: 300;
}

.view-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;

}

.view-item .left {
  width: 100rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.view-item .left .day {
  font-size: 20px;
}

.view-item .left .month {
  font-size: 12px;
  color: #999;
}

.view-item .main {
  flex: 1;
  padding-left: 20rpx;
}

.view-item .main .title {
  margin-top: 3px;
  font-size: 16px;
  font-weight: 500;
  color: #333;


}

.view-item .main .description {
  width: 300rpx;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

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

.set {
  height: 100%;
  display: flex;
  line-height: 20px;
  font-size: 20rpx;

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

.uni-input {

  height: 100%;
  color: #333;
  background: #67c23a;
  padding: 0px 5px;
  border-radius: 5px;
  margin: 0px 5px;
  font-size: 10px;
}
</style>
