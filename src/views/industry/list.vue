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
          <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="commonUpdate">更新</el-button>
          <el-button class="filter-item" type="danger" v-waves icon="el-icon-edit" @click="forceUpdate">强制更新</el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="编号" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="300px" label="模版ID">
            <template slot-scope="scope">
                <span>{{ scope.row.template_id }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="300px" label="标题">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>{{ scope.row.example }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.title }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column min-width="300px" label="一级行业">
            <template slot-scope="scope">
              <span>{{ scope.row.primary_industry }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="300px" label="二级行业">
            <template slot-scope="scope">
              <span>{{ scope.row.deputy_industry }}</span>
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
              <router-link :to="'/message/industry/edit/'+scope.row.id+'/wechat_id/'+scope.row.oa_wechat_id">
                <el-button type="primary" size="small">编辑</el-button>
              </router-link>

              <router-link :to="'/message/industry/send-log/'+scope.row.industry_message_id">
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
    <mine-footer></mine-footer>
  </el-container>
</template>

<script>
import { fetchList, updateIndustry, sendIndustryMessage } from '@/api/industry'
import waves from '@/directive/waves'
import LeftList from '../wechat/leftList'
import mineFooter from '../footer/footer'

export default {
  name: 'industryList',
  components: { LeftList, mineFooter },
  directives: {
    waves
  },
  data() {
    return {
      sendData: {
        industry_id: undefined
      },
      update: {},
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        oa_wechat_id: undefined,
        state: undefined,
        offset: 0,
        limit: 20
      }
    }
  },
  filters: {
  },
  created() {
    this.getList()
  },
  methods: {
    sendMessage(row) {
      this.sendData.industry_id = row.id
      sendIndustryMessage(this.sendData).then(response => {
      })
    },
    forceUpdate() {
      this.listLoading = true
      this.update.oa_wechat_id = this.listQuery.oa_wechat_id
      this.update.force = 1
      this.updateTags()
    },
    commonUpdate() {
      this.listLoading = true
      this.update.oa_wechat_id = this.listQuery.oa_wechat_id
      this.update.force = 0
      this.updateTags()
    },
    updateTags() {
      if (this.listQuery.oa_wechat_id === undefined) {
        this.listLoading = false
        return this.$message.error('请选择公众号')
      }
      updateIndustry(this.update).then(response => {
        this.listLoading = false
        if (response.data.code === 400) {
          return this.$message.error(response.data.message)
        }
        this.updateResult = response.data
        this.handleFilter()
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        if (response.data.code === 400) {
          return this.$message.error(response.data.message)
        }
        this.list = response.data.data
        this.total = response.data.total
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
  }
}
</script>

<style scoped>
</style>
