<template>
  <div>
    <article-detail :is-edit='true'></article-detail>
    <mine-footer></mine-footer>
  </div>

</template>

<script>
import ArticleDetail from './components/ArticleDetail'
import mineFooter from '../footer/footer'

export default {
  name: 'editForm',
  components: { ArticleDetail, mineFooter }
}
</script>

