<template>
  <div class="message">
    <div class="left">
      <h1>发送通知列表</h1>
      <div class="message-list">
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
      <div class="add-button" @click="addSend">
        <el-icon><CirclePlus /></el-icon>
        <span>新增</span>
      </div>
    </div>
    <div class="right">
      <addNotification ref="addNotification" @get-list="getList" v-if="addFlag == 1" />
      <infoNotification ref="infoNotification" v-else-if="addFlag == 2" />
    </div>
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import addNotification from "./addNotification.vue";
import infoNotification from "./infoNotification.vue";
import { notification_sender_list, notification_sender_delete } from "@/api/modules/notification.js";
export default {
  components: {
    addNotification,
    infoNotification
  },
  data() {
    return {
      tipsObj: {
        1: "普通信息",
        2: "提示信息",
        3: "警告信息",
        4: "重要信息",
        5: "紧急通知"
      },
      list: [],
      addFlag: 1,
      activeId: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      notification_sender_list().then(res => {
        this.list = res.data.list;
        this.getInfo(this.list[0].id);
      });
    },
    srcLink(type) {
      return new URL(`../../assets/images/message/level${type}.svg`, import.meta.url);
    },
    addSend() {
      this.addFlag = 1;
      this.$nextTick(() => {
        this.$refs.addNotification.init();
      });
    },
    getInfo(id) {
      this.activeId = id;
      this.addFlag = 2;
      this.$nextTick(() => {
        this.$refs.infoNotification.init(id, 1);
      });
    },
    //删除
    deleteProcess(id) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          notification_sender_delete({ id: id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.message {
  display: grid;
  grid-template-columns: 360px 1fr;
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
  .left {
    position: relative;
    height: 100%;
    overflow: hidden;
    border-right: 1px solid #f9fafb;
    > h1 {
      height: 56px;
      padding-left: 20px;
      margin: 0;
      font-size: 16px;
      font-weight: normal;
      line-height: 56px;
      color: #1f304c;
      border-bottom: 1px solid #f9fafb;
    }
    .message-list {
      box-sizing: border-box;
      height: calc(100% - 56px);
      padding: 15px 10px 90px;
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
    .add-button {
      position: absolute;
      right: 30px;
      bottom: 20px;
      left: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      font-size: 16px;
      line-height: 50px;
      color: #0ec69a;
      text-align: center;
      cursor: pointer;
      background: #e3fbf5;
      border-radius: 8px;
      > span {
        margin-left: 10px;
      }
    }
  }
  .right {
    height: 100%;
    overflow: hidden;
  }
}
</style>
