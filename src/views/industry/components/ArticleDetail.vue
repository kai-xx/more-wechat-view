<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar published'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-form-item  style="margin-bottom: 40px;" label-width="100px"
                       prop="applet_uri"
                       label="链接URL"
                       :rules="[
      { required: true, message: '请输入URL', trigger: 'blur' }
    ]"
        >
          <el-input style="width: 40%;" v-model="postForm.applet_uri"></el-input>
        </el-form-item>
        <el-form-item  style="margin-bottom: 40px;" label-width="102px"
                       prop="applet_app_id"
                       label="小程序appid"
                       :rules="[
      { required: true, message: '请输入小程序appid', trigger: 'blur' }
    ]"
        >
          <el-input style="width: 40%;" v-model="postForm.applet_app_id"></el-input>
        </el-form-item>
        <el-form-item  style="margin-bottom: 40px;" label-width="100px"
                       prop="applet_path"
                       label="小程序URL"
                       :rules="[
      { required: true, message: '请输入小程序URL', trigger: 'blur' }
    ]"
        >
          <el-input style="width: 40%;" v-model="postForm.applet_path"></el-input>
        </el-form-item>
        <el-form-item  style="margin-bottom: 40px;" label-width="100px"
                prop="first.value"
                label="首行"
                :rules="[
      { required: true, message: '请输入信息', trigger: 'blur' }
    ]"
        >
          <el-input style="width: 40%;" v-model="postForm.first.value"></el-input>
          <el-input style="width: 10%;" placeholder="字体颜色" v-model="postForm.first.color"></el-input>
          <el-color-picker class="picker-own-class" v-model="postForm.first.color"></el-color-picker>
        </el-form-item>
        <el-form-item  style="margin-bottom: 40px;" label-width="100px"
                v-for="(keyword, index) in postForm.keywords"
                :label="'关键词' + (index + 1)"
                :key="keyword.key"
                :prop="'keywords.' + index + '.value'"
                :rules="{
      required: true, message: '关键词不能为空', trigger: 'blur'
    }"
        >
          <el-input style="width: 40%;" v-model="keyword.value"></el-input>
          <el-input style="width: 10%;" placeholder="字体颜色" v-model="keyword.color"></el-input>
          <el-color-picker class="picker-own-class" v-model="keyword.color"></el-color-picker>
          <el-button @click="addKeyword">新增关键词</el-button>
          <el-button @click.prevent="removeKeyword(keyword)">删除</el-button>
        </el-form-item>
        <el-form-item  style="margin-bottom: 40px;" label-width="100px"
                       prop="send_remark.value"
                       label="备注"
                       :rules="[
      { required: true, message: '请输入信息', trigger: 'blur' }
    ]"
        >
          <el-input style="width: 40%;" v-model="postForm.send_remark.value"></el-input>
          <el-input style="width: 10%;" placeholder="字体颜色" v-model="postForm.send_remark.color"></el-input>
          <el-color-picker class="picker-own-class" v-model="postForm.send_remark.color"></el-color-picker>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="type"  label="发送类型">
          <el-select v-model="postForm.type" placeholder="请选择类型">
            <el-option v-for="item in  typeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              {{ item.display_name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="checkedTags"  label="发送人群">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedTags" @change="handleCheckedTagsChange">
            <el-checkbox v-for="tag in tagsList" :label="tag.tag_id" :key="tag.tag_id" :value="tag.tag_id">{{tag.tag_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="postForm.type === 2" prop="send_at" label-width="100px" label="发送时间:" class="postInfo-container-item">
          <el-date-picker v-model="postForm.send_at" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"> placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <p style="color: #ff0000;">关键词根据以下信息自行添加</p>
        <div v-html="postForm.content">
        </div>
      </div>
    </el-form>



  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import waves from '@/directive/waves'
import { updateMessage, fetchMessage } from '@/api/industry'
import { tagList } from '@/api/fans'

const typeOptions = [
  { key: 1, display_name: '普通信息' },
  { key: 2, display_name: '定时信息' }
]
const typeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'articleDetail',
  directives: { waves },
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkAll: false,
      checkedTags: [],
      isIndeterminate: true,
      tagQuery: {
        oa_wechat_id: undefined,
        state: 1,
        offset: 0,
        limit: 2000
      },
      tagsList: {},
      tagOptions: [],
      postForm: {
        send_remark: {},
        first: {},
        keywords: [],
        type: 1,
        send_at: undefined,
        remark: ''
      },
      loading: false,
      rules: {
        type: [
          { required: true, message: '请选择发送类型', trigger: 'change' }
        ],
        send_at: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ]
      },
      typeOptions
    }
  },
  filters: {
    typeFilter(type) {
      return typeKeyValue[type]
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm.oa_wechat_id = this.$route.params && this.$route.params.wechat_id
    }
    this.getTags()
  },
  methods: {
    getTags() {
      this.tagQuery.oa_wechat_id = this.$route.params.wechat_id
      tagList(this.tagQuery).then(response => {
        this.tagsList = response.data.data
        this.tagsList.forEach(row => {
          this.tagOptions.push(row.tag_id)
        }, this)
      })
    },
    handleCheckAllChange(val) {
      this.checkedTags = val ? this.tagOptions : []
      this.isIndeterminate = false
    },
    handleCheckedTagsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.tagOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tagOptions.length
    },
    fetchData(id) {
      fetchMessage(id).then(response => {
        this.postForm = response.data.data
        this.messageArray = response.data.data.messageArray
        this.message_type = response.data.data.message_type
        this.checkedTags = response.data.data.tags
      }).catch(err => {
        console.log(err)
      })
    },
    removeKeyword(item) {
      var index = this.postForm.keywords.indexOf(item)
      if (index !== -1) {
        this.postForm.keywords.splice(index, 1)
      }
    },
    addKeyword() {
      this.postForm.keywords.push({
        value: '',
        key: Date.now()
      });
    },
    submitForm() {
      this.postForm.display_time = parseInt(this.display_time / 1000)
        return console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.postForm.oa_wechat_id === undefined || isNaN(this.postForm.oa_wechat_id)) {
            return this.$message.error('请选择公众号')
          }
          if (this.checkedTags.length <= 0) {
            return this.$message.error('请选择发送人群')
          }
          this.postForm.tags = this.checkedTags
          if (!this.isEdit) {
            updateMessage(this.postForm).then((response) => {
              console.log(valid)
              this.loading = true
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push('/message/industry/industry-list')
            })
          } else {
            updateMessage(this.postForm).then((response) => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push('/message/industry/industry-list')
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
  .picker-own-class {
    vertical-align: -12px;
  }
</style>
