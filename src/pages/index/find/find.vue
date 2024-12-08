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
      <announcement v-for="item in announcements" :key="item" :title="item.title"
        @showAnnouncement="showAnnouncement(item)"></announcement>
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

const goSearch = () => {
  uni.navigateTo({
    url: '/pages/index/find/search/search'
  })


}
const announcements = ref([])
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
    pageNumber: 1,
    userId: useUser().userProfile.user_id
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
    userId: useUser().userProfile.user_id
  });

  if (res.code === 1) {
    // 将新加载的帖子追加到现有的 posts 中
    posts.value = [...posts.value, ...res.data.records];
  }
}
const isShowAnnouncement = ref(false)
const announcementDetail = ref({})
import { getAnnouncementDetail } from '@/API/get/announcement/getAnnouncementDetail'
const showAnnouncement = async (item) => {

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
  border-bottom: #222 2px solid;
}

/* 排序部分样式 */
.sort {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px;
  color: grey;
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

.announcementDetailContainer {
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

.announcementDetail {
  width: 80%;
  height: 60%;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
