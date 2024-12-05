<template>
  <view>

    <scroll-view scroll-y scrolltolower="">
      <view v-for="item in fileList" :key="item" @click="openFile(item.localPath)" class="file">
        {{ item.title }}{{ item.fileType }}
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getMyDownloads } from '@/API/get/article/getMyDownloads'
import { useUser } from '@/stores/modules/useUser';
const pageNum = ref(0)
const pageSize = ref(10)
const fileList = ref([])
onMounted(() => {
  updateFilelist()
});
const updateFilelist = () => {
  pageNum.value++
  const user_id = useUser().userProfile.user_id
  getMyDownloads(user_id, pageNum.value, pageSize.value).then(res => {
    console.log(res);
    fileList.value = res.data.records
  })
}
const openFile = (localPath: string) => {
  // 检查文件路径是否有效
  if (!localPath) {
    console.error('文件路径无效');
    return;
  }
  // 使用 wx.openDocument 打开文件
  wx.openDocument({
    showMenu: true, // 是否显示导航栏右上角的菜单按钮
    filePath: localPath, // 文件路径
    success: (res) => {
      console.log('文件打开成功', res);
    },
    fail: (err) => {
      console.error('文件打开失败', err);
    }
  });
};
</script>

<style>
.file{
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  border-bottom: 1rpx solid #ccc;
}
.file:hover{
  background-color: grey;
  cursor: pointer;
  color:#222;
}
</style>
