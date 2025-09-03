<template>
  <div class="table-box">
    <!-- 新增 -->
    <h1>
      <span :class="{ active: flag === 1 }" @click="featch(1)">通话费率</span>
      <span :class="{ active: flag === 2 }" @click="featch(2)">留言费率</span>
      <!-- <span :class="{ active: flag === 3 }" @click="featch(3)">通用套餐</span>
      <span :class="{ active: flag === 4 }" @click="featch(4)">固定套餐</span> -->
    </h1>
    <div style="padding: 20px">
      <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
        <div v-if="flag == 1 || flag == 2">
          <el-row>
            <el-col :span="10">
              <el-form-item label="费率值（元/分钟）" prop="rate">
                <el-input-number style="width: 100%" v-model.number="form.rate" :min="0.01" :max="1000">
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
        <div v-if="flag == 5">
          <el-row>
            <el-col :span="10">
              <el-form-item label="语音通话时长（分钟/月）" prop="videoCallMinutes">
                <el-input-number style="width: 100%" v-model.number="form.videoCallMinutes" :min="1">
                  <template #prefix>
                    <span>
                      <el-icon><Microphone /></el-icon>
                    </span>
                  </template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="基础价格（元/月）" prop="basePrice">
                <el-input-number style="width: 100%" v-model.number="form.basePrice" :min="0">
                  <template #prefix>
                    <span>￥</span>
                  </template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="套餐总月数" prop="totalMonths">
                <el-input-number style="width: 100%" v-model.number="form.totalMonths" :min="1"> </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="是否支持首月比例扣款" prop="firstMonthRatio">
                <el-select v-model="form.firstMonthRatio">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="false">
            <el-col :span="10">
              <el-form-item label="年级">
                <el-select multiple clearable style="width: 100%" v-model="form.gradeIds">
                  <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="21">
              <el-form-item label="模板说明" prop="templateDescription">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="form.templateDescription"
                  :maxlength="500"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="21">
              <el-form-item label="使用规则" prop="usageRules">
                <el-input type="textarea" :rows="3" v-model="form.usageRules" :maxlength="1000" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="flag == 5">
          <el-row>
            <el-col :span="10">
              <el-form-item label="语音通话时长（分钟/月）" prop="videoCallMinutes">
                <el-input-number style="width: 100%" v-model.number="form.videoCallMinutes" :min="1">
                  <template #prefix>
                    <span>
                      <el-icon><Microphone /></el-icon>
                    </span>
                  </template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="基础价格（元/月）" prop="basePrice">
                <el-input-number style="width: 100%" v-model.number="form.basePrice" :min="0">
                  <template #prefix>
                    <span>￥</span>
                  </template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="套餐总月数" prop="totalMonths">
                <el-input-number :disabled="true" style="width: 100%" v-model.number="form.totalMonths" :min="1">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="是否按月递减计费" prop="monthlyDecrease">
                <el-select v-model="form.monthlyDecrease">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  @change="getMonthsDiff"
                  style="width: 100%"
                  v-model="form.startTime"
                  :value-format="'YYYY-MM'"
                  :format="'YYYY-MM'"
                  type="month"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  @change="getMonthsDiff"
                  style="width: 100%"
                  v-model="form.endTime"
                  :value-format="'YYYY-MM'"
                  :format="'YYYY-MM'"
                  type="month"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="false">
            <el-col :span="10">
              <el-form-item label="年级">
                <el-select multiple clearable style="width: 100%" v-model="form.gradeIds">
                  <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="21">
              <el-form-item label="模板说明" prop="templateDescription">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="form.templateDescription"
                  :maxlength="500"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="21">
              <el-form-item label="使用规则" prop="usageRules">
                <el-input type="textarea" :rows="3" v-model="form.usageRules" :maxlength="1000" show-word-limit></el-input>
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
import {
  gradesList,
  schoolcallratedata,
  schoolcallrate,
  schoolmessageratedata,
  schoolmessagerate,
  schoolgeneraldata,
  schoolgeneral,
  schoolfixeddata,
  schoolfixed
} from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      flag: 1,
      gradesList: [],
      form: {
        schoolId: "",
        rate: "",
        templateDescription: "",
        status: 1,
        // 学校通用套餐
        gradeIds: [],
        packageContent: {},
        videoCallMinutes: 1,
        basePrice: 0,
        totalMonths: 0,
        firstMonthRatio: "",
        templateDescription: "",
        usageRules: "",
        monthlyDecrease: "",
        startTime: "",
        endTime: ""
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
    }
  },
  watch: {
    schoolId: {
      handler(newVal) {
        if (newVal) {
          this.fetchTenantList();
          this.getGradesList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchTenantList();
    this.getGradesList();
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
        schoolcallratedata({ schoolId: this.schoolId }).then(res => {
          if (res.code == 0 && res.data) {
            this.form = res.data;
          } else {
            this.form = {};
          }
        });
        return;
      }
      if (this.flag == 2) {
        schoolmessageratedata({ schoolId: this.schoolId }).then(res => {
          if (res.code == 0 && res.data) {
            this.form = res.data;
          } else {
            this.form = {};
          }
        });
        return;
      }
      if (this.flag == 3) {
        schoolgeneraldata({ schoolId: this.schoolId }).then(res => {
          if (res.code == 0 && res.data) {
            let gradeIds = [];
            res.data.boundGrades.map(v => {
              gradeIds.push(v.id);
            });
            this.form = res.data;
            this.form.gradeIds = gradeIds;
            this.form.videoCallMinutes = res.data.packageContent.videoCallMinutes;
          } else {
            this.form = {};
          }
        });
        return;
      }
      if (this.flag == 4) {
        schoolfixeddata({ schoolId: this.schoolId }).then(res => {
          if (res.code == 0 && res.data) {
            let gradeIds = [];
            res.data.boundGrades.map(v => {
              gradeIds.push(v.id);
            });
            this.form = res.data;
            this.form.gradeIds = gradeIds;
            this.form.videoCallMinutes = res.data.packageContent.videoCallMinutes;
          } else {
            this.form = {};
          }
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
          this.form.packageContent.videoCallMinutes = this.form.videoCallMinutes;
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
          if (this.flag == 3) {
            schoolgeneral(this.form).then(res => {
              if (res.code == 0) {
                this.$message.success("保存成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          if (this.flag == 4) {
            this.form.startTime = this.form.startTime.substring(0, 7) + "-01";
            let str = this.getDaysInMonth(this.form.endTime);
            this.form.endTime = this.form.endTime.substring(0, 7) + "-" + str;
            schoolfixed(this.form).then(res => {
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
    },
    getGradesList() {
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&enrollYear=-1`;
      gradesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.gradesList = res.data.list;
        } else {
          this.gradesList = [];
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
