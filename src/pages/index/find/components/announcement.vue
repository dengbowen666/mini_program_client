<template>
   <li @click="showAnnouncement"><text class="important" >公告 .</text><text class="title">{{ title }}</text></li>
</template>

<script setup lang="ts">
// 接收props参数
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
// 触发自定义事件
const emit = defineEmits(['showAnnouncement'])
const showAnnouncement = () => {
  emit('showAnnouncement')
}
</script>

<style scoped>
.important {
  color: orange;
  margin-right: 10px;
}

.title{
  color: #222;
  font-size: 14px;
}
</style>
