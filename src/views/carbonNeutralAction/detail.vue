<template>
  <div class="detail">
    <el-button class="back" type="primary" size="default" @click="goback" plain>返回</el-button>
    <div>
      <h1>{{ detail.title }}</h1>
      <div class="footer-info">
        <p>时间:{{ detail.created_at }}</p>
        <p>数据类型:{{ detail.data_type == 1 ? "采集" : "录入" }}</p>
      </div>
      <div class="content">
        <div v-html="detail.content"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object
    }
  },
  emits: ["goback"],
  data() {
    return {};
  },
  methods: {
    goback() {
      this.$emit("goback");
    }
  }
};
</script>
<style lang="scss" scoped>
.detail {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  .back {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  > div {
    padding: 20px;
    background: #ffffff;
    border-radius: 10px;
    h1 {
      margin: 0;
      margin-bottom: 10px;
      font-size: 26px;
      color: #1f304c;
      text-align: center;
    }
    .footer-info {
      display: flex;
      justify-content: center;
      margin: 15px 0;
      font-size: 16px;
      color: #8894b3;
      > p {
        margin: 0 10px;
      }
    }
    .content {
      font-size: 16px;
      line-height: 26px;
      color: #4a5975;
    }
  }
}
</style>
