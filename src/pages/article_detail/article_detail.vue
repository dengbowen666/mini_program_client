<template>
  <div class="article-container">
    <div class="article-header">
      <div class="title">题目：{{ articleDetail.title }}</div>
      <div class="meta">
        <p>
          <span class="publish-time">发表时间：{{ articleDetail.publishTime }}</span>
        </p>
        <p>
          <span class="author-name">作者：<view>{{ articleDetail.author.avatar }}</view>
            <view>{{ articleDetail.author.name }}</view>


          </span>
        </p>
      </div>
    </div>

    <div class="article-content">
      <div class="desc">{{ articleDetail }}</div>
      <div class="file">
        <view class="primary-btn" @click="handlePreview">点击预览</view>
        <div class="button-group">
          <button class="success-btn operate" @click="handleDownload"><uni-icons type="download" color=""
              size="24" />下载</button>
          <button class="warning-btn operate" @click="handleFavorite">
            <uni-icons type="star" color="" size="24" /> 收藏</button>
        </div>
      </div>
    </div>

    <scroll-view class="comment-section scroll-y" :scroll-y="true" @scrolltolower="updateComments">
      <div class="comment-title">
        <div>评论区</div>
        <button class="add-comment-btn" @click="handleAddComment">+</button>
        <div v-if="showAddCommentPopup" class="add-comment-popup-overlay" @click="showAddCommentPopup = false">
          <div class="add-comment-popup-content" @click.stop>
            <div class="add-comment-popup-title">添加评论</div>
            <textarea v-model="newCommentContent" class="comment-textarea" placeholder="请输入评论内容"></textarea>
            <button class="submit-comment-btn" @click="handleSubmitComment">提交</button>
          </div>
        </div>

      </div>
      <ul>
        <li v-for="item in commentList" :key="item.comment_id" class="comment-item">
          <div class="comment-content">{{ item.content }}</div>
          <div class="comment-meta">
            <span class="username">{{ item.username }}</span>
            <span class="time">{{ item.time }}</span>
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
        <li v-for="item in favoritesList" :key="item.favorites_id" class="favorite-item">
          <span>{{ item.folder_name }}</span>
          <button @click="handleAddToFavorite(item.favorites_id)">添加</button>
        </li>
      </ul>
      <div class="new-folder"><input type="text" v-model="newFavoriteName" placeholder="新建收藏夹" /> <button
          class="create-folder-btn" @click="handleAddnewFavorite">+</button></div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,watch } from 'vue';
import { getArticleDetail } from '@/API/get/article/getArticleDetail';
import { getComment } from '@/API/get/comment/getComment';
import { getMyFavorites } from '@/API/get/comment/getMyFavorites';
import postStar from '@/API/post/favorites/postStar';
import postDownLoad from '@/API/post/postDownLoad';
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
  article_id: '',
  tags: [],
});

const commentList = ref([
  {
    comment_id: '1',
    content: '这是一个评论',
    username: '用户1',
    time: '2021-01-01',
  },
  {
    comment_id: '2',
    content: '这是另一个评论',
    username: '用户2',
    time: '2021-01-02',
  },
]);

const showFavoritePopup = ref(false);
const favoritesList = ref([]);
const myid = user_id

const handleDownload = () => {
  window.alert('下载中');
  fetch(articleDetail.value.file_url)
    .then((res) => res.blob())
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'article.pdf'; // You may modify this to use the article's actual name
      link.click();
    })
    .catch(() => {
      window.alert('下载失败');
    });
};

const handlePreview = () => {
  window.open(articleDetail.value.file_url, '_blank');
};

const handleFavorite = () => {
  showFavoritePopup.value = true;
  getFolders();
};

const getFolders = async () => {
  const res = await getMyFavorites({ user_id: myid, pageSize: 10, pageNumber: 1 });
  if (res.code === 1) {
    favoritesList.value = res.data;
  } else {
    window.alert('获取收藏失败');
  }
};

const handleAddToFavorite = async (favorites_id: string) => {
  const confirmed = window.confirm('确定要将文章添加到该收藏夹吗？');
  if (confirmed) {
    const res = await postStar({ article_id: articleDetail.value.article_id, favorites_id });
    if (res.code === 200) {
      window.alert('添加成功');
      showFavoritePopup.value = false;
    } else {
      window.alert('添加失败');
    }
  }
};
const newFavoriteName = ref('');
const handleAddnewFavorite = async () => {

  if (newFavoriteName) {
    const res = await makeFavorites({ user_id: myid, folder_name: newFavoriteName.value, description: '学习' });
    if (res.code === 1) {
      window.alert('创建成功');
      getFolders();
    }
  }
};
const articleId = ref(0);
import { onLoad } from '@dcloudio/uni-app';
onLoad(async (Option) => {// 获取路由传过来的文章ID

   articleId.value = Option.article_id;
  articleDetail.value.article_id = articleId.value;
  console.log(articleId.value);

  try {
    updateComments();
    const detailres = await getArticleDetail({ article_id: articleDetail.value.article_id });
    if (detailres.code === 1) {
      articleDetail.value = detailres.data;
    } else {

    }

  } catch (error) {
    console.error(error);
  }

})
// watch( ()=>articleId.value, async (newVal) => {
//   index.value = 0;
//   updateComments();

// })


const index = ref(0);


const updateComments = async () => {
  index.value++
  const res = await getComment({ article_id: articleDetail.value.article_id, pageSize: index.value, pageNumber: 4 });
  commentList.value = [...commentList.value, ...res.data];
}
const showAddCommentPopup = ref(false);
const newCommentContent = ref('');
const handleAddComment = () => {
  showAddCommentPopup.value = true;
}
import postComment from '@/API/post/postComment';
const handleSubmitComment = async () => {
  if (newCommentContent.value.trim() === '') {
    window.alert('评论内容不能为空');
    return;
  }
  postComment({ article_id: articleDetail.value.article_id, comment_content: newCommentContent.value, publish_time: new Date(), userId: user_id }).then(async (res) => {
    if (res.code === 1) {
      newCommentContent.value = '';
      showAddCommentPopup.value = false;
      uni.showToast({
        title: '评论成功,审核中',
        icon: 'success',
        mask: true
      })
      // 重新获取评论列表
      const res = await getComment({ article_id: articleDetail.value.article_id, pageSize: index.value, pageNumber: 1 });
      commentList.value = res.data;
    }
    else {
      uni.showToast({
        title: '评论失败',
        icon: 'none'
      })
    }
  })



};
</script>

<style scoped>
.article-container {
  padding: 20rpx;
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
  height: 100px;
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
  gap: 15px;
}

.publish-time,
.author-name {
  color: #999;
}

.article-content {
  margin-bottom: 40px;
}

.desc {
  font-size: 18px;
  color: #444;
  margin-bottom: 20px;
}

.file {
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}





.comment-section {
  margin-top: 30px;
  flex-grow: 1;
  overflow: auto;
  border-top: #33333322 1px solid;
  padding-top: 10px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

}

.comment-title {
  width: 100vw;
  display: flex;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  justify-content: space-between;

}

.comment-title.add-comment-btn {
  font-size: 16px;
  padding: 10px;
  border-radius: 50%;
  background-color: #4a90e2;
  color: white;
  transition: background-color 0.3s ease;
}

.comment-title button:hover {
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
}

.comment-item:hover {
  background-color: #f7f7f7;
}

.favorite-popup-overlay {
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

.favorite-popup-content {
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.favorite-popup-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f7f7f7;
  border-radius: 8px;


}

.primary-btn {
  width: fit-content;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  background-color: #4a90e2;
  color: white;
  transition: background-color 0.3s ease;
}

.favorite-item button:hover {
  background-color: #3578b6;
}




.favorite-popup-content button {
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 10px;
  cursor: pointer;
}

.favorite-popup-overlay .favorite-popup-content {
  position: relative;
}

.favorite-popup-overlay .favorite-popup-content button.cancel-button {
  background-color: #ff4d4f;
}

.favorite-popup-overlay .favorite-popup-content button.cancel-button:hover {
  background-color: #e74c3c;
}

.comment-item .comment-content {
  font-size: 16px;
  color: #555;
  max-width: 80%;
}

.comment-item .comment-meta {
  font-size: 14px;
  color: #999;
  text-align: right;
}

.comment-item .username {
  font-weight: bold;
}

.comment-item .time {
  margin-left: 10px;
}

.comment-item:hover {
  background-color: #f7f7f7;
  border-radius: 8px;
}

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

.add-comment-popup-content {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.add-comment-popup-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.comment-textarea {
  width: 300px;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.new-folder {
  display: flex;

}
</style>
