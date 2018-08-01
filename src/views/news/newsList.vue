<template>
  <el-container>
    <el-aside width="200px" style="border: 1px solid #eee">
      <div class="app-container" style="margin-top: 20px">
        <el-table :data="wechatList" v-loading.body="wechatLoading" style="width: 200px">
          <el-table-column style="color: #ecf5ff" min-width="200px" label="公众号列表">
            <template slot-scope="scope">
              <el-radio @change='handleFilter' v-model="listQuery.oa_wechat_id" :label="scope.row.id">{{ scope.row.name }}</el-radio>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-aside>
    <el-main style="border: 1px solid #eee">
      <div class="app-container">
        <div class="filter-container">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.keyword">
          </el-input>
          <el-select @change='handleFilter' clearable class="filter-item" style="width: 130px" v-model="listQuery.state" placeholder="状态">
            <el-option v-for="item,key in  stateKeyValue" :key="key" :label="item" :value="key">
            </el-option>
          </el-select>
          <el-checkbox class="filter-item" style='margin-left:15px;margin-right: 15px' @change='handleFilter' v-model="listQuery.showDelete">显示删除信息</el-checkbox>
          <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <router-link :to="'/news/create/'+listQuery.oa_wechat_id">
            <el-button class="filter-item" style="margin-left: 10px;"  type="primary" icon="el-icon-edit">添加</el-button>
          </router-link>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="编号" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>


          <el-table-column min-width="300px" label="标题">
            <template slot-scope="scope">
              <router-link class="link-type" :to="'/news/edit/'+scope.row.id">
                <span>{{ scope.row.title }}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.path+'?imageView2/1/w/50/h/50'">
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="!!scope.row.deleted_at" type="danger" > 删除 </el-tag>
              <el-tag v-else :type="scope.row.state | statusFilter" >{{ scope.row.state | stateFilter}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column width="180px" align="创建时间" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="230">
            <template slot-scope="scope">
              <router-link :to="'/news/edit/'+scope.row.id">
                <el-button type="primary" size="small">编辑</el-button>
              </router-link>
              <el-button v-if="scope.row.deleted_at==null" size="mini" type="danger" @click="handleDelete(scope.row,'deleted')">删除
              </el-button>
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
import { fetchList, deleteNews } from '@/api/news'
import { fetchList as fetchWechatList } from '@/api/wechat'
import waves from '@/directive/waves'

const stateKeyValue = {
  1: '正常',
  2: '冻结'
}
export default {
  name: 'newsList',
  directives: {
    waves
  },
  data() {
    return {
      wechatList: null,
      wechatLoading: true,
      wechatQuery: {
        keyword: undefined,
        state: 1,
        offset: 0,
        limit: 20
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
      stateKeyValue
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    stateFilter(state) {
      return stateKeyValue[state]
    }
  },
  created() {
    this.getWechatList()
    this.getList()
  },
  methods: {
    getWechatList() {
      this.wechatLoading = true
      fetchWechatList(this.wechatQuery).then(response => {
        this.wechatList = response.data.data
        this.wechatLoading = false
      })
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
      deleteNews(row.id).then(() => {
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
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
