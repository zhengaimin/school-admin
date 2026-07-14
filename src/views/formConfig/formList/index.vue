<template>
  <div class="form-outer-box">
    <div class="filter-box">
      <div>
        <label>所属项目</label>
        <el-select v-model="filterForm.project_id" placeholder="请选择" style="width: calc(100% - 120px)">
          <el-option v-for="v in projectList" :label="v.name" :value="v.id" :key="v.id"></el-option>
        </el-select>
      </div>
      <div>
        <label>所属菜单</label>
        <el-input v-model="filterForm.menu" style="width: calc(100% - 120px)" />
      </div>
      <div>
        <label>表单名称</label>
        <el-input v-model="filterForm.form_name" style="width: calc(100% - 120px)" />
      </div>
      <div>
        <label>表单标识</label>
        <el-input v-model="filterForm.form_key" style="width: calc(100% - 120px)" />
      </div>
      <div>
        <el-button type="primary" size="default" @click="search"> 查询 </el-button>
        <el-button type="primary" size="default" @click="reset"> 重置 </el-button>
        <el-button type="primary" size="default" @click="addForm"> 新增 </el-button>
      </div>
    </div>
    <div class="my-table-box">
      <el-table :data="List" style="width: 100%; height: calc(100% - 140px)">
        <el-table-column label="ID" prop="id" align="center" width="120"> </el-table-column>
        <el-table-column label="所属项目" prop="project_name" align="center"> </el-table-column>
        <el-table-column label="所属菜单" prop="menu" align="center"> </el-table-column>
        <el-table-column label="表单名称" prop="name" align="center"> </el-table-column>
        <el-table-column label="表单标识" prop="key" align="center"> </el-table-column>
        <el-table-column label="表单类型" align="center">
          <template #default="scope">
            {{ scope.row.form_type == 1 ? "前台页面表单" : "后台数据建模" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="deleteRow(scope.row)">
                <img
                  src="@/assets/images/common/delete-circle-2.svg"
                  alt=""
                  style="width: 13px; height: 13px; margin-right: 3px"
                />删除
              </div>
              <div>
                <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 14px; height: 14px" />
              </div>
              <div @click="handle(2, scope.row)">表单配置</div>
              <div @click="handle(3, scope.row)">表单预览</div>
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
    <!-- 新增 -->
    <el-dialog v-model="dialogVisibleAddPic" :close-on-click-modal="false" title="新增表单" width="700">
      <div style="min-height: 200px; text-align: center">
        <el-form :model="form" label-width="120px">
          <el-form-item label="表单类型">
            <el-radio-group v-model="form.form_type">
              <el-radio :label="1">前台页面表单</el-radio>
              <el-radio :label="2">后台数据建模</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属项目">
            <el-select style="width: 100%" v-model="form.project_id" placeholder="请选择">
              <el-option v-for="v in projectList" :label="v.name" :value="v.id" :key="v.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称">
            <el-input v-model="form.menu"></el-input>
          </el-form-item>
          <el-form-item label="表单名称">
            <el-input v-model="form.form_name"></el-input>
          </el-form-item>
          <el-form-item label="表单标识">
            <el-input v-model="form.form_key"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisibleAddPic = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { formConfigStore } from "@/stores/modules/formConfig";
// import { project_list } from "@/api/ProjectAdmin.js";
import { formAdd, formList, formDelete } from "@/api/modules/formConfig.js";
import { ElMessageBox } from "element-plus";
export default {
  data() {
    return {
      formConfigStore: "",
      projectList: [],
      List: [],
      filterForm: {
        project_id: "",
        menu: "",
        form_name: "",
        form_key: ""
      },
      page: 1,
      page_size: 10,
      total: 0,
      // 新增
      dialogVisibleAddPic: false,
      form: {
        form_type: 1,
        project_id: "",
        menu: "",
        form_name: "",
        form_key: "",
        config: ""
      }
    };
  },
  computed: {
    configObj() {
      return this.formConfigStore.configObj;
    }
  },
  mounted() {
    this.getList();
    this.formConfigStore = formConfigStore();
    this.formConfigStore.setConfigObj({ id: 12 });
  },
  methods: {
    // ...mapMutations("formConfig", ["setConfigObj"]),
    //获取项目
    project_list() {
      let form = {
        page: 1,
        page_size: 50
      };
      let params = "";
      for (let key in form) {
        params += `${key}=${form[key]}&`;
      }
      project_list(params).then(res => {
        if (res && res.code == 0) {
          this.projectList = res.data.list;
        }
      });
    },
    search() {
      this.getList();
    },
    reset() {
      for (let key in this.filterForm) {
        if (key != "page" && key != "page_size" && key != "sorted") {
          this.filterForm[key] = "";
        }
      }
      this.getList();
    },
    getList() {
      console.log(12);
      this.filterForm.sorted = "desc";
      this.filterForm.page = this.page;
      this.filterForm.page_size = this.page_size;
      let params = "";
      for (let key in this.filterForm) {
        params += `${key}=${this.filterForm[key]}&`;
      }
      console.log(params);

      formList(params).then(res => {
        console.log(res);
      });
    },
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    addForm() {
      this.dialogVisibleAddPic = true;
    },
    confirm() {
      let params = this.form;
      formAdd(params).then(res => {
        if (res && res.code == 0) {
          this.getList();
          this.$message.success("新增成功");
          this.dialogVisibleAddPic = false;
        }
      });
    },
    handle(val, row) {
      this.setConfigObj(row);
      //   this.$emit("toClass", val);
    },
    deleteRow(row) {
      let params = {
        id: row.id
      };
      ElMessageBox.confirm("确定删除此条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          formDelete(params).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {
          console.log("取消");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.filter-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  padding: 20px;
  margin-bottom: 10px;
  > div {
    > label {
      margin-right: 10px;
      font-size: 14px;
    }
  }
}
.form-outer-box {
  position: relative;
  height: 100%;
  .demo-pagination-block {
    position: absolute;
    right: 10px;
    bottom: 0;
  }
}
</style>
