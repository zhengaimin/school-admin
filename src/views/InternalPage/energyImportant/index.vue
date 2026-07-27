<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label>行业</label>
      <el-select
        placeholder="请选择"
        style="width: 20%"
        v-model="filterForm.industry_id"
        clearable
        filterable
        size="default"
        @focus="industry_list({ deep: 4 })"
      >
        <el-option v-for="item in industry_list_four" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <label>领域名称</label>
      <el-input style="width: 20%" v-model="filterForm.domain_name"></el-input>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span>能效重点领域列表</span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="行业" align="left">
            <template #default="{ row }"> {{ row.industry.name }} </template>
          </el-table-column>
          <el-table-column label="领域名称" prop="domain_name" align="left"> </el-table-column>
          <el-table-column label="年份" prop="year" align="left"> </el-table-column>
          <el-table-column label="指标名称" prop="metric_name" align="left"> </el-table-column>
          <el-table-column label="标杆水平值" prop="benchmark_level" align="left"> </el-table-column>
          <el-table-column label="基准水平值" prop="baseline_level" align="left"> </el-table-column>
          <el-table-column label="参考标准" prop="reference" align="left"> </el-table-column>
          <el-table-column label="单位" prop="unit" align="left"> </el-table-column>
          <el-table-column label="操作" align="center" width="130" fixed="right">
            <template #default="scope">
              <div class="table-btn">
                <div @click="editRow(scope.row)">
                  <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
                </div>
                <div @click="deleteProcess(scope.row)">
                  <img
                    src="@/assets/images/common/delete-circle-2.svg"
                    alt=""
                    style="width: 16px; height: 16px; margin-right: 3px"
                  />
                </div>
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
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="700">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="5">
              <el-form-item label="行业(门类)" prop="industry_level_one_id" :rules="[{ required: true, message: '请选择' }]">
                <el-select
                  placeholder="请选择"
                  style="width: 100%"
                  v-model="linkRuleForm.industry_level_one_id"
                  clearable
                  size="default"
                  @focus="industry_list({ deep: 1 })"
                  @change="
                    val => (
                      (linkRuleForm.industry_level_two_id = ''),
                      (linkRuleForm.industry_level_three_id = ''),
                      (linkRuleForm.industry_id = '')
                    )
                  "
                >
                  <el-option v-for="item in industry_list_one" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-form-item label="大类" prop="industry_level_two_id" :rules="[{ required: true, message: '请选择' }]">
                <el-select
                  placeholder="请选择"
                  style="width: 100%"
                  v-model="linkRuleForm.industry_level_two_id"
                  clearable
                  size="default"
                  @focus="industry_list({ deep: 2 })"
                  @change="val => ((linkRuleForm.industry_level_three_id = ''), (linkRuleForm.industry_id = ''))"
                >
                  <el-option v-for="item in industry_list_two" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-form-item label="中类" prop="industry_level_three_id" :rules="[{ required: true, message: '请选择' }]">
                <el-select
                  placeholder="请选择"
                  style="width: 100%"
                  v-model="linkRuleForm.industry_level_three_id"
                  clearable
                  size="default"
                  @focus="industry_list({ deep: 3 })"
                  @change="val => (linkRuleForm.industry_id = '')"
                >
                  <el-option v-for="item in industry_list_three" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-form-item label="小类" prop="industry_id" :rules="[{ required: true, message: '请选择' }]">
                <el-select
                  placeholder="请选择"
                  style="width: 100%"
                  v-model="linkRuleForm.industry_id"
                  clearable
                  size="default"
                  @focus="industry_list({ deep: 4 })"
                >
                  <el-option v-for="item in industry_list_four" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="领域名称" prop="domain_name">
                <el-input v-model="linkRuleForm.domain_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="指标名称" prop="metric_name">
                <el-input v-model="linkRuleForm.metric_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="有效年份" prop="year">
                <el-date-picker
                  v-model="linkRuleForm.year"
                  type="year"
                  value-format="YYYY"
                  placeholder="选择年"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="标杆水平值" prop="benchmark_level">
                <el-input v-model="linkRuleForm.benchmark_level"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="基准水平值" prop="baseline_level">
                <el-input v-model="linkRuleForm.baseline_level"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="单位" prop="unit">
                <el-input v-model="linkRuleForm.unit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="参考标准" prop="reference">
                <el-input type="textarea" rows="3" v-model="linkRuleForm.reference"></el-input>
              </el-form-item>
            </el-col>
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
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import { industry_list } from "@/api/modules/common.js";
import {
  industry_domain_add,
  industry_domain_list,
  industry_domain_delete,
  industry_domain_update
} from "@/api/modules/basicLibrary.js";
export default {
  name: "FossilFuel",
  data() {
    return {
      filterForm: {
        industry_id: "",
        domain_name: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],
      // 新增
      LinkDialog: false,
      industry_list_one: [],
      industry_list_two: [],
      industry_list_three: [],
      industry_list_four: [],
      linkRuleForm: {
        industry_level_one_id: "",
        industry_level_two_id: "",
        industry_level_three_id: "",
        industry_id: "",
        domain_name: "",
        metric_name: "",
        year: "",
        benchmark_level: "",
        baseline_level: "",
        reference: "",
        unit: ""
      },
      linkRules: {
        domain_name: [{ required: true, message: "必填项" }],
        metric_name: [{ required: true, message: "必填项" }],
        year: [{ required: true, message: "必填项" }],
        benchmark_level: [{ required: true, message: "必填项" }],
        baseline_level: [{ required: true, message: "必填项" }],
        reference: [{ required: true, message: "必填项" }],
        unit: [{ required: true, message: "必填项" }]
      }
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.industry_domain_list();
    },
    search() {
      this.industry_domain_list();
    },
    reset() {
      this.filterForm.industry_id = "";
      this.filterForm.domain_name = "";
      this.industry_domain_list();
    },
    // 获取列表
    industry_domain_list() {
      let str = `page=${this.page}&page_size=${this.page_size}&industry_id=${this.filterForm.industry_id}&domain_name=${this.filterForm.domain_name}`;
      industry_domain_list(str).then(res => {
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
      this.industry_domain_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.industry_domain_list();
    },

    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.$nextTick(() => {
        row.year = row.year.toString();
        this.linkRuleForm = { ...row };
        this.linkRuleForm.id = row.id;
      });
    },
    addMethod() {
      this.LinkDialog = true;
      delete this.linkRuleForm.id;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    //获取行业
    industry_list(params) {
      let parent_id = "";
      switch (params.deep) {
        case 1:
          parent_id = "";
          break;
        case 2:
          parent_id = this.linkRuleForm.industry_level_one_id;
          break;
        case 3:
          parent_id = this.linkRuleForm.industry_level_two_id;
          break;
        case 4:
          parent_id = this.linkRuleForm.industry_level_three_id;
          break;
      }
      let linkRuleForm = `deep=${params.deep}&parent_id=${parent_id}`;
      industry_list(linkRuleForm).then(res => {
        if (res.code == 0) {
          switch (params.deep) {
            case 1:
              this.industry_list_one = res.data.list;
              break;
            case 2:
              this.industry_list_two = res.data.list;
              break;
            case 3:
              this.industry_list_three = res.data.list;
              break;
            case 4:
              this.industry_list_four = res.data.list;
              break;
          }
        }
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.linkRuleForm.year = Number(this.linkRuleForm.year);
          if (this.linkRuleForm.id) {
            industry_domain_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.industry_domain_list();
              }
            });
            return;
          }
          industry_domain_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.industry_domain_list();
            }
          });
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
          industry_domain_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.industry_domain_list();
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
      min-width: 40px;
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
