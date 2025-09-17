<template>
  <div class="table-box">
    <!-- 新增 -->
    <h1>
      <span :class="{ active: flag === 1 }" @click="featch(1)">通话费率</span>
      <span :class="{ active: flag === 2 }" @click="featch(2)">留言费率</span>
    </h1>
    <div style="padding: 20px">
      <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
        <div v-if="flag == 1 || flag == 2">
          <el-row>
            <el-col :span="10">
              <div style="padding: 10px; margin-bottom: 15px; background: #f4f6fa; border-radius: 15px">
                学校名称：<span style="font-weight: bold; color: #409eff">{{ schoolName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="费率值（元/分钟）" prop="rate">
                <el-input-number style="width: 100%" :step="0.05" v-model.number="form.rate" :min="0" :max="1000">
                  <template #prefix>
                    <span>￥</span>
                  </template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="套餐描述" prop="templateDescription">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="form.templateDescription"
                  :maxlength="500"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-row :gutter="10">
        <el-col :span="10">
          <div style="margin-top: 10px; text-align: left">
            <el-button type="primary" @click="confirmAdd">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { schoolcallratedata, schoolcallrate, schoolmessageratedata, schoolmessagerate } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      isloading: false,
      isloading1: false,
      flag: 1,
      form: {
        schoolId: "",
        rate: "",
        templateDescription: "",
        status: 1
      },
      linkRules: {
        rate: [{ required: true, message: "必填项", trigger: "blur" }],
        videoCallMinutes: [{ required: true, message: "必填项", trigger: "blur" }],
        basePrice: [{ required: true, message: "必填项", trigger: "blur" }],
        totalMonths: [{ required: true, message: "必填项", trigger: "blur" }],
        firstMonthRatio: [{ required: true, message: "必填项", trigger: "blur" }],
        monthlyDecrease: [{ required: true, message: "必填项", trigger: "blur" }],
        startTime: [{ required: true, message: "必填项", trigger: "blur" }],
        endTime: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    schoolId() {
      return useUserStore().schoolMsg.schoolId ? Number(useUserStore().schoolMsg.schoolId) : "";
    },
    schoolName() {
      return useUserStore().schoolMsg.schoolName;
    }
  },
  watch: {
    schoolId: {
      handler(newVal) {
        if (newVal) {
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    getMonthsDiff() {
      // 将字符串解析为 Date 对象
      const date1 = new Date(this.form.startTime);
      const date2 = new Date(this.form.endTime);

      // 检查是否为有效日期
      if (isNaN(date1) || isNaN(date2)) {
        return;
      }

      // 计算年份和月份的差值
      const yearDiff = date2.getFullYear() - date1.getFullYear();
      const monthDiff = date2.getMonth() - date1.getMonth();
      // 总月数差
      this.form.totalMonths = yearDiff * 12 + monthDiff + 1;
    },
    featch(flag) {
      this.flag = flag;
      this.fetchTenantList();
    },
    fetchTenantList() {
      if (this.schoolId == -1) {
        this.$message.warning("请先选择学校");
        return;
      }
      if (this.flag == 1) {
        if (this.isloading) return;
        this.isloading = true;
        schoolcallratedata({ schoolId: this.schoolId }).then(res => {
          if (res.code == 0 && res.data) {
            this.form = res.data;
          } else {
            this.form = {};
          }
          this.isloading = false;
        });
        return;
      }
      if (this.flag == 2) {
        if (this.isloading1) return;
        this.isloading1 = true;
        schoolmessageratedata({ schoolId: this.schoolId }).then(res => {
          if (res.code == 0 && res.data) {
            this.form = res.data;
          } else {
            this.form = {};
          }
          this.isloading1 = false;
        });
        return;
      }
    },
    confirmAdd() {
      if (this.schoolId == -1) {
        this.$message.warning("请先选择学校");
        return;
      }
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          // this.form.packageContent.videoCallMinutes = this.form.videoCallMinutes;
          this.form.schoolId = this.schoolId;
          if (this.flag == 1) {
            schoolcallrate(this.form).then(res => {
              if (res.code == 0) {
                this.$message.success("保存成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          if (this.flag == 2) {
            schoolmessagerate(this.form).then(res => {
              if (res.code == 0) {
                this.$message.success("保存成功");
                this.fetchTenantList();
              }
            });
            return;
          }
        }
      });
    },
    getDaysInMonth(dateStr) {
      const [year, month] = dateStr.split("-").map(Number);
      const lastDay = new Date(year, month, 0);
      return lastDay.getDate();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
