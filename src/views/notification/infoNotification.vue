<template>
  <div class="add-notification">
    <h1>{{ tipsObj[infoObj.level] }}</h1>
    <h1 class="title">{{ infoObj.title }}</h1>
    <div class="content">
      {{ infoObj.content }}
    </div>
    <div class="time">
      {{ infoObj.created_at }}
    </div>
    <h2>
      <span></span>
      {{ infoType == 1 ? "接收方" : "发送者" }}
    </h2>
    <div class="access-list" v-if="infoType == 1">
      <div style="padding: 15px 20px">
        <div class="access-box" v-for="v in infoObj.receiver_list" :key="v.id">
          <span>{{ v.name }}</span>
          <span> </span>
        </div>
      </div>
    </div>
    <div class="access-list" v-if="infoType == 2">
      <div style="padding: 15px 20px">
        <div class="access-box">
          <span>{{ infoObj.create_name }}</span>
          <span> </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { notification_sender_info, notification_receiver_info } from "@/api/modules/notification.js";
export default {
  name: "InfoNotification",
  emits: ["getList"],
  data() {
    return {
      infoObj: {},
      tipsObj: {
        1: "普通信息",
        2: "提示信息",
        3: "警告信息",
        4: "重要信息",
        5: "紧急通知"
      },
      infoType: ""
    };
  },
  methods: {
    init(id, val) {
      this.infoType = val;
      if (val == 1) {
        this.getInfo(id);
      } else if (val == 2) {
        this.getInfoReceiver(id);
      }
    },
    getInfo(id) {
      notification_sender_info({ id: id }).then(res => {
        this.infoObj = res.data;
      });
    },
    getInfoReceiver(id) {
      notification_receiver_info({ id: id }).then(res => {
        this.infoObj = res.data;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.add-notification {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  overflow: auto;
  > h1 {
    height: 56px;
    margin: 0;
    font-size: 16px;
    font-weight: normal;
    line-height: 80px;
    color: #4a5975;
  }
  .title {
    height: 50px;
    font-size: 20px;
    line-height: 50px;
    color: #1f304c;
  }
  .content {
    font-size: 16px;
    line-height: 24px;
    color: #4a5975;
  }
  .time {
    margin-top: 10px;
    font-size: 14px;
    color: #8894b3;
    text-align: right;
  }
  > h2 {
    display: flex;
    align-items: center;
    height: 50px;
    margin: 0;
    font-size: 14px;
    font-weight: normal;
    line-height: 50px;
    color: #4a5975;
    > span {
      display: inline-block;
      width: 4px;
      height: 16px;
      margin-right: 10px;
      background-color: #0ec69a;
    }
  }
  .access-list {
    background: #f9fafb;
    border-radius: 8px;
    .radio-box {
      padding: 10px 20px;
      border-bottom: 1px solid #dee2eb;
    }
    .access-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
      color: #1f304c;
      cursor: pointer;
      i {
        color: #0ec69a;
      }
    }
    .message-level {
      border: none;
    }
  }
}
</style>
