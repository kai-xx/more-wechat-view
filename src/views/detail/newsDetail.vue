<template>
  <div class="app-container" style="padding: 40px">
    <el-row>
      <el-col :span="24">
        <p style="text-align: center">{{ info.title }}</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="font-size: 9px;text-align: left">{{ info.wechat_name }}</el-col>
      <el-col :span="12" style="font-size: 9px;text-align: right">{{ info.created_at | parseTime('{y}-{m}-{d}') }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="editor-content" v-html="info.content"></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div >
          <img :src="info.path"/>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>
          <img :src="info.qrcode_path"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { showDetail } from '@/api/news'

export default {
  name: 'newsList',
  data() {
    return {
      info: {
        title: undefined,
        wechat_name: undefined,
        created_at: undefined,
        content: undefined,
        path: undefined,
        qrcode_path: undefined
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
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.showNewsInfo(id)
  },
  methods: {
    showNewsInfo(id) {
      showDetail(id).then(response => {
        this.info = response.data.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  p {
    width: 100%;
  }
  img {
    width: 100%;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
