<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label>排放过程</label>
      <el-select style="width: 250px" v-model="filterForm.emission_process_type">
        <el-option v-for="v in bindList" :label="v.name" :value="Number(v.id)" :key="v.id" />
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span> 指南-品种列表</span>
        <div></div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="行业指南" align="left">
            <template #default="{ row }">
              {{ row.factor_source.name }}
              <span v-if="row.factor_source.first_category">-</span>{{ row.factor_source.first_category }}
              <span v-if="row.factor_source.second_category">-</span>{{ row.factor_source.second_category }}
            </template>
          </el-table-column>
          <el-table-column label="因子名称" align="left">
            <template #default="{ row }">
              {{ row.variety.name }}
            </template>
          </el-table-column>
          <el-table-column label="排放过程" align="left">
            <template #default="{ row }">
              {{ varietiesObj[row.variety.emission_process_type] }}
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
  </div>
</template>
<script>
import { industry_varieties_list } from "@/api/modules/basicLibrary.js";
export default {
  name: "Industry",
  data() {
    return {
      filterForm: {
        emission_process_type: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],
      varietiesObj: {
        1: "化石燃料燃烧排放",
        2: "净购入的电力排放",
        3: "净购入的热力排放(热水)",
        4: "净购入的热力排放(蒸汽)",
        5: "熟料生产过程产生的碳排放(熟料)",
        6: "熟料生产过程产生的碳排放(非碳酸盐替代原料)",
        7: "光伏发电"
      },
      bindList: [
        { name: "化石燃料燃烧排放", id: 1 },
        { name: "净购入的电力排放", id: 2 },
        { name: "净购入的热力排放(热水)", id: 3 },
        { name: "净购入的热力排放(蒸汽)", id: 4 },
        { name: "熟料生产过程产生的碳排放(熟料)", id: 5 },
        { name: "熟料生产过程产生的碳排放(非碳酸盐替代原料)", id: 6 },
        { name: "光伏发电", id: 7 }
      ]
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.industry_varieties_list();
    },
    search() {
      this.industry_varieties_list();
    },
    reset() {
      this.filterForm.emission_process_type = "";
      this.industry_varieties_list();
    },
    // 获取列表
    industry_varieties_list() {
      let str = `page=${this.page}&page_size=${this.page_size}&emission_process_type=${this.filterForm.emission_process_type}`;
      industry_varieties_list(str).then(res => {
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
      this.industry_varieties_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.industry_varieties_list();
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
}
</style>
