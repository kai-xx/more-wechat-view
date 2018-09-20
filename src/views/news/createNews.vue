<template>
  <div>

    <article-detail :is-edit='false'></article-detail>
    <mine-footer></mine-footer>
  </div>
</template>

<script>
import ArticleDetail from './components/ArticleDetail'
import mineFooter from '../footer/footer'

export default {
  name: 'createForm',
  components: { ArticleDetail, mineFooter }
}
</script>

