<template>
  <view>
    <view v-for="(yearViews, year) in viewsResult" :key="year">
      <view class="year">{{ year }}年</view>
      <view class="view-item" v-for="view in yearViews" :key="view.article_id">
        <view class="left">
          <view class="day">{{ view.viewDay }}</view>
          <view class="month">{{ view.viewMonth }}月</view>

        </view>
        <view class="main " @click="goArticleDetail(view.article_id)">
          <view class="title">{{ view.title }}</view>
          <view class="description">{{ view.description }}</view>
        </view>
        <view class="right">



          <view class="set">

            <view class="uni-list">
              <view class="uni-list-cell">

                <view class="uni-list-cell-db">
                  <picker @change="bindPickerChange" :value="index" :range="array">
                    <view class="uni-input">{{ array[index] }}</view>
                  </picker>
                </view>
              </view>
            </view>
            <view @click="deleteAtc(view.article_id)" class="delete_btn">
              <view> <uni-icons type="trash" color="" size="16" /></view>
            </view>

          </view>
          <!-- 其他文章信息 -->
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">

import { onMounted } from 'vue';
import { ref } from 'vue';

const views = ref([{
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
{
  article_id: '4',
  viewTime: '2024-04-15T11:00:00Z',
  title: '文章4'
},
{
  article_id: '5',
  viewTime: '2023-12-25T12:00:00Z',
  title: '文章5'
}]);
const viewsResult = ref({});
import { useUser } from '@/stores/modules/useUser';
const { userProfile } = useUser();
const { user_id } = userProfile;
import { getMyPublishedArticles } from '@/API/get/article/getMyPublishedArticles';
const getViews = async () => {
  // const res= await getMyPublished(
  //     {
  //       user_id: user_id,
  //       pageNumber:pageNumber.value,
  //       pageSize: 10
  //   }
  // );
  //   if (res.code == 200) {
  //     views.value = res.data.articles

  groupByYear(views.value);
  //   }else {
  // wx.showToast({
  //   title: res.msg,
  //   icon: 'error',
  //   duration: 2000
  // })

  //   }
}

// 分组函数
function groupByYear(articles: object[]) {
  for (const article of articles) {
    const date = new Date(article.viewTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    article.viewMonth = convertToChineseNumber(month); // 确保月份是两位数
    article.viewDay = day.toString().padStart(2, "0")
    // 确保日期是两位数
    if (!viewsResult.value[year]) {
      viewsResult.value[year] = []; // 修正这里，确保是通过.value访问和修改ref的值
    }
    viewsResult.value[year].push(article);
  }
  console.log(viewsResult.value);

}
function convertToChineseNumber(num: number) {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  return chineseNumbers[num];
}
const pageNumber = ref(1);
// 调用获取视图历史的函数
onMounted(() => {
  getViews();
});
// uni.onReachBottom(() => {
//  pageNumber.value++
//   getViews();
// })
const index = ref(0);
const array = ['仅阅读', '可下载'];
function bindPickerChange(e) {

  index.value = e.detail.value
}
import deleteArticle from '@/API/post/deleteArticle'
import { goArticleDetail } from '@/hook/usegoArticleDetail';
const deleteAtc = (article_id: string) => {

  //删除文章
  deleteArticle({
    article_id: article_id,
    user_article_id: user_id,
  }).then((res) => {
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
    })
    // 删除成功后刷新页面
    getViews();
  }).catch((err) => {
    wx.showToast({
      title: '删除失败',
      icon: 'error',
      duration: 2000
    })
  })


}
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

  width: 100rpx;
  height: 20px;

}

.set {
  height: 100%;
  display: flex;
  line-height: 20px;
  font-size: 20rpx;

}
</style>
