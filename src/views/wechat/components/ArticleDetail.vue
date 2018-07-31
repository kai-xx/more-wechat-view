<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>

          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="45px" prop="detail" label="描述:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.detail">
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>
        <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.path" />
        </div>
        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="备注:">
          <el-input type="textarea" class="article-textarea" :rows="1" placeholder="请输入内容" v-model="postForm.remark">
          </el-input>
        </el-form-item>
      </div>
    </el-form>

  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Upload from '@/components/Upload/singleImage3'
import Sticky from '@/components/Sticky' // 粘性header组件
import { createNews, updateNews, fetchNews } from '@/api/news'

const defaultForm = {
  status: 'draft',
  title: '', // 题目
  content: '', // 内容
  detail: '', // 摘要
  remark: '', // 备注
  path: '' // 图片
}

export default {
  name: 'articleDetail',
  components: { MDinput, Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        title: [{ validator: validateRequire }],
        detail: [{ validator: validateRequire }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.detail.length
    }
  },
  created() {
    console.log(this.isEdit);
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      fetchNews(id).then(response => {
        this.postForm = response.data.data
        console.log(this.postForm)
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.postForm.display_time = parseInt(this.display_time / 1000)
      if (!this.isEdit) {
        createNews(this.postForm).then((response) => {
          this.$refs.postForm.validate(valid => {
            if (valid) {
              this.loading = true
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
            } else {
              return false
            }
          })
        })
      } else {
        updateNews(this.postForm).then((response) => {
          this.$refs.postForm.validate(valid => {
            if (valid) {
              this.loading = true
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
            } else {
              console.log('error submit!!')
              return false
            }
          })
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
