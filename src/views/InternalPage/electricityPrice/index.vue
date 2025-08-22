<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label>省份</label>
      <el-select @focus="locations" style="width: 20%" v-model="filterForm.region_code" clearable size="default">
        <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <label>开始年份</label>
      <el-date-picker style="width: 20%" value-format="x" v-model="filterForm.start_time" type="year" />
      <label>结束年份</label>
      <el-date-picker style="width: 20%" value-format="x" v-model="filterForm.end_time" type="year" />
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span>电价区域政策列表</span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="省份" prop="province" align="left"> </el-table-column>
          <el-table-column label="有效期开始时间" prop="effective_start" align="left"> </el-table-column>
          <el-table-column label="有效期结束时间" prop="effective_end" align="left">
            <template #default="{ row }">
              <span v-if="false">{{ row.effective_end }}</span>
              \
            </template>
          </el-table-column>
          <el-table-column label="是否启用" align="left">
            <template #default="{ row }">
              {{ row.is_active ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="130" fixed="right">
            <template #default="scope">
              <div class="table-btn">
                <div @click="detail(scope.row)">详情</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="page_size"
          :page-sizes="[10, 20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 新增电价 -->
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="11">
              <el-form-item label="省份" prop="region_code">
                <el-select style="width: 100%" v-model="linkRuleForm.region_code" clearable size="default">
                  <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="有效期开始时间" prop="name">
                <el-date-picker style="width: 100%" value-format="x" v-model="linkRuleForm.effective_start" type="date" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">尖峰平谷时段表</el-divider>
          <el-row v-for="(item, i) in linkRuleForm.period_schedules" :key="i">
            <el-col :span="5">
              <el-form-item
                label="月份"
                :rules="{
                  required: true,
                  message: '必填项'
                }"
              >
                <el-select style="width: 100%" v-model="item.months" multiple collapse-tags clearable size="default">
                  <el-option v-for="v in monthList" :key="v.id" :label="v.name" :value="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="margin-left: 10px">
              <el-form-item
                label="时段类型"
                :rules="{
                  required: true,
                  message: '必填项'
                }"
              >
                <el-select style="width: 100%" v-model="item.period_type" size="default">
                  <el-option v-for="v in period_typeList" :key="v.id" :label="v.name" :value="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="margin-left: 10px">
              <el-form-item
                label="开始时间"
                :rules="{
                  required: true,
                  message: '必填项'
                }"
              >
                <el-time-select v-model="item.start_time" start="00:00" step="00:60" end="23:59" />
              </el-form-item>
            </el-col>
            <el-col :span="5" style="margin-left: 10px">
              <el-form-item
                label="结束时间"
                :rules="{
                  required: true,
                  message: '必填项'
                }"
              >
                <el-time-select v-model="item.end_time" start="00:00" step="00:60" end="23:59" />
              </el-form-item>
            </el-col>
            <el-col :span="1" style="margin-left: 25px">
              <el-form-item label="&nbsp">
                <img
                  @click="deleteItem(i, 1)"
                  src="@/assets/images/common/delete-circle-2.svg"
                  alt=""
                  style="width: 23px; height: 23px; margin-top: 3px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"><el-button type="primary" @click="AddItem(1)">新增</el-button></el-col>
          </el-row>
          <el-divider content-position="left">价格配置</el-divider>
          <el-row v-for="(item, i) in linkRuleForm.price_configs" :key="i">
            <el-col :span="11">
              <el-form-item
                label="时段类型"
                :rules="{
                  required: true,
                  message: '必填项'
                }"
              >
                <el-select style="width: 100%" v-model="item.period_type" size="default">
                  <el-option v-for="v in period_typeList" :key="v.id" :label="v.name" :value="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="margin-left: 10px">
              <el-form-item
                label="时段价格(元)"
                :rules="{
                  required: true,
                  message: '必填项'
                }"
              >
                <el-input v-model="item.price" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="margin-left: 15px">
              <el-form-item label="&nbsp">
                <img
                  @click="deleteItem(i, 2)"
                  src="@/assets/images/common/delete-circle-2.svg"
                  alt=""
                  style="width: 23px; height: 23px; margin-top: 3px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"><el-button type="primary" @click="AddItem(2)">新增</el-button></el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="LinkDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog v-model="detaildialog" :close-on-click-modal="false" title="详情" :width="800">
      <div style="padding-left: 20px">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="period_details_list">
          <el-table-column label="时段" prop="type_name" align="left" width="60"> </el-table-column>
          <el-table-column label="月份" prop="effective_start" align="left">
            <template #default="{ row }">
              <div v-for="(v, i) in row.month_groups" :key="i">
                {{ v.months }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="时间范围" prop="effective_start" align="left">
            <template #default="{ row }">
              <div v-for="(v, i) in row.month_groups" :key="i">
                {{ v.time_ranges }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="电价(元)" prop="price" align="left" width="90"> </el-table-column>
        </el-table>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button type="primary" @click="detaildialog = false">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import { locations } from "@/api/modules/common.js";
import {
  elec_price_add,
  elec_price_list,
  elec_price_detail,
  factor_source_delete,
  factor_source_update
} from "@/api/modules/basicLibrary.js";
export default {
  name: "FossilFuel",
  data() {
    return {
      filterForm: {
        region_code: "",
        start_time: "",
        end_time: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],
      // 新增
      provinceList: [],
      monthList: [
        { name: "1月", id: 1 },
        { name: "2月", id: 2 },
        { name: "3月", id: 3 },
        { name: "4月", id: 4 },
        { name: "5月", id: 5 },
        { name: "6月", id: 6 },
        { name: "7月", id: 7 },
        { name: "8月", id: 8 },
        { name: "9月", id: 9 },
        { name: "10月", id: 10 },
        { name: "11月", id: 11 },
        { name: "12月", id: 12 }
      ],
      period_typeList: [
        { name: "谷段", id: 0 },
        { name: "平段", id: 1 },
        { name: "高峰", id: 2 },
        { name: "尖峰", id: 3 }
      ],
      LinkDialog: false,
      linkRuleForm: {
        region_code: "",
        effective_start: "",
        period_schedules: [{}],
        price_configs: [{}]
      },
      linkRules: {
        region_code: [{ required: true, message: "必填项" }],
        effective_start: [{ required: true, message: "必填项" }]
      },
      detaildialog: false,
      period_details_list: []
    };
  },
  mounted() {
    this.elec_price_list();
  },
  methods: {
    search() {
      this.elec_price_list();
    },
    reset() {
      this.filterForm.region_code = "";
      this.filterForm.start_time = "";
      this.filterForm.end_time = "";
      this.elec_price_list();
    },
    // 获取列表
    elec_price_list() {
      console.log(this.filterForm.start_time);
      let start_time = this.filterForm.start_time ? (this.filterForm.start_time / 1000).toFixed(0) : "";
      let end_time = this.filterForm.end_time ? (this.filterForm.end_time / 1000 + 365 * 24 * 60 * 60).toFixed(0) : "";
      let str = `page=${this.page}&page_size=${this.page_size}&region_code=${this.filterForm.region_code}&start_time=${start_time}&end_time=${end_time}`;
      elec_price_list(str).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.elec_price_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.elec_price_list();
    },

    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
        this.linkRuleForm.id = row.id;
      });
    },
    addMethod() {
      this.LinkDialog = true;
      delete this.linkRuleForm.id;
      this.linkRuleForm = {
        region_code: "",
        effective_start: "",
        period_schedules: [{}],
        price_configs: [{}]
      };
      this.locations();
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    // 查询省份
    locations() {
      let linkRuleForm = `deep=0&parent_code=`;
      locations(linkRuleForm).then(res => {
        if (res.code == 0) {
          res.data.list.map(v => {
            v.id = String(v.id);
          });
          this.provinceList = res.data.list;
        }
      });
    },
    AddItem(v) {
      if (v == 1) {
        this.linkRuleForm.period_schedules.push({
          months: [],
          period_type: "",
          start_time: "",
          end_time: ""
        });
        return;
      }
      this.linkRuleForm.price_configs.push({
        period_type: "",
        price: ""
      });
    },
    deleteItem(index, v) {
      if (v == 1) {
        this.linkRuleForm.period_schedules.splice(index, 1);
        return;
      }
      this.linkRuleForm.price_configs.splice(index, 1);
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.linkRuleForm.price_configs.map(v => {
            v.price = Number(v.price);
          });
          let params = {
            region_code: this.linkRuleForm.region_code,
            effective_start: Number((this.linkRuleForm.effective_start / 1000).toFixed(0)),
            period_schedules: this.linkRuleForm.period_schedules,
            price_configs: this.linkRuleForm.price_configs
          };
          if (this.linkRuleForm.id) {
            params.id = this.linkRuleForm.id;
            factor_source_update(params).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.elec_price_list();
              }
            });
            return;
          }
          elec_price_add(params).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.elec_price_list();
            }
          });
        }
      });
    },
    // 详情
    detail(row) {
      elec_price_detail(`id=${row.id}&region_code=`).then(res => {
        if (res.code == 0) {
          this.detaildialog = true;
          this.period_details_list = res.data.period_details;
        }
      });
    },
    //删除
    deleteProcess(row) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          factor_source_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.elec_price_list();
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
.fossil-fuel {
  position: relative;
  height: 100%;
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
  }
  .table-box {
    height: calc(100% - 85px);
    background: #ffffff;
    border-radius: 10px;
    .btn-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 20px;
      > span {
        font-size: 16px;
      }
    }
    .table-list {
      height: calc(100% - 60px);
      overflow: auto;
      .date-sort {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .super_admin {
        padding: 3px 8px;
        color: #ffffff;
        background: #0ec69a;
        border-radius: 5px;
      }
    }
  }
  .demo-pagination-block {
    position: absolute;
    right: 12px;
    bottom: 10px;
  }
  .bind-box {
    > span {
      margin-right: 15px;
    }
  }
}
</style>
