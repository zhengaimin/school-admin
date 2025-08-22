<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label>排放指南</label>
      <el-input style="width: 250px" v-model="filterForm.source"></el-input>
      <label>行业类型</label>
      <el-select style="width: 250px" v-model="filterForm.industry_type">
        <el-option v-for="v in bindList" :label="v.name" :value="Number(v.id)" :key="v.id" />
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span> 行业因子库列表</span>
        <div></div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="排放过程" align="left">
            <template #default="{ row }">
              {{ ["", "水泥行业", "电解铝行业", "发电行业", "工业其他行业"][row.industry_type] }}
            </template>
          </el-table-column>
          <el-table-column label="行业指南" prop="source" align="left"> </el-table-column>
          <el-table-column label="因子名称" align="left">
            <template #default="{ row }">
              {{ row.variety.name }}
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
import { ElMessageBox } from "element-plus";
import { industry_varieties_list, industry_varieties_delete } from "@/api/modules/basicLibrary.js";
export default {
  name: "Industry",
  data() {
    return {
      filterForm: {
        source: "",
        industry_type: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],
      bindList: [
        { name: "水泥行业", id: 1 },
        { name: "电解铝行业", id: 2 },
        { name: "发电行业", id: 3 },
        { name: "工业其他行业", id: 4 }
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
      this.filterForm.source = "";
      this.filterForm.industry_type = "";
      this.industry_varieties_list();
    },
    // 获取列表
    industry_varieties_list() {
      let str = `page=${this.page}&page_size=${this.page_size}&source=${this.filterForm.source}&industry_type=${this.filterForm.industry_type}`;
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
    },

    //删除
    deleteProcess(row) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          industry_varieties_delete({ ids: [row.id] }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.industry_varieties_list();
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
}
</style>
