<template>
  <el-container>
    <el-aside width="245px" style="border: 1px solid #eee">
      <left-list @handleFilter="handleFilter" v-model="listQuery.oa_wechat_id"></left-list>
    </el-aside>
    <el-main style="border: 1px solid #eee">
      <div class="app-container">
        <div class="filter-container">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="listQuery.keyword">
          </el-input>
          <el-select @change='handleFilter' clearable class="filter-item" style="width: 130px" v-model="listQuery.state" placeholder="状态">
            <el-option v-for="item,key in  stateKeyValue" :key="key" :label="item" :value="key">
            </el-option>
          </el-select>
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


          <el-table-column min-width="100px" label="昵称">
            <template slot-scope="scope">
                <span>{{ scope.row.nike }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="50px" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex == 2">女</span>
              <span v-else="scope.row.sex == 1">男</span>
            </template>
          </el-table-column>
          <el-table-column min-width="50px" label="国家">
            <template slot-scope="scope">
              <span>{{ scope.row.country }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="50px" label="省份">
            <template slot-scope="scope">
              <span>{{ scope.row.province }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="50px" label="城市">
            <template slot-scope="scope">
              <span>{{ scope.row.city }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" label="头像">
            <template slot-scope="scope">
              <img :src="scope.row.head_img+'?imageView2/1/w/50/h/50'">
            </template>
          </el-table-column>
          <el-table-column min-width="150px" label="关注时间">
            <template slot-scope="scope">
              <span>{{scope.row.subscribe_time}}</span>
            </template>
          </el-table-column>

          <el-table-column width="180px" align="创建时间" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
import { fetchList, updateFans } from '@/api/fans'
import waves from '@/directive/waves'
import LeftList from '../wechat/leftList'
import mineFooter from '../footer/footer'
const stateKeyValue = {
  1: '正常',
  2: '冻结'
}
export default {
  name: 'fansList',
  components: { LeftList, mineFooter },
  directives: {
    waves
  },
  data() {
    return {
      update: {},
      list: null,
      total: 0,
      updateLoading: false,
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
    this.getList()
  },
  methods: {
    forceUpdate() {
      this.updateLoading = true
      this.update.oa_wechat_id = this.listQuery.oa_wechat_id
      this.update.force = 1
      this.updateFans()
    },
    commonUpdate() {
      this.updateLoading = true
      this.update.oa_wechat_id = this.listQuery.oa_wechat_id
      this.update.force = 0
      this.updateFans()
    },
    updateFans() {
      if (this.listQuery.oa_wechat_id === undefined) {
        return this.$message.error('请选择公众号')
      }
      updateFans(this.update).then(response => {
        this.updateResult = response.data
        this.updateLoading = false
        this.handleFilter()
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
