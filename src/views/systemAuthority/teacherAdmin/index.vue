<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">教师姓名</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <label for="code">年级</label>
      <el-input style="width: 250px" v-model="filterForm.code"></el-input>
      <el-button style="margin-left: 20px">重置</el-button>
      <el-button type="primary">查询</el-button>
    </div>
    <div class="btn-box">
      <span>教师管理</span>
      <div>
        <el-button type="primary" class="search-btn" @click="importExcel"> 导入 </el-button>
        <el-button type="primary" class="search-btn" @click="openAddDialog"> 新增 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" :data="carbonCk_list">
        <el-table-column label="姓名" prop="name" width="120"> </el-table-column>
        <el-table-column label="年级名称" prop="nianjiname" align="center" width="120"> </el-table-column>
        <el-table-column label="年级类型" prop="nianjileixin" align="center" width="120"> </el-table-column>
        <el-table-column label="级部" prop="jibu" align="center" width="120"> </el-table-column>
        <el-table-column label="职务" prop="zhiwu" align="center" width="120"> </el-table-column>
        <el-table-column label="科目" prop="kemu" align="center" width="120"> </el-table-column>
        <el-table-column label="任课班级" prop="renkebanji" align="center" width="120"> </el-table-column>
        <el-table-column label="负责班级" prop="fuzebanji" align="center" width="120"> </el-table-column>
        <el-table-column label="电话" prop="phone" align="center" width="120"> </el-table-column>
        <el-table-column label="物理卡号" prop="kahao" align="center" width="120"> </el-table-column>
        <el-table-column label="消费账号" prop="zhanghao" align="center" width="120"> </el-table-column>
        <el-table-column label="校区" prop="xiaoqu" align="center" width="120"> </el-table-column>
        <el-table-column label="教师编号" prop="bianhao" align="center" width="120"> </el-table-column>
        <el-table-column label="操作" align="center" width="110" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="editRow(scope.row)">
                <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
              </div>
              <div @click="deleteRow(scope.row)">
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
    <!-- 导入 -->
    <el-dialog v-model="importDialogVisible" :close-on-click-modal="false" title="导入" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="18">
              <el-form-item label="学校" prop="rolename">
                <el-select v-model="form.status" placeholder="请选择">
                  <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="导入" prop="description">
                <el-input type="textarea" :rows="4" v-model="form.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogVisibleAdd = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="18">
              <el-form-item label="姓名" prop="rolename">
                <el-input v-model="form.rolename"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="学校名称" prop="name">
                <el-select v-model="form.type" placeholder="请选择">
                  <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="年级" prop="slug">
                <el-input v-model="form.slug"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注" prop="description">
                <el-input type="textarea" :rows="4" v-model="form.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="23">
              <el-form-item label="菜单权限分配" prop="description"> </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogVisibleAdd = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tenantList, tenantDelete } from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
export default {
  data() {
    return {
      filterForm: {},
      // 导入
      importDialogVisible: false,
      typeList: [
        {
          id: 1,
          name: "洪山高中"
        },
        {
          id: 2,
          name: "华师附中"
        }
      ],
      //新增权限系统
      dialogVisibleAdd: false,
      form: {},
      linkRules: {
        rolename: [{ required: true, message: "必填项", trigger: "blur" }],
        slug: [{ required: true, message: "必填项", trigger: "blur" }],
        name: [{ required: true, message: "必填项", trigger: "change" }]
      },

      carbonCk_list: [
        {
          id: 1,
          name: "李老师",
          nianjiname: "xxx"
        }
      ],
      total: 0,
      page: 1,
      page_size: 10
    };
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    fetchTenantList() {
      let str = "";
      for (let key in this.formFilter) {
        if (this.formFilter[key]) {
          str += `&${key}=${this.formFilter[key]}`;
        }
      }
      let params = `page=${this.page}&page_size=${this.page_size}${str}`;
      tenantList(params).then(res => {
        return;
        this.carbonCk_list = res.data.list;
        this.carbonCk_list.map(v => {
          v.status = v.status == 1 ? true : false;
        });
        this.total = res.data.total;
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.fetchTenantList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchTenantList();
    },
    //筛选
    getFormDataFilter() {
      this.fetchTenantList();
    },
    handleResetFilter() {
      this.fetchTenantList();
    },
    // 导入
    importExcel() {
      this.importDialogVisible = true;
    },
    //新增
    openAddDialog() {
      delete this.form.id;
      this.form = {};
      this.dialogVisibleAdd = true;
    },
    handleReset() {
      this.dialogVisibleAdd = false;
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      for (let key in row) {
        this.form[key] = row[key];
      }
      this.form.id = row.id;
    },
    changeStatus(row) {
      this.getFormData(row);
    },

    deleteRow(row) {
      ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          tenantDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.fetchTenantList();
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
@import "./index";
</style>
