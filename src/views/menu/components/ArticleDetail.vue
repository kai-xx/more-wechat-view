<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="title" label="菜单标题:">
          <el-input type="input" class="article-input"  placeholder="请输入菜单标题" v-model="postForm.title">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" prop="message_type"  label="菜单类型">
          <el-select v-model="postForm.message_type" placeholder="请选择菜单类型" @change="messageArray=[]">
            <el-option v-for="item in  messageTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              {{ item.display_name }}
            </el-option>
          </el-select>
          <el-button v-if="postForm.message_type !== 80" type="primary" @click="openDialog">点击添加菜单</el-button>
        </el-form-item>
        <el-form-item v-if="postForm.message_type === 80"  style="margin-bottom: 40px;" label-width="100px"
                       prop="applet_uri"
                       label="链接URL"
                       :rules="[
      { required: true, message: '请输入URL', trigger: 'blur' }
    ]"
        >
          <el-input style="width: 40%;" v-model="postForm.applet_uri"></el-input>
        </el-form-item>
        <el-form-item v-if="postForm.message_type === 80"  style="margin-bottom: 40px;" label-width="102px"
                       prop="applet_app_id"
                       label="小程序appid"
                       :rules="[
      { required: true, message: '请输入小程序appid', trigger: 'blur' }
    ]"
        >
          <el-input style="width: 40%;" v-model="postForm.applet_app_id"></el-input>
        </el-form-item>
        <el-form-item  v-if="postForm.message_type === 80" style="margin-bottom: 40px;" label-width="100px"
                       prop="applet_path"
                       label="小程序URL"
                       :rules="[
      { required: true, message: '请输入小程序URL', trigger: 'blur' }
    ]"
        >
          <el-input style="width: 40%;" v-model="postForm.applet_path"></el-input>
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


    <el-dialog width="90%" v-el-drag-dialog title="资源列表" :visible.sync="dialogTableVisible">
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

const stateKeyValue = {
  1: '正常',
  2: '冻结'
}
const messageTypeOptions = [
  { key: 1, display_name: '文本' },
  { key: 2, display_name: '图片' },
  { key: 3, display_name: '图文' },
  { key: 4, display_name: '链接' },
  // { key: 5, display_name: '视频' },
  // { key: 6, display_name: '音频' },
  { key: 80, display_name: '小程序' }
]

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
      postForm: Object.assign({}, defaultForm),
      messageArray: [],
      loading: false,
      rules: {
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        message_type: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ]
      },
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
    messageTypeFilter(type) {
      return messageTypeKeyValue[type]
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      this.postForm.oa_wechat_id = this.$route.params && this.$route.params.oa_wechat_id
    }
  },
  methods: {
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
              message: '图文菜单最多只能有8条',
              type: 'warning'
            })
          }
        } else {
          if (messageLength > 1) {
            return this.$message({
              message: '非图文菜单最多只能有1条',
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
        return this.$message.error('请选择菜单类型')
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
          if (this.messageArray.length <= 0) {
            return this.$message.error('请添加菜单')
          }
          this.postForm.messageArray = this.messageArray
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
