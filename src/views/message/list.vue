<template>
  <el-container>
    <el-aside width="245px" style="border: 1px solid #eee">
      <left-list @handleFilter="handleFilter" v-model="listQuery.oa_wechat_id"></left-list>
    </el-aside>
    <el-main style="border: 1px solid #eee">
      <div class="app-container">
        <div class="filter-container">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.keyword">
          </el-input>
          <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" @click="jumpToCreate" style="margin-left: 10px;"  type="primary" icon="el-icon-edit">添加</el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="编号" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>


          <el-table-column min-width="300px" label="标题">
            <template slot-scope="scope">
              <router-link class="link-type" :to="'/message/edit/'+scope.row.id">
                <span>{{ scope.row.title }}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column class-name="status-col" label="类型" width="100">
            <template slot-scope="scope">
              <el-tag >{{ scope.row.type | messageTypeFilter}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="发送时间" label="发送时间">
            <template slot-scope="scope">
              <span v-if="scope.row.send_at == null">-</span>
              <span v-else>{{scope.row.send_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="创建时间" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="280">
            <template slot-scope="scope">
              <el-button size="small" type="success" icon="el-icon-upload2" @click="sendMessage(scope.row)">发送
              </el-button>
              <router-link :to="'/message/edit/'+scope.row.id">
                <el-button type="primary" size="small">编辑</el-button>
              </router-link>
              <el-button v-if="scope.row.deleted_at==null" size="small" type="danger" @click="handleDelete(scope.row,'deleted')">删除
              </el-button>
              <router-link :to="'/message/send-log/'+scope.row.id">
                <el-button type="primary" size="small">日志</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                         :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </el-main>
  </el-container>



</template>

<script>
import { fetchList, deleteMessage, sendMessage as sendMessageByMessageId } from '@/api/message'
import waves from '@/directive/waves'
import LeftList from '../wechat/leftList'

const messageTypeOptions = [
  { key: 1, display_name: '文本' },
  { key: 2, display_name: '图片' },
  { key: 3, display_name: '图文' },
  { key: 4, display_name: '链接' }
  // { key: '5', display_name: '视频' },
  // { key: '6', display_name: '音频' }
]
const messageTypeKeyValue = messageTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'messageList',
  components: { LeftList },
  directives: {
    waves
  },
  data() {
    return {
      sendData: {
        message_id: undefined
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        oa_wechat_id: undefined,
        state: undefined,
        offset: 0,
        limit: 20
      },
      messageTypeOptions
    }
  },
  filters: {
    messageTypeFilter(type) {
      return messageTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    sendMessage(row) {
      this.sendData.message_id = row.id
      sendMessageByMessageId(this.sendData).then(response => {
      })
    },
    jumpToCreate() {
      if (this.listQuery.oa_wechat_id === undefined) {
        return this.$message.error('请选择公众号')
      }
      this.$router.push('/message/create/' + this.listQuery.oa_wechat_id)
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.offset = 0
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.offset = (val - 1) * this.listQuery.limit
      this.getList()
    },
    handleDelete(row) {
      deleteMessage(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    }
  }
}
</script>

<style scoped>
</style>
