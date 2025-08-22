<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label>名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>

      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span> 指南列表</span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="名称" prop="name" align="left"> </el-table-column>
          <el-table-column label="一级分类" prop="first_category" align="left"> </el-table-column>
          <el-table-column label="二级分类" prop="second_category" align="left"> </el-table-column>
          <el-table-column label="指南下载地址" prop="guide_download_url" align="left"> </el-table-column>
          <el-table-column label="描述" prop="description" align="left"> </el-table-column>
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
            <el-col :span="14">
              <el-form-item label="因子来源名称" prop="name">
                <el-input v-model="linkRuleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="一级分类" prop="first_category">
                <el-input v-model="linkRuleForm.first_category"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="二级分类" prop="second_category">
                <el-input v-model="linkRuleForm.second_category"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="指南下载地址" prop="guide_download_url">
                <el-input v-model="linkRuleForm.guide_download_url"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述" prop="description">
                <el-input v-model="linkRuleForm.description" :autosize="{ minRows: 3, maxRows: 8 }" type="textarea"></el-input>
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
import { factor_source_add, factor_source_list, factor_source_delete, factor_source_update } from "@/api/modules/basicLibrary.js";
export default {
  name: "FossilFuel",
  data() {
    return {
      filterForm: {
        name: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],
      // 新增
      list: [
        { name: "能源", id: 1 },
        { name: "非能源", id: 2 }
      ],
      unitList: [
        { name: "化石燃料燃烧排放", id: 1 },
        { name: "净购入的电力排放", id: 2 },
        { name: "净购入的热力排放(热水)", id: 3 },
        { name: "净购入的热力排放(蒸汽)", id: 4 },
        { name: "熟料生产过程产生的碳排放(熟料)", id: 5 },
        { name: "熟料生产过程产生的碳排放(非碳酸盐替代原料)", id: 6 },
        { name: "光伏发电", id: 7 }
      ],
      fieldList: [
        { name: "固定字段", id: 1 },
        { name: "用户输入的字段", id: 2 },
        { name: "默认值但是可编辑的字段", id: 3 },
        { name: "特殊处理字段", id: 4 }
      ],
      LinkDialog: false,
      linkRuleForm: {
        name: "",
        description: "",
        first_category: "",
        second_category: "",
        guide_download_url: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项" }]
      }
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.factor_source_list();
    },
    search() {
      this.factor_source_list();
    },
    reset() {
      this.filterForm.name = "";
      this.factor_source_list();
    },
    // 获取列表
    factor_source_list() {
      let str = `model_type=0&page=${this.page}&page_size=${this.page_size}&name=${this.filterForm.name}`;
      factor_source_list(str).then(res => {
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
      this.factor_source_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.factor_source_list();
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
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.linkRuleForm.id) {
            factor_source_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.factor_source_list();
              }
            });
            return;
          }
          factor_source_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.factor_source_list();
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
          factor_source_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.factor_source_list();
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
