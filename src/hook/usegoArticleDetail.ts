export const goArticleDetail
  = (article_id: string) => {
  console.log('跳转到文章详情页', article_id);

uni.navigateTo({
  url: `/pages/article_detail/article_detail?article_id=${article_id}`,
})
}
