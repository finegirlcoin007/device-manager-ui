// 单文件上传及展示

<template>
  <div class="my-upload">
    <label>
      <el-button icon="el-icon-upload" size="mini" :loading="loading">{{
        loading ? "上传中..." : tip
      }}</el-button>
      <input
        type="file"
        @change="chooseFile"
        :disabled="loading"
        ref="referenceUpload"
      />
    </label>
    <div v-if="value" class="flex">
      <div style="margin-right: 20px">
        <div v-if="type === 'thumb'" class="thumb" :style="imgCover"></div>
        <div v-else>文件名: {{ value }}</div>
      </div>
      <!--      <div>
        <el-button icon="el-icon-delete" size='mini' plain @click='del'>删除</el-button>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    type: {
      // 展示类型，文件名或缩略图 filename | thumb
      type: String,
      default: "filename",
    },
    tip: {
      // 按钮文字
      type: String,
      default: "上传文件",
    },
    prePath: {
      type: String,
      default: "",
    },
  },
  methods: {
    del() {
      this.$emit("input", "");
    },
    async chooseFile(e) {
      this.loading = true;
      try {
        const { code, url } = await this.$upload("file/upload", {
          uploadFile: e.target.files[0],
          prePath: this.prePath,
        });
        if (code === 1) {
          this.$emit("input", url);
        } else {
          this.$message.error("上传文件失败");
        }
      } catch (error) {
        this.$message.error(error.message);
      }
      this.loading = false;
      this.$refs.referenceUpload.value = null;
    },
  },
  computed: {
    imgCover() {
      return `background-image: url(${this.value})`;
    },
  },
  data() {
    return {
      loading: false,
    };
  },
};
</script>

<style lang="less">
.my-upload {
  label {
    position: relative;
    input {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
  .thumb {
    width: 80px;
    height: 80px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
  }
  p {
    color: #666;
    font-size: 14px;
  }
}
</style>



