<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label for="name">请选择</label>
      <el-date-picker
        @change="selectDate(2)"
        v-if="fill_frequency == 2 || fill_frequency == 0"
        v-model="year"
        value-format="YYYY"
        type="year"
        placeholder="请选择"
      />
      <el-date-picker
        @change="selectDate(1)"
        v-if="fill_frequency == 1"
        v-model="year_month"
        format="YYYY/MM"
        value-format="YYYY-MM"
        type="month"
        placeholder="请选择"
      />
    </div>
    <monthDom ref="monthDom" :is-edit="isEdit" v-if="fill_frequency == 2" :fill_frequency="fill_frequency" />
    <dayDom ref="dayDom" :is-edit="isEdit" v-else-if="fill_frequency == 1" :fill_frequency="fill_frequency" />
    <el-dialog v-model="dialogTableVisible" title="设置年度填报频率" width="600">
      <div class="tips-msg">
        <el-icon><WarningFilled /></el-icon>
        产品产量填报维度的配置，与消耗量一致，并且仅支持一年配置一次，请确认后进行设置。
      </div>
      <div class="radio-box">
        <el-radio-group v-model="frequencyVal">
          <el-radio-button label="按月" value="2" />
          <el-radio-button label="按日" value="1" />
        </el-radio-group>
      </div>
      <div style="flex: auto; padding-right: 20px; text-align: right">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { useUserStore } from "@/stores/modules/user";
import { api_list } from "@/api/modules/menu.js";
import { com_year_config, com_year_config_set } from "@/api/modules/carbonAnalysis.js";
import monthDom from "./monthDom.vue";
import dayDom from "./dayDom.vue";
export default {
  components: { monthDom, dayDom },
  data() {
    return {
      buttonList: [],
      fill_frequency: 0,
      year: "",
      year_month: "",
      dialogTableVisible: false,
      frequencyVal: 2
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    isEdit() {
      return this.buttonList.includes("system") || this.buttonList.includes("edit");
    }
  },
  mounted() {
    this.year = new Date().getFullYear().toString();
    let month = new Date().getMonth() + 1;
    this.month = month < 10 ? "0" + month : month;
    this.initPage();
  },
  methods: {
    initPage() {
      this.base_info();
      this.api_list();
    },
    base_info() {
      com_year_config(`year=${this.year}`).then(res => {
        this.fill_frequency = res.data.fill_frequency;
        if (this.fill_frequency == 0) {
          this.dialogTableVisible = true;
          return;
        }
        // 2 按月填写 1 按日填写
        if (this.fill_frequency == 1) {
          this.year_month = `${this.year}/${this.month}`;
          this.$nextTick(() => {
            this.$refs.dayDom.initPage(this.year_month);
          });
        } else if (this.fill_frequency == 2) {
          this.$nextTick(() => {
            this.$refs.monthDom.initPage(this.year);
          });
        }
      });
    },
    confirmClick() {
      let params = {
        year: Number(this.year),
        fill_frequency: Number(this.frequencyVal)
      };
      com_year_config_set(params).then(res => {
        if (res.code == 0) {
          this.$message.success("设置成功");
          this.dialogTableVisible = false;
          this.initPage();
        }
      });
    },
    selectDate(val) {
      if (val == 1) {
        let year_month = this.year_month.replace("-", "/");
        this.year = year_month.split("/")[0];
        this.month = year_month.split("/")[1];
        this.base_info();
      } else {
        this.base_info();
      }
    },
    api_list() {
      //获取路由地址
      let path = `path=${this.$router.currentRoute.value.fullPath}&menu_type=F&visible=0`;
      api_list(path).then(res => {
        if (res.data.list && res.data.list.length > 0) {
          res.data.list.map(v => {
            this.buttonList.push(v.title);
          });
        } else {
          this.buttonList = [];
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.fossil-fuel {
  position: relative;
  height: 100%;
  overflow: auto;
  .filter-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 20px 0;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 10px;
    > label {
      margin: 0 10px 0 20px;
      font-size: 14px;
      color: #4a5975;
    }
    > span {
      margin-right: 20px;
      font-size: 14px;
      color: #4a5975;
    }
  }
  .content {
    background: #ffffff;
    border-radius: 10px;
    > h1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 20px;
      margin: 0;
      border-bottom: 1px solid #ebeef5;
      > span {
        font-size: 16px;
        font-weight: 500;
        color: #4a5975;
      }
      > div {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: normal;
        > span {
          display: inline-block;
          height: 56px;
          margin-right: 20px;
          line-height: 56px;
          color: #1f304c;
          cursor: pointer;
        }
        .active {
          color: #0ec69a;
          border-bottom: 2px solid #0ec69a;
        }
        > label {
          margin: 0 10px 0 20px;
          font-size: 14px;
          color: #4a5975;
        }
      }
    }
    .set-box {
      padding: 0 20px;
      .company-box {
        display: grid;
        grid-template-columns: auto auto;
      }
      > h2 {
        display: flex;
        align-items: center;
        padding: 15px 0;
        margin: 0;
        font-size: 15px;
        font-weight: normal;
        color: #4a5975;
        > span {
          padding: 2px 10px;
          font-size: 18px;
          color: #ffffff;
          background: #0ec69a;
          border-radius: 5px;
          > span {
            font-size: 13px;
          }
        }
      }
      h3 {
        padding: 20px;
        margin: 0;
        background: #f9fafb;
        border: 1px solid rgb(222 226 235 / 100%);
        border-radius: 6px 0 0 6px;
        h4 {
          margin: 0;
          margin-bottom: 10px;
          font-size: 15px;
          font-weight: normal;
          color: #1f304c;
        }
      }
    }
    .month-box {
      display: grid;
      grid-template-columns: auto auto auto auto auto auto;
      padding: 0 20px 20px;
      > div {
        padding: 20px;
        background: #f9fafb;
        border: 1px solid rgb(222 226 235 / 100%);
        p {
          margin: 0;
          margin-bottom: 10px;
          text-align: right;
        }
      }
    }
  }
}
.tips-msg {
  display: flex;
  align-items: center;
  color: #ff0000;
  i {
    margin-right: 5px;
    font-size: 18px;
    color: #ff0000;
  }
}
.radio-box {
  margin-top: 20px;
}
</style>
