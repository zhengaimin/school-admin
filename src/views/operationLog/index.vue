<template>
  <div class="table-box">
    <!-- <div class="filter-box"></div> -->
    <div class="btn-box">
      <span>日志列表</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" :data="carbonCk_list">
        <el-table-column label="人员" prop="name"> </el-table-column>
        <el-table-column label="创建时间" prop="created_at"> </el-table-column>
        <el-table-column label="更新时间" prop="updated_at"> </el-table-column>
        <el-table-column label="操作" align="center" width="220" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="viewDetail(scope)">日志详情</div>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" title="日志详情" :width="800">
      <div style="padding-left: 20px">
        <el-timeline style="max-width: 600px">
          <el-timeline-item timestamp="2025/4/12 20:46:30" placement="top">
            <el-card>
              <h4>登录</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2025/4/12 20:48:22" placement="top">
            <el-card>
              <h4>消费</h4>
              <p>同学一于2025/01/12 12:02:33 消费30元</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2025/4/12 20:58:44" placement="top">
            <el-card>
              <h4>退出</h4>
            </el-card>
          </el-timeline-item>
        </el-timeline>

        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogVisibleAdd = false">取消</el-button>
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
      //新增权限系统
      dialogVisibleAdd: false,
      form: {},
      linkRules: {
        sbname: [{ required: true, message: "必填项", trigger: "blur" }],
        xinhao: [{ required: true, message: "必填项", trigger: "blur" }],
        status: [{ required: true, message: "必填项", trigger: "change" }],
        bianhao: [{ required: true, message: "必填项", trigger: "change" }]
      },
      typeList: [
        {
          id: 1,
          name: "在线"
        },
        {
          id: 2,
          name: "离线"
        },
        {
          id: 2,
          name: "维修中"
        }
      ],
      carbonCk_list: [
        {
          id: 1,
          name: "同学一",
          xinhao: "T6768374384",
          status: "在线",
          bianhao: "Y6478374347387434",
          created_at: "2022-02-01 10:00:00",
          updated_at: "2022-02-01 10:00:00"
        }
      ],
      total: 0,
      page: 1,
      page_size: 10
    };
  },
  mounted() {
    return;
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
    //新增
    viewDetail() {
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
