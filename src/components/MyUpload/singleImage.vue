<template>
    <div class="upload-container">
        <el-upload class="image-uploader"
                   :data="dataObj"
                   drag :multiple="false"
                   :show-file-list="false"
                   action="http://wechat.51outsource.top/api/upload"
                   :on-success="handleImageSuccess"
                   :before-upload="beforeUpload"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="image-preview">
            <div class="image-preview-wrapper" v-show="imageUrl.length>1">
                <img :src="imageUrl+'?imageView2/1/w/200/h/200'">
                <div class="image-preview-action">
                    <i @click="rmImage" class="el-icon-delete"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'singleImageUpload',
  props: {
    value: String
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { }
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(res, file) {
      this.tempUrl = res.data.tmpPath
      this.emitInput(this.tempUrl)
    },
    beforeUpload(file) {
      var checkType = true
      if (file.type !== 'image/jpeg' &&
          file.type !== 'image/jpg' &&
          file.type !== 'image/png' &&
          file.type !== 'image/gif'
      ) {
        checkType = false
        this.$message.error('上传头像图片只能是 JPG,JPEG,PNG,GIF 格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return checkType && isLt2M
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .upload-container {
        width: 100%;
        position: relative;
        @include clearfix;
        .image-uploader {
            width: 60%;
            float: left;
        }
        .image-preview {
            width: 200px;
            height: 200px;
            position: relative;
            border: 1px dashed #d9d9d9;
            float: left;
            margin-left: 50px;
            .image-preview-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .image-preview-action {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: rgba(0, 0, 0, .5);
                transition: opacity .3s;
                cursor: pointer;
                text-align: center;
                line-height: 200px;
                .el-icon-delete {
                    font-size: 36px;
                }
            }
            &:hover {
                .image-preview-action {
                    opacity: 1;
                }
            }
        }
    }

</style>
