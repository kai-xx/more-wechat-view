<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="type"  label="类型">
          <el-select v-model="postForm.type" placeholder="请选择类型">
            <el-option v-for="item in  typeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              <!--{{ item.display_name }}-->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="name" label="公众号名称:">
          <el-input type="input" class="article-input"  placeholder="请输入公众号名称" v-model="postForm.name">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="app_id" label="app_id:">
          <el-input type="input" class="article-input"  placeholder="app_id" v-model="postForm.app_id">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="app_secret" label="app_secret:">
          <el-input type="input" class="article-input"  placeholder="app_secret" v-model="postForm.app_secret">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="wechat_number" label="公众号:">
          <el-input type="input" class="article-input"  placeholder="请输入公众号" v-model="postForm.wechat_number">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="original_id" label="原始ID:">
          <el-input type="input" class="article-input"  placeholder="请输入公众号原始ID" v-model="postForm.original_id">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="linkman" label="联系人:">
          <el-input type="input" class="article-input"  placeholder="请输入联系人" v-model="postForm.linkman">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="phone" label="电话号:">
          <el-input type="input" class="article-input"  placeholder="请输入联系人电话号" v-model="postForm.phone">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="address" label="地址:">
          <el-input type="input" class="article-input"  placeholder="请输入地址" v-model="postForm.address">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="image" label="二维码图片:">
          <Upload v-model="postForm.image" />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="备注:">
          <el-input type="textarea" class="article-textarea" :rows="1" placeholder="请输入内容" v-model="postForm.remark">
          </el-input>
        </el-form-item>
      </div>
    </el-form>

  </div>
</template>

<script>
import Upload from '@/components/MyUpload/singleImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import { createWechat, updateWechat, fetchWechat } from '@/api/wechat'
const typeOptions = [
  { key: 1, display_name: '服务号' },
  { key: 2, display_name: '订阅号' }
]
const typeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const defaultForm = {
  status: 'draft',
  name: '',
  linkman: '',
  phone: '',
  address: '',
  original_id: '',
  wechat_number: '',
  app_id: '',
  app_secret: '',
  type: undefined,
  image: '',
  state: '',
  remark: ''
}

export default {
  name: 'articleDetail',
  components: { Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        name: [
          { required: true, message: '请输入公众号名称', trigger: 'blur' }
        ],
        app_id: [
          { required: true, message: '请输入app_id', trigger: 'blur' }
        ],
        app_secret: [
          { required: true, message: '请输入app_secret', trigger: 'blur' },
          { min: 32, max: 32, message: '长度在32个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      typeOptions
    }
  },
  filters: {
    typeFilter1111(type) {
      return typeKeyValue[type]
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      fetchWechat(id).then(response => {
        this.postForm = response.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      console.log(this.postForm)
      this.postForm.display_time = parseInt(this.display_time / 1000)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            createWechat(this.postForm).then((response) => {
              console.log(valid)
              this.loading = true
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
              this.$router.push('/wechat/wechat-list')
            })
          } else {
            updateWechat(this.postForm).then((response) => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
              this.$router.push('/wechat/wechat-list')
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
