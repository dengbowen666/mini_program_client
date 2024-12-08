<template>
  <div class="article-container">
    <div class="article-header">
      <div class="title">{{ articleDetail.title }}</div>
      <div class="meta">
        <p>
          <span class="publish-time">发表时间：{{ transformTime(articleDetail.publish_time) }}</span>
        </p>

        <p>
          <span class="author-name">作者：{{ articleDetail.author.name }} 来自于：




          </span>
        </p>
        <p>
          标签:<span v-for="tag in articleDetail.tags" :key="tag" class="tag">{{ tag }}</span>
        </p>
      </div>
    </div>

    <div class="article-content">
      <p>{{ articleDetail.description }}</p>
      <div class="file">
        <view class="primary-btn" @click="handlePreview">点击预览</view>
        <div class="button-group">
          <view>
            <button class="success-btn operate" @click="handleDownload" v-if="articleDetail.status == 1"><uni-icons
                type="download" color="" size="24" />下载</button>
            <view class="" v-if="articleDetail.status == 3">已下载</view>
            <view class="" v-if="articleDetail.status == 2">仅阅读</view>
          </view>
          <view>
            <button v-if="!articleDetail.isStar" class="warning-btn operate" @click="handleFavorite">
              <uni-icons type="star" color="" size="24" /> 收藏</button>
            <button v-else class="warning-btn operate" @click="handleCancelFavorite">
              <uni-icons type="star-filled" color="" size="24" />
              收藏
            </button>
          </view>
        </div>
      </div>
    </div>

    <scroll-view class="comment-section scroll-y" :scroll-y="true" @scrolltolower="updateComments">
      <div class="comment-title">
        <div>评论区</div>
        <div class="add-comment-btn" @click="handleAddComment">+</div>
        <div v-if="showAddCommentPopup" class="add-comment-popup-overlay" @click="showAddCommentPopup = false">
          <div class="add-comment-popup-content" @click.stop>
            <div class="add-comment-popup-title">添加评论</div>
            <textarea v-model="newCommentContent" class="comment-textarea" placeholder="请输入评论内容"></textarea>
            <button class="submit-comment-btn" @click="handleSubmitComment">提交</button>
          </div>
        </div>

      </div>
      <ul>
        <li v-for="item in commentList" :key="item.commentId" class="comment-item">
          <div class="comment-content">{{ item.content }}</div>
          <div class="comment-meta">
            <span class="username">{{ item.author.name }}</span>
            <span class="time">{{ transformTime(item.time) }}</span>
          </div>
        </li>
      </ul>
    </scroll-view>
  </div>

  <!-- 收藏夹弹出框 -->
  <div v-if="showFavoritePopup" class="favorite-popup-overlay" @click="showFavoritePopup = false">
    <div class="favorite-popup-content" @click.stop>
      <div class="favorite-popup-title">收藏夹</div>
      <ul>
        <li @click="handleAddToFavorite(item.directoryId)" v-for="item in favoritesList" :key="item.directoryId"
          class="favorite-item">
          <span>{{ item.directoryName }}</span>

        </li>
      </ul>
      <div class="new-folder"><input type="text" v-model="newFavoriteName" placeholder="新建收藏夹" /> <button
          class="create-folder-btn" @click="handleAddnewFavorite">+</button></div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getArticleDetail } from '@/API/get/article/getArticleDetail';
import { getComment } from '@/API/get/comment/getComment';
import getMyFavorites from '@/API/get/star/getMyFavorites';
import postStar from '@/API/post/favorites/postStar';

import makeFavorites from '@/API/post/favorites/makeFavorites';
import { useUser } from '@/stores';
const { userProfile } = useUser();
const { user_id } = userProfile;
const articleDetail = ref({
  title: '',
  publishTime: '',
  author: {
    name: '',
    avatar: '',
    user_id: '',
  },
  description: '',
  file_url: '',
  tags: [],
  status: 0,
  isStar: false,
});

const commentList = ref([

]);

const showFavoritePopup = ref(false);
const favoritesList = ref([]);



const handleDownload = () => {
  uni.downloadFile({
    url: articleDetail.value.file_url,
    success: (res) => {
      if (res.statusCode === 200) {
        const tempFilePath = res.tempFilePath;
        uni.saveFile({
          tempFilePath,
          success: (saveRes) => {
            const savedFilePath = saveRes.savedFilePath;
            console.log('savedFilePath:', savedFilePath);

            // 调用后端接口，记录下载行为
            postDownload(savedFilePath, articleId.value, user_id)


          },
          fail: (err) => {
            uni.showToast({
              title: '下载失败',
              icon: 'error',
            });
          },
        });
      }
    },
    fail: (err) => {
      uni.showToast({
        title: '下载失败',
        icon: 'error',
      });
    },
  });
};

const postDownload = (filePath, articleId, userId) => {
  // 这里使用uni.request或其他HTTP库发送请求到你的后端API
  uni.request({
    url: '/api/download/uploadDownloads', // 替换成你的后端接口地址
    method: 'POST',
    data: {
      localPath: filePath,
      materialId: articleId,
      userId: userId,
    },
    success: (res) => {
      if (res) {
        uni.showToast({
          title: '下载成功',
          icon: 'success',
        });
      } else {
        uni.showToast({

          title: '下载失败',
          icon: 'error',

        })

      }
    },
    fail: (err) => {
      console.error('请求失败', err);
      uni.showModal({
        title: '提示',
        content: '文件下载失败，请稍后再试',
        showCancel: false,
      });
    },
  });
};



const handlePreview = () => {
  const fileUrl = articleDetail.value.file_url;
  console.log(fileUrl);

  // 检查是否是PDF文件
  if (fileUrl) {

    uni.downloadFile({
      url: fileUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          uni.openDocument({
            filePath: res.tempFilePath,
            success: (res) => {
              console.log('打开文档成功');
            },
            fail: (err) => {
              console.error('打开文档失败', err);
            }
          });
        }
      },
      fail: (err) => {
        uni.showModal({
          title: '提示',
          content: '文件预览失败，请稍后重试',
          showCancel: false,
        });
        console.error('下载文件失败', err);
      }
    });
  } else {
    // 其他文件类型处理
    uni.showToast({
      title: '不支持预览',
      icon: 'none',
    });
  }
};

const handleFavorite = () => {
  showFavoritePopup.value = true;
  getFolders();
};

const getFolders = async () => {
  uni.showLoading({
    title: '加载中',

  })
  const res = await getMyFavorites({ favoritesId: 0, userId: user_id, pageSize: 10, pageNumber: 1 });
  if (res) {
    favoritesList.value = res.data.records;
    uni.hideLoading();
    console.log(res);

  } else {

    console.log('获取收藏夹失败');

  }
};

const handleAddToFavorite = async (favorites_id) => {

  const confirmed = await new Promise((resolve, reject) => {
    uni.showModal({
      title: '提示',
      content: '确定要将文章添加到该收藏夹吗？',
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: () => {
        reject(new Error('Modal show failed'));
      }
    });
  });

  if (confirmed) {
    // 用户点击了确定按钮
    const res = await postStar({ article_id: Number(articleId.value), favorites_id, type: "star", user_id: user_id });
    if (res.code === 1) {

      uni.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      });
      showFavoritePopup.value = false;
      const detailres = await getArticleDetail(articleId.value, user_id);
      if (detailres.code === 1) {
        console.log(detailres.data);

        articleDetail.value = detailres.data;

        if (detailres.data.downloaded == 1) {
          articleDetail.value.status = 3

        }
        else if (detailres.data.downloaded == 0 && detailres.data.limit == "downLoad") {
          articleDetail.value.status = 1

        }
        else if (detailres.data.downloaded == 0 && detailres.data.limit == "read") {
          articleDetail.value.status = 2
        }
        if (detailres.data.stared == 1) {
          articleDetail.value.isStar = true;
        } else {
          articleDetail.value.isStar = false;
        }
      }

    } else {
      // 使用uni.showToast代替window.alert
      uni.showToast({
        title: '添加失败',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    // 用户点击了取消按钮或关闭了模态框
    // 在这里执行取消操作的逻辑，例如记录日志、更新状态等
    console.log('用户取消了操作');
  }
};
const newFavoriteName = ref('');
const handleAddnewFavorite = async () => {

  if (newFavoriteName.value != '') {
    if (newFavoriteName.value.length > 10) {
      uni.showToast({
        title: '收藏夹名称≤10字',
        icon: 'none'
      })
      return
    }
    const res = await makeFavorites({ user_id: user_id, folder_name: newFavoriteName.value });
    if (res.code === 1) {
      uni.showToast({
        title: '添加成功'

      })
      newFavoriteName.value = '';
      getFolders();
    }
  }
  else {
    uni.showToast({
      title: '请输入收藏夹名称',
      icon: 'none'

    })
  }
};
const articleId = ref(0);
import { onLoad } from '@dcloudio/uni-app';
import addViewHistory from '@/API/post/addViewHistory'
onLoad(async (Option) => {// 获取路由传过来的文章ID

  articleId.value = Option.article_id;



  try {
    updateComments();
    const detailres = await getArticleDetail(articleId.value, user_id);
    if (detailres.code === 1) {
      console.log(detailres.data);

      articleDetail.value = detailres.data;

      if (detailres.data.downloaded == 1) {
        articleDetail.value.status = 3

      }
      else if (detailres.data.downloaded == 0 && detailres.data.limit == "downLoad") {
        articleDetail.value.status = 1

      }
      else if (detailres.data.downloaded == 0 && detailres.data.limit == "read") {
        articleDetail.value.status = 2
      }
      if (detailres.data.stared == 1) {
        articleDetail.value.isStar = true;
      } else {
        articleDetail.value.isStar = false;
      }



      const addHistoryRes = await addViewHistory({ article_id: articleId.value, user_id: user_id });
      if (addHistoryRes.code === 1) {
        console.log('浏览记录添加成功');
      } else {
        console.log('浏览记录添加失败');
      }
    } else {

    }

  } catch (error) {
    console.error(error);
  }

})


const pageNumber = ref(0);


const updateComments = async () => {
  pageNumber.value++
  const res = await getComment({ article_id: articleId.value, pageSize: 4, pageNumber: pageNumber.value });
  console.log(res.data.records);

  commentList.value = [...commentList.value, ...res.data.records];
}
const showAddCommentPopup = ref(false);
const newCommentContent = ref('');
const handleAddComment = () => {
  showAddCommentPopup.value = true;
}
import postComment from '@/API/post/postComment';

const handleSubmitComment = async () => {
  if (newCommentContent.value.trim() === '') {
    // window.alert('评论内容不能为空');
    uni.showToast({

      title: '评论内容不能为空',
      icon: 'none',
    })
    return;
  }
  console.log(articleId.value);

  postComment({ article_id: articleId.value, comment_content: newCommentContent.value, publish_time: new Date(), userId: user_id }).then(async (res) => {
    if (res.code === 1) {
      newCommentContent.value = '';
      showAddCommentPopup.value = false;
      uni.showToast({
        title: '评论成功,审核中',
        icon: 'success',
        mask: true
      })
      // 重新获取评论列表
      pageNumber.value = 0; // 重置页码
      const res = await getComment({ article_id: articleId.value, pageSize: 4, pageNumber: pageNumber.value });
      commentList.value = res.data;
    }
    else {
      uni.showToast({
        title: '评论失败',
        icon: 'none'
      })
      showAddCommentPopup.value = false;
    }
  })



};
const transformTime = (timeArray: Array<number>) => {
  const year = timeArray[0];
  const month = timeArray[1] - 1; // 月份从0开始，所以需要减1
  const day = timeArray[2];
  const hours = timeArray[3];
  const minutes = timeArray[4];
  const seconds = timeArray[5];
  // 创建一个Date对象
  const date = new Date(year, month, day, hours, minutes, seconds);

  // 格式化日期和时间
  const formattedDate = date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',

  });
  return formattedDate;
}


const handleCancelFavorite = () => {
  uni.showModal({
    title: '取消收藏',
    content: '确定要取消收藏这篇文章吗？',
    success: (res) => {
      if (res.confirm) {
        // 用户点击了确定按钮
        postStar({ article_id: Number(articleId.value), user_id: user_id, type: "cancel", favorites_id: 0 }).then((res) => {
          if (res.code === 1) {
            articleDetail.value.isStar = false;
            uni.showToast({
              title: '取消收藏成功',
              icon: 'success',
              mask: true
            })
          } else {
            uni.showToast(
              {
                title: '取消收藏失败',
                icon: 'none',
                mask: true
              }
            )
          }
        })
      } else if (res.cancel) {
        // 用户点击了取消按钮
        console.log('用户点击了取消按钮');
      }
    }
  })
}
</script>

<style scoped>
.article-container {
  padding: 20px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.article-header {
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.meta {
  font-size: 14px;
  color: #888;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 10px;
}

.publish-time,
.author-name {
  color: #999;
}

.tag {
  background-color: #e0e0e0;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 15px;
  color: #4a90e2;
}

.article-content {

  margin-bottom: 40px;
}

.file {
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
}

.primary-btn {
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  margin: 10px 0px;
}

.primary-btn {
  background-color: #4a90e2;
  color: white;
}

.success-btn {

  color: #222;
}

.warning-btn {

  color: #222;
  padding: 0;
  display: flex;
  align-items: center;
  padding: 0px 5px;
}

.primary-btn:hover,
.success-btn:hover,
.warning-btn:hover {
  opacity: 0.8;
}

.comment-section {

  flex-grow: 1;
  overflow: auto;
  border-top: 1px solid #33333322;
  padding-top: 10px;
}

.comment-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-comment-btn {
  background-color: #4a90e2;
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 50%;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}

.add-comment-btn:hover {
  background-color: #3578b6;
}

ul {
  list-style-type: none;
  padding: 0;
}

.comment-item {
  background-color: #fff;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.comment-item:hover {
  background-color: #f7f7f7;
}

.comment-item .comment-meta {
  color: #888;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
}

.favorite-popup-overlay,
.add-comment-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.favorite-popup-content,
.add-comment-popup-content {
  width: 300px;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.favorite-popup-title,
.add-comment-popup-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}


.comment-content {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f7f7f7;
  border-radius: 8px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ccc;

}

.comment-textarea {

  width: 250px;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.new-folder {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.new-folder input {
  border: 1px solid #e0e0e0;
  border-radius: 5px;

}

.create-folder-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-folder-btn:hover {
  background-color: #3578b6;
}
</style>
