<template>
    <div class="app-container" style="margin-top: 20px">
        <el-table :data="wechatList" v-loading.body="wechatLoading" style="width: 200px">
            <el-table-column style="color: #ecf5ff" min-width="200px" label="公众号列表">
                <template slot-scope="scope">
                    <el-radio @change='changeStatus' v-model="oa_wechat_id" :label="scope.row.id">{{ scope.row.name }}</el-radio>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { fetchList as fetchWechatList } from '@/api/wechat'
export default {
  name: 'leftList',
  data() {
    return {
      oa_wechat_id: null,
      wechatList: null,
      wechatLoading: true,
      wechatQuery: {
        keyword: undefined,
        state: 1,
        offset: 0,
        limit: 2000
      }
    }
  },
  created() {
    this.getWechatList()
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    getWechatList() {
      fetchWechatList(this.wechatQuery).then(response => {
        this.wechatList = response.data.data
        this.wechatLoading = false
      })
    },
    changeStatus() {
      this.emitInput(this.oa_wechat_id)
      this.$emit('handleFilter')
    }
  }
}
</script>

<style scoped>

</style>