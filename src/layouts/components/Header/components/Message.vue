<template>
  <div class="message">
    <el-popover placement="bottom" :width="800" trigger="click">
      <template #reference>
        <el-badge :value="numberTips" class="item">
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <div :class="['message-content', { 'message-content-active': !detailFlag }]">
        <div style="padding-right: 10px; border-right: 1px solid #cccccc">
          <div class="message-tab">
            <div @click="selectType(0)" :class="{ active: flag == 0 }">未读消息</div>
            <div @click="selectType(1)" :class="{ active: flag == 1 }">已读消息</div>
          </div>
          <div class="message-list" v-if="list.length > 0">
            <div
              @click="getInfo(v.id)"
              :class="['message-item', { 'message-item-active': activeId == v.id }]"
              v-for="v in list"
              :key="v.id"
            >
              <img :src="srcLink(v.level)" alt="" srcset="" />
              <div>
                <h1>{{ tipsObj[v.level] }}</h1>
                <h2>{{ v.title }}</h2>
              </div>
              <img
                @click="deleteProcess(v.id)"
                class="delete-icon"
                style="width: 18px; height: 18px"
                src="@/assets/images/enterpriseSetup/delete-circle-2.svg"
                alt=""
              />
            </div>
          </div>
          <div v-else style="margin: 100px 0; color: #999999; text-align: center">
            <img src="@/assets/images/notData.png" alt="" srcset="" />
            <p>暂无数据</p>
          </div>
        </div>
        <div v-if="detailFlag" style="height: 400px; overflow: auto">
          <infoNotification ref="infoNotification" />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import { notification_receiver_list } from "@/api/modules/notification.js";
import infoNotification from "@/views/notification/infoNotification.vue";
export default {
  components: {
    infoNotification
  },
  data() {
    return {
      flag: 0,
      tipsObj: {
        1: "普通信息",
        2: "提示信息",
        3: "警告信息",
        4: "重要信息",
        5: "紧急通知"
      },
      list: [],
      numberTips: 0,
      activeId: "",
      detailFlag: false
    };
  },
  mounted() {
    this.selectType(0);
  },
  methods: {
    selectType(type) {
      this.flag = type;
      // this.getList();
    },
    getList() {
      notification_receiver_list(`status=${this.flag}`).then(res => {
        this.detailFlag = false;
        this.list = res.data.list;
        if (this.flag == 0) {
          this.numberTips = this.list.length;
        }
      });
    },
    getInfo(id) {
      this.detailFlag = true;
      this.$nextTick(() => {
        this.$refs.infoNotification.init(id, 2);
      });
    },
    srcLink(type) {
      return new URL(`../../../../assets/images/message/level${type}.svg`, import.meta.url);
    }
  }
};
</script>

<style scoped lang="scss">
.message-content {
  display: grid;
  grid-template-columns: 1.3fr 2fr;
  .message-tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    background: #f4f6fa;
    border: 1px solid #f4f6fa;
    border-radius: 20px;
    div {
      width: 50%;
      height: 36px;
      font-size: 16px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      border-radius: 20px;
    }
    .active {
      color: #0ec69a;
      background: #ffffff;
    }
  }
  .message-list {
    box-sizing: border-box;
    height: 360px;
    padding: 15px 10px 20px;
    overflow: auto;
    .message-item {
      position: relative;
      display: grid;
      grid-template-columns: 50px 1fr;
      padding: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      border-radius: 8px;
      > img {
        width: 50px;
        height: 50px;
      }
      .delete-icon {
        position: absolute;
        top: 15px;
        right: 10px;
      }
      > div {
        > h1 {
          width: 250px;
          margin: 2px 0 4px;
          overflow: hidden;
          font-size: 16px;
          font-weight: normal;
          color: #1f304c;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > h2 {
          width: 270px;
          margin: 0;
          overflow: hidden;
          font-size: 14px;
          font-weight: normal;
          color: #4a5975;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .message-item-active {
      background: #f9fafb;
    }
  }
}
.message-content-active {
  grid-template-columns: 1fr;
}
</style>
