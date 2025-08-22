<template>
  <div class="fossil-fuel" v-if="userInfo.is_admin">
    <div class="content">
      <h1>
        <span> 综合能源/碳排放预算量设置 </span>
        <div>
          <span class="label">年度</span>
          <el-date-picker
            @change="changeYear"
            v-model="year"
            type="year"
            format="YYYY"
            value-format="YYYY"
            placeholder="请选择年份"
          />
          <el-button :disabled="!isEdit" @click="startMath" type="primary" style="width: 100px; margin-left: 10px">{{
            flag ? "数据填报" : "返回"
          }}</el-button>
        </div>
      </h1>
      <div class="table-box" v-if="flag">
        <div class="table-list">
          <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="list">
            <el-table-column label="公司名称" prop="company_name" align="left"> </el-table-column>
            <el-table-column label="综合能源预算量（tce）" prop="annual_energy_budget" align="left"> </el-table-column>
            <el-table-column label="碳排放预算量（/tCO₂eq）" prop="annual_carbon_emission_budget" align="left"> </el-table-column>
            <el-table-column label="预算类型" align="left">
              <template #default="{ row }">
                {{ row.mode == 1 ? "公司预算" : "总预算" }}
              </template>
            </el-table-column>
            <el-table-column label="预算维度" align="left">
              <template #default="{ row }">
                {{ row.budget_dimension == 1 ? "年" : "月" }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="demo-pagination-block" v-if="false">
          <el-pagination
            v-model:current-page="page"
            v-model:page-size="page_size"
            :page-sizes="[10, 20, 50, 100, 200, 300]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div class="set-box" v-else>
        <h2>
          全年综合能源预算量：
          <el-input v-model.number="totalForm.annual_energy_budget" type="number" style="width: 300px; margin-right: 30px">
            <template #append>/tce</template>
          </el-input>
          碳排放预算总量设置：
          <el-input v-model.number="totalForm.annual_carbon_emission_budget" type="number" style="width: 300px">
            <template #append>/tCO₂eq</template>
          </el-input>
        </h2>
        <div class="company-box">
          <h3 v-for="v in formList" :key="v.id">
            <h4>{{ v.name }}</h4>
            <el-input
              placeholder="请输入综合能源预算量"
              v-model.number="v.annual_energy_budget"
              type="number"
              style="margin-bottom: 10px"
            >
              <template #append>/tce</template>
            </el-input>
            <el-input placeholder="请输入碳排放预算量" v-model.number="v.annual_carbon_emission_budget" type="number">
              <template #append>/tCO₂eq</template>
            </el-input>
          </h3>
        </div>
        <div style="padding: 20px; text-align: right">
          <el-button type="primary" style="width: 100px" @click="save">保存</el-button>
        </div>
      </div>
    </div>
  </div>

  <div class="fossil-fuel" v-else>
    <div class="filter-box">
      <span class="label">公司名称</span>
      <span>{{ userInfo.tenant_name }}</span>
      <span class="label">年度</span>
      <el-date-picker
        @change="changeSubYear"
        v-model="subYear"
        type="year"
        format="YYYY"
        value-format="YYYY"
        placeholder="请选择年份"
      />
    </div>
    <div class="source-box">
      <h1>综合能源预算量</h1>
      <div>
        <span class="name">参数</span>
        <span>综合能源预算量(tce)</span>
      </div>
      <div>
        <span class="name">数值</span>
        <span>{{ !companyObj.id ? "暂未分配预算" : companyObj.annual_energy_budget }}</span>
      </div>
    </div>
    <div class="source-box">
      <h1>综合碳排放预算量</h1>
      <div>
        <span class="name">参数</span>
        <span>综合碳排放预算量(tCO₂eq)</span>
      </div>
      <div>
        <span class="name">数值</span>
        <span>{{ !companyObj.id ? "暂未分配预算" : companyObj.annual_carbon_emission_budget }}</span>
      </div>
    </div>
    <div class="source-box radio-box">
      <h2>配置能碳预算数据的时间维度</h2>
      <div>
        <el-radio-group @change="changeDimension" :disabled="!isEdit || !companyObj.id" v-model="companyObj.budget_dimension">
          <el-radio-button label="按年" :value="Number(1)" />
          <el-radio-button label="按月" :value="Number(2)" />
        </el-radio-group>
      </div>
    </div>
  </div>
</template>
<script>
import { useUserStore } from "@/stores/modules/user";
import { organizationData } from "@/api/modules/organization.js";
import { com_budget_save, com_budget_list, com_budget_info } from "@/api/modules/energyBudget.js";
import { api_list } from "@/api/modules/menu.js";
export default {
  data() {
    return {
      buttonList: [],
      year: "",
      flag: true,
      page: 1,
      page_size: 10,
      total: 0,

      totalForm: {
        annual_energy_budget: "",
        annual_carbon_emission_budget: "",
        budget_dimension: 1,
        mode: 2,
        com_id: "",
        year: ""
      },
      list: [],
      companyList: [],
      //公司普通管理员
      subYear: "",
      companyObj: {}
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    formList() {
      this.companyList.map(v => {
        if (this.list.length == 0) {
          v.annual_energy_budget = "";
          v.annual_carbon_emission_budget = "";
          v.id = undefined;
          return this.companyList;
        }
        let ary = this.list.filter(k => v.com_id == k.com_id && k.mode == 1);
        if (ary.length > 0) {
          v.annual_energy_budget = ary[0].annual_energy_budget;
          v.annual_carbon_emission_budget = ary[0].annual_carbon_emission_budget;
          v.id = ary[0].id;
        } else {
          v.annual_energy_budget = 0;
          v.annual_carbon_emission_budget = 0;
          v.id = undefined;
        }
      });
      return this.companyList;
    },
    isEdit() {
      return this.buttonList.includes("system") || this.buttonList.includes("edit");
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.api_list();
      if (this.userInfo.is_admin) {
        this.year = new Date().getFullYear().toString();
        this.getFormData();
      } else {
        this.subYear = new Date().getFullYear().toString();
        this.changeSubYear();
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
    },
    changeYear() {
      if (this.year) {
        this.getFormData();
      }
    },

    startMath() {
      if (!this.year) {
        this.$message.warning("请先选择年份");
        return;
      }
      this.flag = !this.flag;
      this.getFormData();
      if (!this.flag) {
        this.organizationData();
      }
    },
    //获取表单数据
    getFormData() {
      let str = `year=${this.year}`;
      com_budget_list(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.list = res.data.list;
          this.list.map(v => {
            v.annual_energy_budget = v.annual_energy_budget ? Number(v.annual_energy_budget) : 0;
            v.annual_carbon_emission_budget = v.annual_carbon_emission_budget ? Number(v.annual_carbon_emission_budget) : 0;
            if (v.mode == 2 && v.com_id == this.userInfo.com_id) {
              this.totalForm.annual_energy_budget = v.annual_energy_budget;
              this.totalForm.annual_carbon_emission_budget = v.annual_carbon_emission_budget;
              this.totalForm.id = v.id;
            }
          });
        } else {
          this.list = [];
          this.totalForm.annual_energy_budget = "";
          this.totalForm.annual_carbon_emission_budget = "";
          this.totalForm.id = undefined;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.getFormData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getFormData();
    },
    //查询公司
    organizationData() {
      let str = `org_type=1,2&page=1&page_size=200`;
      organizationData(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.companyList = res.data.list;
        } else {
          this.companyList = [];
        }
      });
    },
    save() {
      this.totalForm.com_id = this.userInfo.com_id;
      this.totalForm.year = Number(this.year);
      let ary = [];
      ary.push(this.totalForm);

      let totalVal = 0;
      let totalVal1 = 0;
      this.companyList.map(v => {
        totalVal += v.annual_energy_budget;
        totalVal1 += v.annual_carbon_emission_budget;
        ary.push({
          annual_energy_budget: v.annual_energy_budget,
          annual_carbon_emission_budget: v.annual_carbon_emission_budget,
          budget_dimension: 1,
          mode: 1,
          com_id: v.com_id,
          year: Number(this.year),
          id: v.id ? v.id : undefined
        });
      });
      if (totalVal > this.totalForm.annual_energy_budget || totalVal1 > this.totalForm.annual_carbon_emission_budget) {
        this.$message.warning("总预算不能超过年度总预算");
        return;
      }
      com_budget_save(ary).then(res => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.startMath();
        }
      });
    },

    changeSubYear() {
      com_budget_info(`year=${this.subYear}`).then(res => {
        if (res.code == 0 && res.data) {
          this.companyObj = res.data;
        }
      });
    },
    changeDimension() {
      if (!this.subYear) {
        this.$message.warning("请选择年度");
        return;
      }
      let ary = [
        {
          budget_dimension: this.companyObj.budget_dimension,
          mode: this.companyObj.mode,
          com_id: this.companyObj.com_id,
          id: this.companyObj.id,
          year: Number(this.subYear)
        }
      ];
      com_budget_save(ary).then(res => {
        if (res.code == 0) {
          this.$message.success("保存成功");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.fossil-fuel {
  height: 100%;
  .filter-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 20px 0;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 10px;
    .label {
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
  .source-box {
    margin-bottom: 10px;
    overflow: hidden;
    background: #ffffff;
    border-radius: 10px;
    > h1 {
      height: 50px;
      padding-left: 20px;
      margin: 0;
      font-size: 15px;
      font-weight: normal;
      line-height: 50px;
      border-bottom: 1px solid #ebeef5;
    }
    > div {
      display: grid;
      grid-template-columns: 120px auto;
      grid-gap: 10px;
      height: 50px;
      line-height: 50px;
      color: #4a5975;
      border-bottom: 1px solid #f4f6fa;
      > span {
        padding: 0 10px;
      }
      > .name {
        text-align: center;
        background: #f9fafb;
      }
    }
  }
  .radio-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 70px;
    > h2 {
      margin: 0 20px;
      font-size: 16px;
      font-weight: normal;
      color: #1f304c;
    }
  }
  .content {
    height: 100%;
    overflow: auto;
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
        .label {
          margin: 0 10px 0 20px;
          font-size: 14px;
          color: #4a5975;
        }
      }
    }
    .table-box {
      position: relative;
      height: calc(100% - 58px);
      .table-list {
        height: calc(100%);
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
    .set-box {
      height: calc(100% - 58px);
      padding: 0 20px;
      overflow: auto;
      :deep(.el-input-group__append) {
        width: 40px;
        font-weight: normal;
      }
      .company-box {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
      }
      > h2 {
        display: flex;
        align-items: center;
        padding: 25px 0;
        margin: 0;
        font-size: 15px;
        font-weight: normal;
        color: #4a5975;
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
  }
}
</style>
