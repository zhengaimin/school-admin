<template>
  <div class="add-notification">
    <h1>新增通知</h1>
    <el-input v-model="form.title" style="width: 100%; margin-bottom: 15px" size="large" placeholder="请输入标题"></el-input>
    <el-input
      v-model="form.content"
      style="width: 100%"
      :autosize="{ minRows: 10, maxRows: 20 }"
      type="textarea"
      placeholder="请输入正文"
    />
    <h2>
      <span></span>
      接收方
    </h2>
    <div class="access-list">
      <div class="radio-box">
        <el-radio-group v-model="form.visibility" @change="selectType">
          <el-radio :value="Number(1)">合作方账号</el-radio>
          <el-radio :value="Number(4)">全部合作方账号</el-radio>
          <el-radio :value="Number(5)">全部账号</el-radio>
          <!-- <el-radio :value="Number(1)">人员</el-radio> -->
        </el-radio-group>
      </div>
      <div class="access-outer-box" style="padding: 15px 20px">
        <div @click="selectCom(v.id)" class="access-box" v-for="v in accessList" :key="v.id">
          <span>{{ v.name }}</span>
          <span v-show="form.recipient_ids.includes(v.id)">
            <el-icon><Select /></el-icon>
          </span>
        </div>
      </div>
    </div>
    <h2>
      <span></span>
      信息级别
    </h2>
    <div class="access-list">
      <div class="radio-box message-level">
        <el-radio-group v-model="form.level">
          <el-radio :value="Number(1)">普通信息级别</el-radio>
          <el-radio :value="Number(2)">提示级别</el-radio>
          <el-radio :value="Number(3)">警告级</el-radio>
          <el-radio :value="Number(4)">重要级</el-radio>
          <el-radio :value="Number(5)">紧急级</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div>
      <el-button type="primary" style="margin-top: 20px" @click="send">发送通知</el-button>
    </div>
  </div>
</template>
<script>
// import { tenantList, user_tenantList } from "@/api/modules/InternalPage.js";
import { tenantList, user_tenantList } from "@/api/modules/InternalPage.js";
import { notification_sender_add } from "@/api/modules/notification.js";
export default {
  name: "AddNotification",
  emits: ["getList"],
  data() {
    return {
      list: [],
      // org_type: "1,2",
      form: {
        title: "",
        content: "",
        visibility: 1,
        recipient_ids: [],
        level: 1
      },
      accessList: []
    };
  },
  methods: {
    init() {
      this.form.visibility = 1;
      this.form.level = 1;
      this.form.recipient_ids = [];
      this.tenantList();
    },
    selectType() {
      this.form.recipient_ids = [];
      // let obj = {
      //   3: "1,2",
      //   2: 3
      // };
      // this.org_type = obj[this.form.visibility];
      if (this.form.visibility == 1) {
        this.user_tenantList();
      } else if (this.form.visibility == 4) {
        this.accessList = [];
      } else if (this.form.visibility == 5) {
        this.accessList = [];
      }
    },
    tenantList() {
      tenantList(`page=1&page_size=100`).then(res => {
        if (res.code == 0) {
          this.accessList = res.data.list;
        } else {
          this.accessList = [];
        }
      });
    },
    user_tenantList() {
      user_tenantList(`page=1&page_size=100`).then(res => {
        if (res.code == 0) {
          this.accessList = res.data.list;
        } else {
          this.accessList = [];
        }
      });
    },
    selectCom(id) {
      if (this.form.recipient_ids.includes(id)) {
        this.form.recipient_ids = this.form.recipient_ids.filter(v => v != id);
      } else {
        this.form.recipient_ids.push(id);
      }
    },
    send() {
      if (!this.form.title) {
        this.$message.error("请输入标题");
        return;
      }
      if (!this.form.content) {
        this.$message.error("请输入内容");
        return;
      }
      if (this.form.visibility == 1 && this.form.recipient_ids.length == 0) {
        this.$message.error("请选择接收方");
        return;
      }
      notification_sender_add(this.form).then(res => {
        if (res.code == 0) {
          this.$message.success("发送成功");
          this.$emit("getList");
        } else {
          this.$message.error(res.msg);
        }
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
    line-height: 56px;
    color: #4a5975;
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
    .access-outer-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      .access-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        padding-right: 10px;
        padding-left: 10px;
        font-size: 14px;
        color: #1f304c;
        cursor: pointer;
        border: 1px solid #dee2eb;
        border-radius: 5px;
        > span {
          display: flex;
          align-items: center;
          i {
            font-size: 18px;
            color: #0ec69a;
          }
        }
      }
      .message-level {
        border: none;
      }
    }
  }
}
</style>
