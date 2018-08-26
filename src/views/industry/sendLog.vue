<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>


      <el-table-column class-name="status-col" label="粉丝编号"  width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.fans_id }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="昵称">
        <template slot-scope="scope">
          <span >{{ scope.row.nike}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="性别" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sexTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" mix-width="50px"  label="头像">
        <template slot-scope="scope">
          <img style="height: 40px" :src="scope.row.head_img">
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status===2?'danger':''" >{{ scope.row.status | logTypeFilter}}</el-tag>
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

</template>

<script>
import { sendLog } from '@/api/industry'

const logTypeOptions = [
  { key: 1, display_name: '成功' },
  { key: 2, display_name: '失败' }
]
const logTypeKeyValue = logTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'sendLog',
  data() {
    return {
      sendData: {
        message_id: undefined
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        message_id: undefined,
        status: undefined,
        offset: 0,
        limit: 20
      },
      logTypeOptions
    }
  },
  filters: {
    logTypeFilter(type) {
      return logTypeKeyValue[type]
    },
    sexTypeFilter(sex) {
      var type = {
        1: '男',
        2: '女'
      }
      return type[sex]
    }
  },
  created() {
    this.listQuery.message_id = this.$route.params && this.$route.params.industry_message_id
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      sendLog(this.listQuery).then(response => {
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
</style>
