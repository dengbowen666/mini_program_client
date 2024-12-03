<template>
   <li><text class="important">公告*</text><text>{{ content }}</text></li>
</template>

<script setup lang="ts">
// 接收props参数
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.important {
  color: yellowgreen;
  margin-right: 10px;
}
</style>
