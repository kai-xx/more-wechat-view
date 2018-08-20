<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="title" label="信息标题:">
          <el-input type="input" class="article-input"  placeholder="请输入信息标题" v-model="postForm.title">
          </el-input>
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
        <el-form-item v-if="postForm.type == 2" prop="send_at" label-width="100px" label="发送时间:" class="postInfo-container-item">
          <el-date-picker v-model="postForm.send_at" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"> placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="备注:">
          <el-input type="textarea" class="article-textarea" :rows="1" placeholder="请输入内容" v-model="postForm.remark">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="message_type"  label="消息类型">
          <el-select v-model="postForm.type" placeholder="请选择消息类型">
            <el-option v-for="item in  messageTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              {{ item.display_name }}
            </el-option>
          </el-select>
          <el-button type="primary" @click="openDialog">点击添加消息</el-button>
        </el-form-item>


        <el-table v-if="messageArray.length > 0" :data="messageArray" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="编号" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>


          <el-table-column min-width="300px" label="标题">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="50px" label="图片">
            <template slot-scope="scope">
              <img style="height: 40px" :src="scope.row.path">
            </template>
          </el-table-column>
          <el-table-column width="180px" align="创建时间" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="230">
            <template slot-scope="scope">
              <el-button v-if="scope.row.deleted_at==null" size="mini" type="danger" @click="handleDelete(scope.row,'deleted')">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>


    <el-dialog width="90%" v-el-drag-dialog title="消息列表" :visible.sync="dialogTableVisible">
      <div class="app-container">
        <div class="filter-container">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="搜索" v-model="drapList.listQuery.keyword">
          </el-input>
          <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="handleSave">保存</el-button>
        </div>
        <!--<el-table :data="drapList.list" v-loading.body="drapList.listLoading" border fit highlight-current-row style="width: 100%">-->
        <el-table height="400" :data="drapList.list" v-loading.body="drapList.listLoading" border fit highlight-current-row @selection-change="handleSelectionChange"
                    ref="multipleTable">
          <el-table-column type="selection" align="center"></el-table-column>

          <el-table-column align="center" label="编号" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="300px" label="标题">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="50px" label="图片">
            <template slot-scope="scope">
              <img style="height: 40px" :src="scope.row.path">
            </template>
          </el-table-column>
          <el-table-column width="180px" align="创建时间" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="drapList.listQuery.page"
                          :page-size="drapList.listQuery.limit" layout="total, prev, pager, next, jumper" :total="drapList.total">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import Upload from '@/components/Upload/singleImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import waves from '@/directive/waves'
import { createMessage, updateMessage, fetchMessage } from '@/api/message'
import { fetchList as fetchListNews } from '@/api/news'
import { tagList } from '@/api/fans'

const typeOptions = [
  { key: 1, display_name: '普通信息' },
  { key: 2, display_name: '定时信息' }
]
const stateKeyValue = {
  1: '正常',
  2: '冻结'
}
const messageTypeOptions = [
  { key: 1, display_name: '文本' },
  { key: 2, display_name: '图片' },
  { key: 3, display_name: '图文' },
  { key: 4, display_name: '链接' }
  // { key: 5, display_name: '视频' },
  // { key: 6, display_name: '音频' }
]
const typeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const messageTypeKeyValue = messageTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const defaultForm = {
  status: 'draft',
  title: '',
  type: undefined,
  send_at: undefined,
  remark: ''
}
export default {
  name: 'articleDetail',
  directives: { elDragDialog, waves },
  components: { Upload, Sticky },
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
        message_id: undefined,
        oa_wechat_id: undefined,
        state: 1,
        offset: 0,
        limit: 2000
      },
      tagsList: {},
      tagOptions: [],
      postForm: Object.assign({}, defaultForm),
      messageArray: [],
      loading: false,
      rules: {
        title: [
          { required: true, message: '请输入消息名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择发送类型', trigger: 'change' }
        ],
        message_type: [
          { required: true, message: '请选择消息类型', trigger: 'change' }
        ],
        send_at: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ]
      },
      typeOptions,
      stateKeyValue,
      messageTypeOptions,
      drapList: {
        multipleSelection: [],
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          oa_wechat_id: 0,
          type: 0,
          state: 1,
          offset: 0,
          limit: 2000
        }
      },
      dialogTableVisible: false
    }
  },
  filters: {
    typeFilter(type) {
      return typeKeyValue[type]
    },
    messageTypeFilter(type) {
      return messageTypeKeyValue[type]
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.tagQuery.message_id = id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      this.postForm.oa_wechat_id = this.$route.params && this.$route.params.oa_wechat_id
    }
    this.getTags()
  },
  methods: {
    getTags() {
      this.tagQuery.oa_wechat_id = this.postForm.oa_wechat_id
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
    handleDelete(row) {
      const index = this.messageArray.indexOf(row)
      this.messageArray.splice(index, 1)
    },
    handleSelectionChange(val) {
      this.drapList.multipleSelection = val
      this.$nextTick(this.checked())
    },
    handleSave() {
      console.log(this.postForm)
      var messageLength = this.drapList.multipleSelection.length
      if (messageLength) {
        if (this.postForm.message_type === 3) {
          if (messageLength > 8) {
            return this.$message({
              message: '图文消息最多只能有8条',
              type: 'warning'
            })
          }
        } else {
          if (messageLength > 1) {
            return this.$message({
              message: '非图文消息最多只能有1条',
              type: 'warning'
            })
          }
        }
        // 撤销所有选择
        // this.$refs.multipleTable.clearSelection()
        this.messageArray = this.drapList.multipleSelection
        this.dialogTableVisible = false
      } else {
        this.$message({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    openDialog() {
      if (this.postForm.message_type === undefined) {
        return this.$message.error('请选择消息类型')
      }
      this.createDragDataByMessageType()
      this.dialogTableVisible = true
    },
    checked() {
      if (this.messageArray.length) {
        this.drapList.list.forEach(row => {
          this.messageArray.forEach(row1 => {
            if (row.id === row1.id) {
              this.$refs.multipleTable.toggleRowSelection(row, true)
            }
          }, row)
        }, this)
      }
    },
    createDragDataByMessageType() {
      this.drapList.listLoading = true
      this.drapList.listQuery.oa_wechat_id = this.postForm.oa_wechat_id
      this.drapList.listQuery.type = this.postForm.message_type
      fetchListNews(this.drapList.listQuery).then(response => {
        this.drapList.list = response.data.data
        this.drapList.total = response.data.total
        this.drapList.listLoading = false
      })
    },
    handleFilter() {
      this.drapList.listQuery.offset = 0
      this.createDragDataByMessageType()
    },
    handleSizeChange(val) {
      this.drapList.listQuery.limit = val
      this.createDragDataByMessageType()
    },
    handleCurrentChange(val) {
      this.drapList.listQuery.offset = (val - 1) * this.drapList.listQuery.limit
      this.createDragDataByMessageType()
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
    submitForm() {
      this.postForm.display_time = parseInt(this.display_time / 1000)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.postForm.oa_wechat_id === undefined || isNaN(this.postForm.oa_wechat_id)) {
            return this.$message.error('请选择公众号')
          }
          if (this.checkedTags.length <= 0) {
            return this.$message.error('请选择发送人群')
          }
          if (this.messageArray.length <= 0) {
            return this.$message.error('请添加消息')
          }
          this.postForm.messageArray = this.messageArray
          this.postForm.tags = this.checkedTags
          if (!this.isEdit) {
            createMessage(this.postForm).then((response) => {
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
              this.$router.push('/message/message-list')
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
              this.postForm.status = 'published'
              this.loading = false
              this.$router.push('/message/message-list')
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
