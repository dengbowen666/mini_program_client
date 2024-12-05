<template>
  <view style="height: 100vh; display: flex; flex-direction: column;position: relative;">


    <view class="search">
      <input placeholder="请输入关键词" class="input" @click="goSearch" />
    </view>
    <view class="announcementDetailContainer" v-show="isShowAnnouncement" @click.stop="isShowAnnouncement = false">
    <view class="announcementDetail">
    {{ announcementDetail }}
    </view>
    </view>
    <ul class="notice">
      <announcement v-for="item in announcements" :key="item" :title="item.title" @showAnnouncement="showAnnouncement(item)"></announcement>
    </ul>

    <ul class="nav">
      <li v-for="(item, index) in navItems" :key="index" :class="{ active: activeIndex === index }" class="nav-item"
        @click="getNavArticles(item.type)">
        {{ item.name }}
      </li>
    </ul>

    <view class="sort">
      <text>看贴排序</text>
      <picker @change="bindPickerChange" :value="index" :range="array">
        <view class="uni-input">{{ array[index] }}</view>
      </picker>
    </view>

    <!-- 滚动区域：帖子列表 -->
    <scroll-view :scroll-y="true" class="scroll-y" @scrolltolower="updatePosts">
      <article_preview v-for="post in posts" :key="post.id" :post="post">
      </article_preview>
    </scroll-view>

  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import announcement from '@/pages/index/find/components/announcement.vue'
import article_preview from '@/pages/index/find/components/article_preview.vue'
import { getArticles } from '@/API/get/article/getArticles'

import { useUser } from '@/stores/modules/useUser'
import addSearchHistory from '@/API/post/history/addSearchHistory'
const userId= useUser().userProfile.user_id
const goSearch = () => {
  uni.navigateTo({
    url: '/pages/index/find/search/search'
  })


}
const announcements = ref(['10月28日更新优化说明', '维护绿色交流环境，严厉打击...', '新版用户协议及隐私政策已更新'])
const navItem = ref('')
const sort = ref('time')
const activeIndex = ref(0) // -1 表示没有任何项目被选中
const getNavArticles = async (itemType: string) => {
  //  reset()
  activeIndex.value = navItems.value.findIndex(item => item.type
    === itemType)
    console.log(activeIndex.value);

  navItem.value = itemType
  const res = await getArticles({
    type: 'nav',
    navName: navItem.value,
    sort: sort.value,
    pageSize: 10,
    page: 1,
    userId:userId
  })
  if (res.code === 1) {
    console.log(res.data)
    posts.value = res.data.records
  }
}
import { getAnnouncement } from '@/API/get/announcement/getAnnouncement'
const getAnnouncementList = async () => {
  const res = await getAnnouncement({
    limit: 3
  })
  if (res.code === 1) {

    announcements.value = res.data
    console.log(announcements.value);

  }
  //done
}
onMounted(() => {
  getNavArticles('recommend')
  getAnnouncementList();
});
const posts = ref([
  { id: 1, title: '微积分速通手册', time: '2024-10-28', popularity: 100000, des: '帮助大一新生速通微积分', tag: ['高数', '大一'] },
  { id: 2, title: '线性代数核心概念', time: '2024-10-27', popularity: 95000, des: '掌握线性代数的核心理论与应用', tag: ['数学', '线性代数'] },
  { id: 3, title: '大学物理实验指南', time: '2024-10-26', popularity: 120000, des: '实验步骤详解与数据分析', tag: ['物理', '实验'] },
  { id: 4, title: '计算机科学入门', time: '2024-10-25', popularity: 80000, des: '从基础到进阶的计算机科学知识', tag: ['计算机', '编程入门'] },
  { id: 5, title: '英语四六级备考资料', time: '2024-10-24', popularity: 150000, des: '全面的英语四六级备考资料与技巧', tag: ['英语', '四六级'] },
  { id: 6, title: '宏观经济学与微观经济学', time: '2024-10-23', popularity: 90000, des: '经济学原理与实际案例分析', tag: ['经济', '经济学原理'] },
  { id: 7, title: '有机化学实验技巧', time: '2024-10-22', popularity: 130000, des: '有机化学实验操作技巧与安全指南', tag: ['化学', '实验技巧'] },
  { id: 8, title: '心理学基础', time: '2024-10-21', popularity: 75000, des: '探索心理学的基本概念和理论', tag: ['心理学', '基础'] },
  // 你可以在这里添加更多的帖子对象
])
const index = ref(0)
const array = ref(['time', 'heat'])
// 排序方式改变时触发
const bindPickerChange = (e) => {
  // 更新索引
  index.value = e.detail.value;

  // 根据索引更新排序方式
  sort.value = array.value[index.value];

  // 根据新的排序方式重新获取导航文章
  getNavArticles(navItems.value[activeIndex.value].type);
};
// done
const navItems = ref([{ name: '推荐', type: 'recommend' }, { name: '官方', type: 'official' }, { name: '全部', type: 'all' }])


const page = ref(1)
const updatePosts = async () => {
  page.value++;
  const res = await getArticles({
    type: 'nav',
    navName: navItem.value,
    sort: sort.value,
    pageSize: 10,
    pageNumber: page.value,
    userId:userId
  });

  if (res.code === 1) {
    // 将新加载的帖子追加到现有的 posts 中
    posts.value = [...posts.value, ...res.data];
  }
}
const isShowAnnouncement = ref(false)
const announcementDetail = ref({})
import {getAnnouncementDetail} from '@/API/get/announcement/getAnnouncementDetail'
const showAnnouncement = async(item) => {

  const res = await getAnnouncementDetail(item.announcementId)
  console.log(res);

  if (res.code === 1) {
    isShowAnnouncement.value = true
    announcementDetail.value = res.data

  }
}
</script>

<style>
/* 排序选择器样式 */

/* 外部容器，使用 flex 布局 */
.view {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 搜索框样式 */
.search {
  padding: 10px;
  background-color: #d7eeec;
  display: flex;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input {
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  flex-grow: 1;
  border-radius: 5px;
  background-color: #eee5e5;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s, background-color 0.3s;
}

.input:focus {
  border-color: #007bff;
  background-color: #fff;
}

/* 公告部分样式 */
.notice {
  background-color: #d7eeec;
  padding: 10px 0px 20px 20px;

  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}



/* 导航部分样式 */
.nav {
  width: 100%;
  display: flex;
  justify-content: space-around;

  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-item {
  padding: 10px;
  text-align: center;
  color: #666;
}

.nav li:hover {
  background-color: #eaeaea;
}

.active {

  color: #222;
  border-bottom: #222  2px solid;
}

/* 排序部分样式 */
.sort {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px;
color:grey;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 帖子内容的滚动区域 */
.scroll-y {
  flex-grow: 1;
  /* 让它占据剩余空间 */
  overflow-y: auto;
  /* 确保可以滚动 */
  padding: 10px;
  background-color: #f8f8f8;
}

/* 内容区（帖子）样式 */
.content {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.announcementDetailContainer{
  width: 100%;
  height: 100%;
  position: fixed;
  /* 最上层显示 */
  z-index: 9999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.announcementDetail{
  width: 80%;
  height: 60%;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}



</style>
