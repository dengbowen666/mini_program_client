<template>
  <view class="container">
    <input type="text" class="input" placeholder="请输入完整标题(1-20字)" v-model="title" />
    <view class="uni-padding-wrap">
      <textarea placeholder="请输入描述(50字以内)" rows="4" v-model="desc"></textarea>
    </view>

    <view class="tags-container">
      <text>标签：</text>
      <view v-for="tag in tags" :key="tag" class="tag" @click="tag.isDel = true">{{ tag.tagname }}<text v-show="tag.isDel"
          class="delete" @click="tags.splice(tags.indexOf(tag), 1)">x</text></view>
      <view class="addBtn" v-show="isAdd && tags.length < 3" @click="toggleAddTag">+</view>
      <input v-show="!isAdd" type="text" class="input-tag" v-model="tag" @confirm="addTag" />
    </view>
    <text>文件上传：<text style="color: #007aff; font-size: 20rpx; margin-left: 10rpx;">(只允许上传一个word或pdf格式文件)</text></text>
    <view class="file-upload">
      <img @click="chooseFile" src="../../../static/images/upload.png" alt="">
    </view>
    <view style="font-size: 24rpx; margin: 20rpx 10rpx 10rpx 0f7f7f7; color: #007aff" v-show="filename">{{ filename
    }}<uni-icons @click="cancelFile()" type="close" color="black" size="12" /></view>
    <!-- 权限设置 -->
    <view class="limit">
      <text>权限设置：</text>
      <radio-group @change="chang">
        <label v-for="item in radioGroup" :key="item">
          <radio :value="item" :checked="item == activeRadio" color="#007aff" style="transform: scale(0.7);" /><text
            style="font-size: 20rpx;">{{ item }}</text>
        </label>
      </radio-group>
    </view>

    <!-- 提交按钮 -->
    <button class="submit-button" @click="post">提交</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const title = ref('');
const desc = ref('');
const tags = ref([]);
const isAdd = ref(true);
const tag = ref('');

const addTag = () => {
  if (tag.value.trim()) {
    if (tag.value.length > 5) {
      uni.showToast({

        title: '标签长度≤5字',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (tags.value.some(item => item.tagname === tag.value)) {
      uni.showToast({

        title: '标签已存在',
        icon: 'none',
        duration: 2000
      })
      tag.value = '';
      return
    }



    tags.value.push({ tagname: tag.value, isDel: false });
    tag.value = '';
    isAdd.value = true;
  }
};
const toggleAddTag = () => {
  isAdd.value = !isAdd.value;
};
const radioGroup = ref(['仅查看', '供下载']);
const activeRadio = ref('');
const chang = (e) => {
  activeRadio.value = e.detail.value
}
const filename = ref('');
const tempFilePath = ref('');
const chooseFile = () => {
  if (tempFilePath.value) {
    uni.showToast({

      title: '只能上传一个文件',
      icon: 'none',
      duration: 2000
    })
    return;
  }
  uni.chooseMessageFile({
    count: 1,
    success: function (res) {
      // 判断文件后缀，只能是pdf,word
      const fileExt = res.tempFiles[0].name.split('.').pop().toLowerCase();
      if (fileExt !== 'pdf' && fileExt !== 'doc' && fileExt !== 'docx') {
        uni.showToast({
          title: '只能上传pdf或word文件',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      tempFilePath.value = res.tempFiles[0].path; // 获取到的文件路径
      console.log(res);
      filename.value = res.tempFiles[0].name; // 获取到的文件名

    }
  });
}


import postArticle from '@/API/post/postArticle'
const post = async () => {
  if (title.value.length < 1 || title.value.length > 20) {
    uni.showToast({
      title: '标题长度为1-20字',
      icon: 'error',
      duration: 2000
    })
    return
  }
  if (desc.value.length > 50) {
    uni.showToast({
      title: '描述长度≤50字',
      icon: 'error',
      duration: 2000
    })
    return
  }
  if (tags.value.length > 3) {

    uni.showToast({
      title: '标签最多3个',
      icon: 'error',
      duration: 2000
    })
    return
  }


  const articleDetail = ref({ title: title.value, desc: desc.value, tags: tags.value.map(tag => tag.tagname), limit: activeRadio.value });
  //除非是用计算属性，不然articleDetail一开始就定了
  console.log(articleDetail.value);
  if (checkArticleDetail(articleDetail.value) == 1) {
    try {
      const result = await postArticle(tempFilePath.value, articleDetail.value);

      uni.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 2000
      })
      // 清空
      title.value = '';
      desc.value = '';
      tags.value = [];
      tag.value = '';
      activeRadio.value = '';
      tempFilePath.value = '';
      filename.value = '';
      uni.navigateTo({
        url: '/pages/index/index'
      })

      console.log(result);
    }
    catch (error) {
      uni.showToast({
        title: '上传失败',
        icon: 'error',
        duration: 2000
      })
    }
  }
  else {
    console.log('数据不完整');
  }
}
const checkArticleDetail = (articleDetail) => {
  if (!articleDetail.title) {
    uni.showToast({
      title: '请输入标题',
      icon: 'error',
      duration: 2000
    })
    return 0;
  }
  if (!articleDetail.desc) {
    uni.showToast({
      title: '请输入描述',
      icon: 'error',
      duration: 2000
    })
    return 0;
  }
  if (!articleDetail.tags.length) {
    uni.showToast({
      title: '请输入标签',
      icon: 'error',
      duration: 2000
    })
    return 0;
  }
  if (!articleDetail.limit) {
    uni.showToast({
      title: '请选择权限',
      icon: 'error',
      duration: 2000
    })
    return 0;
  }
  if (!tempFilePath.value) {
    uni.showToast({
      title: '请选择文件',
      icon: 'error',
      duration: 2000
    })
    return 0;
  }
  return 1;

}
const cancelFile = () => {
  // 提示是否要删除当前文件
  uni.showModal({
    title: '提示',
    content: '确定要取消当前文件吗？',
    success: function (res) {
      if (res.confirm) {
        tempFilePath.value = '';
        filename.value = '';
      }

    }
  });
}



</script>

<style>
.container {
  padding: 20rpx;
  background-color: #ccc;
  min-height: 100vh;
}

.input {

  height: 80rpx;
  border-bottom: #c0b8b860 solid 1rpx;
}

textarea {
  border-bottom: #c0b8b860 solid 1rpx;
  width: 100%;
  padding: 10rpx 0rpx;

  border-radius: 5rpx;
  resize: none;
  /* 禁止调整大小 */
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10rpx;
  height: fit-content;
  justify-content: flex-start;
  align-items: center;


}

.addBtn {
  margin-left: 10rpx;
  border: #007aff solid 1rpx;
  background-color: #007aff;
  color: white;
  border-radius: 50%;
  width: 30rpx;
  line-height: 25rpx;
  font-size: 30rpx;
  text-align: center;
  height: 30rpx;

}

.input-tag,
.tag {
  line-height: 40rpx;
  height: 40rpx;
  background-color: #d3d0d0;
  font-size: 20rpx;
  border-radius: 5rpx;
  padding: 0 10rpx;
  margin-left: 10rpx;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease forwards;

}

.tags-container {
  border-bottom: #c0b8b860 solid 1rpx;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.input-tag {
  width: 100rpx;
}

.delete {
  margin-left: 10rpx;
  border-radius: 50%;
  background-color: #fbfbfb;
  width: 40rpx;
  height: 30rpx;
  line-height: 30rpx;
  text-align: center;
  color: #222;
  padding: 0;
  font-weight: bold;
}


.submit-button {
  background-color: #007aff;
  color: white;
  border: none;
}


.file-upload {
  width: 100rpx;
  height: 100rpx;
  background-color: #007aff;

  display: flex;
  align-items: center;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.limit {
  margin-top: 20rpx;
}

.limit radio-group {
  display: flex;
  margin-top: 20rpx;
  margin-bottom: 20rpx;

}

.limit radio-label {
  margin-right: 20rpx;
}
</style>
