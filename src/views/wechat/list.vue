<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="公众号名称、联系人和联系人电话" v-model="listQuery.keyword">
      </el-input>
      <el-select @change='handleFilter' clearable class="filter-item" style="width: 130px" v-model="listQuery.state" placeholder="状态">
        <el-option v-for="item,key in  stateKeyValue" :key="key" :label="item" :value="key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <router-link :to="'/wechat/create/'">
        <el-button class="filter-item" style="margin-left: 10px;"  type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="300px" label="公众号名称">
        <template slot-scope="scope">
          <router-link class="link-type" :to="'/wechat/edit/'+scope.row.id">
            <span>{{ scope.row.name }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="联系人">
        <template slot-scope="scope">
          <span>{{scope.row.linkman}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="联系人电话">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
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
          <router-link :to="'/wechat/edit/'+scope.row.id">
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
</template>

<script>
import { fetchList, deleteWechat } from '@/api/wechat'
import waves from '@/directive/waves' // 水波纹指令
const stateKeyValue = {
  1: '正常',
  2: '冻结'
}
export default {
  name: 'wechatList',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        keyword: undefined,
        wechatId: undefined,
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
      deleteWechat(row.id).then(() => {
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
