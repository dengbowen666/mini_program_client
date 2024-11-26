export const goArticleDetail
= (article_id: string) => {
uni.navigateTo({
  url: `/pages/article_detail/article_detail?article_id=${article_id}`,
})
}
