<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.name')" v-model="listQuery.keyword">
      </el-input>
      <el-select @change='handleFilter' clearable class="filter-item" style="width: 130px" v-model="listQuery.state" :placeholder="$t('table.status')">
        <el-option v-for="item,key in  stateKeyValue" :key="key" :label="item" :value="key">
        </el-option>
      </el-select>
      <el-checkbox class="filter-item" style='margin-left:15px;margin-right: 15px' @change='handleFilter' v-model="listQuery.showDelete">显示删除信息</el-checkbox>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:1000px;">
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="$t('table.name')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="$t('table.phone')">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-tag v-if="!!scope.row.deleted_at" type="danger" > 删除 </el-tag>
          <el-tag v-else :type="scope.row.state | statusFilter" >{{ scope.row.state | stateFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.created_at')">
        <template slot-scope="scope">
          <span>{{scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.deleted_at==null" size="mini" type="danger" @click="handleDelete(scope.row,'deleted')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>



    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select class="filter-item" v-model="temp.type" placeholder="用户身份">
            <el-option v-for="item in  managerTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              {{ item.display_name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.login_name')" prop="login_name">
          <el-input v-model="temp.login_name" placeholder="登录名"></el-input>
          <el-alert
                    title="登录名为长度为6-16的数字和字母组成"
                    type="warning"
                    :closable="false">
          </el-alert>
        </el-form-item>
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="temp.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password">
          <el-input v-model="temp.password" placeholder="密码"></el-input>
          <el-alert v-if="dialogStatus=='update'"
                  title="需更改密码直接输入后覆盖已有密码"
                  type="warning"
                  :closable="false">
          </el-alert>
        </el-form-item>
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="temp.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.qq')" prop="QQ">
          <el-input v-model="temp.qq" placeholder="QQ"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.wechat_number')" prop="wechat_number">
          <el-input v-model="temp.wechat_number" placeholder="微信号"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
import { fetchList, createManager, updateManager, deleteManager } from '@/api/manager'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const stateKeyValue = {
  1: '正常',
  2: '冻结'
}
const managerTypeOptions = [
  { key: 1, display_name: '管理员' },
  { key: 2, display_name: '公众号管理员' },
  { key: 3, display_name: '运营者' }
]
// arr to obj ,such as { CN : "China", US : "USA" }
const managerTypeKeyValue = managerTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'managerList',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        limit: 20,
        offset: 0,
        showDelete: false,
        state: undefined,
        keyword: undefined,
        type: undefined,
        sort: '+id'
      },
      stateKeyValue,
      managerTypeOptions,
      temp: {
        id: undefined,
        state: undefined,
        keyword: '',
        timestamp: new Date(),
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑管理员',
        create: '添加管理员'
      },
      dialogPvVisible: false,
      rules: {
        type: [{ required: true, message: '请选择用户身份', trigger: 'change' }],
        login_name: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6-16个字符', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
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
    },
    mangerTypeFilter(type) {
      return managerTypeKeyValue[type]
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

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
    resetTemp() {
      this.temp = {
        id: undefined,
        keyword: '',
        timestamp: new Date(),
        name: '',
        status: undefined,
        type: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createManager(this.temp).then((response) => {
            this.list.unshift(response.data.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateManager(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      deleteManager(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
