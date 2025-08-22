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
        @focus="
          linkRuleForm.industry_level_three_id = '';
          industry_list({ deep: 4 });
        "
      >
        <el-option v-for="item in industry_list_four" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <label>指标类型</label>
      <el-select style="width: 20%" v-model="filterForm.metric_type" placeholder="请选择">
        <el-option v-for="item in metric_typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
      <label>年份</label>
      <el-date-picker v-model="filterForm.year" type="year" value-format="YYYY" placeholder="选择年" style="width: 20%" />
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span>行业领跑者列表</span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="排名" prop="rank" align="left"> </el-table-column>
          <el-table-column label="企业名称" prop="enterprise_name" align="left"> </el-table-column>
          <el-table-column label="行业" align="left">
            <template #default="{ row }"> {{ row.industry.name }} </template>
          </el-table-column>
          <el-table-column label="年份" prop="year" align="left"> </el-table-column>

          <el-table-column label="指标类型" align="left">
            <template #default="{ row }"> {{ { 1: "产品", 2: "生产工艺" }[row.metric_type] }} </template>
          </el-table-column>
          <el-table-column label="指标名称" prop="metric_name" align="left"> </el-table-column>
          <el-table-column label="指标值" prop="metric_value" align="left"> </el-table-column>
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
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="800">
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
              <el-form-item label="指标类型" prop="metric_type">
                <el-select v-model="linkRuleForm.metric_type" placeholder="请选择">
                  <el-option v-for="item in metric_typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
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
              <el-form-item label="单位" prop="unit">
                <el-input v-model="linkRuleForm.unit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="width: 93%; padding: 15px 0 15px 25px; background: #f9fafb; border-radius: 10px">
            <el-row v-for="(item, i) in linkRuleForm.items" :key="i">
              <el-col :span="4">
                <el-form-item
                  label="排名"
                  :rules="{
                    required: true,
                    message: '必填项'
                  }"
                >
                  <el-input type="number" v-model="item.rank"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" style="margin-left: 10px">
                <el-form-item
                  label="企业名称"
                  :rules="{
                    required: true,
                    message: '必填项'
                  }"
                >
                  <el-input v-model="item.enterprise_name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" style="margin-left: 10px">
                <el-form-item
                  label="指标值"
                  :rules="{
                    required: true,
                    message: '必填项'
                  }"
                >
                  <el-input v-model="item.metric_value"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="margin-left: 15px">
                <el-form-item label="&nbsp">
                  <img
                    v-if="linkRuleForm.items.length > 1"
                    @click="deleteItem(i)"
                    src="@/assets/images/common/delete-circle-2.svg"
                    alt=""
                    style="width: 23px; height: 23px; margin-top: 3px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="!linkRuleForm.id">
              <el-col :span="11"><el-button type="primary" @click="AddItem">新增</el-button></el-col>
            </el-row>
          </div>
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
  industry_leader_add,
  industry_leader_list,
  industry_leader_delete,
  industry_leader_update
} from "@/api/modules/basicLibrary.js";
export default {
  name: "FossilFuel",
  data() {
    return {
      filterForm: {
        industry_id: "",
        metric_type: "",
        year: ""
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
      metric_typeList: [
        { name: "产品", id: 1 },
        { name: "生产工艺", id: 2 }
      ],
      linkRuleForm: {
        industry_level_one_id: "",
        industry_level_two_id: "",
        industry_level_three_id: "",
        industry_id: "",
        year: "",
        metric_type: "",
        metric_name: "",
        items: [{ rank: 1, enterprise_name: "", metric_value: "" }],
        unit: ""
      },
      linkRules: {
        metric_type: [{ required: true, message: "必填项" }],
        metric_name: [{ required: true, message: "必填项" }],
        year: [{ required: true, message: "必填项" }],
        unit: [{ required: true, message: "必填项" }]
      }
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.industry_leader_list();
    },
    search() {
      this.industry_leader_list();
    },
    reset() {
      this.filterForm.industry_id = "";
      this.filterForm.metric_type = "";
      this.filterForm.year = "";
      this.industry_leader_list();
    },
    // 获取列表
    industry_leader_list() {
      let str = `page=${this.page}&page_size=${this.page_size}&industry_id=${this.filterForm.industry_id}&metric_type=${this.filterForm.metric_type}&year=${this.filterForm.year}`;
      industry_leader_list(str).then(res => {
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
      this.industry_leader_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.industry_leader_list();
    },

    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.$nextTick(() => {
        this.linkRuleForm.industry_level_three_id = "";
        this.industry_list({ deep: 4 });
        row.year = row.year.toString();
        this.linkRuleForm = { ...row };
        this.linkRuleForm.items = [
          {
            rank: row.rank,
            enterprise_name: row.enterprise_name,
            metric_value: row.metric_value
          }
        ];
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
    AddItem() {
      this.linkRuleForm.items.push({
        rank: "",
        enterprise_name: "",
        metric_value: ""
      });
    },
    deleteItem(index) {
      this.linkRuleForm.items.splice(index, 1);
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.linkRuleForm.items.forEach(item => {
            item.rank = Number(item.rank);
          });
          this.linkRuleForm.year = Number(this.linkRuleForm.year);
          if (this.linkRuleForm.id) {
            industry_leader_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.industry_leader_list();
              }
            });
            return;
          }
          industry_leader_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.industry_leader_list();
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
          industry_leader_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.industry_leader_list();
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
