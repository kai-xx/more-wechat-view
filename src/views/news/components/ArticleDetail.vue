<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 40px;" label-width="68px" prop="type"  label="消息类型">
          <el-select v-model="postForm.type" placeholder="请选择消息类型">
            <el-option v-for="item in  messageTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              {{ item.display_name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>

          </el-col>
        </el-row>
      <el-form-item v-if="isShowByUrl(postForm.type)" style="margin-bottom: 40px;" label-width="72px" prop="uri" label="跳转链接:">
          <el-input type="text" placeholder="请输入链接" v-model="postForm.url">
          </el-input>
      </el-form-item>
        <el-form-item v-if="isShowByDetail(postForm.type)" style="margin-bottom: 40px;" label-width="45px" prop="detail" label="描述:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.detail">
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
          <p v-if="postForm.type === 1" style="color: red">
            跳转小程序示例：<br/>
            &lt;a href='http://www.qq.com' data-miniprogram-appid='appid' data-miniprogram-path='pages/index/index'&gt;点击跳小程序&lt;/a&gt;
            <br/>
            说明：<br/>
            1.data-miniprogram-appid 项，填写小程序appid，则表示该链接跳小程序；<br/>
            2.data-miniprogram-path项，填写小程序路径，路径与app.json中保持一致，可带参数；<br/>
            3.对于不支持data-miniprogram-appid 项的客户端版本，如果有herf项，则仍然保持跳href中的网页链接；<br/>
            4.data-miniprogram-appid对应的小程序必须与公众号有绑定关系。
          </p>
        </el-form-item>
        <div>
          <tinymce :height="300" v-model="postForm.content"></tinymce>
        </div>
        <div v-if="isShowByUpload(postForm.type)" style="margin-bottom: 20px;">
          <Upload v-model="postForm.path" />
          <p style="color: red;text-align: center">{{ uploadHintMessage(postForm.type) }}</p>
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
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Upload from '@/components/MyUpload/singleImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import { createNews, updateNews, fetchNews } from '@/api/news'
const messageTypeOptions = [
  { key: 1, display_name: '文本' },
  { key: 2, display_name: '图片' },
  { key: 3, display_name: '图文' },
  { key: 4, display_name: '链接' }
  // { key: 5, display_name: '视频' },
  // { key: 6, display_name: '音频' }
]
const messageTypeKeyValue = messageTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const defaultForm = {
  status: 'draft',
  type: 3,
  title: '', // 题目
  content: '', // 内容
  detail: '', // 摘要
  remark: '', // 备注
  path: '' // 图片
}

export default {
  name: 'articleDetail',
  components: { MDinput, Upload, Sticky, Tinymce },
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
      oa_wechat_id: undefined,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        title: [{ validator: validateRequire }],
        detail: [{ validator: validateRequire }]
      },
      messageTypeOptions
    }
  },
  filters: {
    messageTypeFilter(type) {
      return messageTypeKeyValue[type]
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.detail.length
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      this.oa_wechat_id = this.$route.params && this.$route.params.oa_wechat_id
      this.postForm.oa_wechat_id = this.$route.params && this.$route.params.oa_wechat_id
    }
  },
  methods: {
    isShowByUrl(type) {
      if (
        this.postForm.type === 3 ||
        this.postForm.type === 4
      ) {
        return true
      }
      return false
    },
    isShowByDetail(type) {
      if (
        this.postForm.type === 1 ||
        this.postForm.type === 3
      ) {
        return true
      }
      return false
    },
    isShowByUpload(type) {
      if (
        this.postForm.type === 2 ||
        this.postForm.type === 3 ||
        this.postForm.type === 5 ||
        this.postForm.type === 6
      ) {
        return true
      }
      return false
    },
    uploadHintMessage(type) {
      switch (type) {
        case 5:
          return '音频最大支持2M，播放长度不超过60s，支持AMR\\MP3格式'
          break
        case 6:
          return '视频最大支持10MB，支持MP4格式'
          break
        default:
          return '图片最大支持2M，支持PNG\\JPEG\\JPG\\GIF格式'
      }
    },
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
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            if (this.oa_wechat_id === undefined || isNaN(this.oa_wechat_id)) {
              return this.$message.error('请选择公众号')
            }
            createNews(this.postForm).then((response) => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
              this.$router.push('/news/news-list')
            })
          } else {
            updateNews(this.postForm).then((response) => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
              this.$router.push('/news/news-list')
            })
          }
        } else {
          return false
        }
      })
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
