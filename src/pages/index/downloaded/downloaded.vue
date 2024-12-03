<template>
	<view>
		<view>我的下载</view>
    <scroll-view scroll-y scrolltolower="">

    </scroll-view>
	</view>
</template>

<script setup lang="ts">
import { onMounted,ref } from 'vue';
import { getMyDownloads } from '@/API/get/article/getMyDownloads'
import { useUser } from '@/stores/modules/useUser';
const pageNum = ref(1)
const pageSize = ref(10)
const fileList= ref([])
onMounted(() => {
  const user_id= useUser().userProfile.user_id
  getMyDownloads(user_id, 1, 10).then(res => {
  console.log(res);
  fileList.value = res.data
})
});
</script>

<style>

</style>
