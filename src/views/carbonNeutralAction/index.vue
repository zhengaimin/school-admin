<template>
  <div class="realtimeMonitoring">
    <div v-show="flag" class="back">
      <el-button type="primary" size="default" @click="addMsg">新增</el-button>
    </div>
    <div class="box" v-show="flag">
      <div class="list-box" v-if="list.length > 0">
        <div v-for="v in list" :key="v.title" @click="toDetail(v.id)">
          <h1>{{ v.title }}</h1>
          <!-- <div class="content">
            {{ v.content }}
          </div> -->
          <div class="footer-info">
            <p>时间:{{ v.created_at }}</p>
            <p>数据类型:{{ v.data_type == 1 ? "采集" : "录入" }}</p>
          </div>
          <span @click.stop="deleteRow(v.id)">
            <img style="width: 18px; height: 18px" src="@/assets/images/enterpriseSetup/delete-circle-2.svg" alt="" />
          </span>
          <!-- <img
            @click.stop="deleteRow(v.id)"
            src="@/assets/images/common/delete-circle-2.svg"
            alt=""
            style="width: 20px; height: 20px; margin-right: 3px"
          /> -->
        </div>
      </div>
      <div v-else style="margin-top: 15%; text-align: center">
        <img width="100px;height:100px" src="@/assets/images/notData.png" alt="" srcset="" />
        <p class="font-size:18px;color:#4a5975">暂无数据</p>
      </div>
    </div>
    <div class="demo-pagination-block" v-show="flag">
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
    <!-- 新增产品 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" title="新增碳中和资讯" :width="800">
      <div style="padding: 10px 20px 0">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm" status-icon>
          <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm.title" />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <wangEditorVue ref="wangdom" @change-html="changeHtml" />
          </el-form-item>
        </el-form>
      </div>
      <div style="flex: auto; padding-right: 20px; text-align: right">
        <el-button @click="dialogVisibleAdd = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </el-dialog>
    <detail v-show="!flag" @goback="taggle" :detail="detail" />
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import wangEditorVue from "./wangEditor.vue";
import detail from "./detail.vue";
import {
  carbon_article_list,
  carbon_article_add,
  carbon_article_info,
  carbon_article_delete
} from "@/api/modules/carbonNeutralAction.js";
export default {
  components: {
    detail,
    wangEditorVue
  },
  data() {
    return {
      flag: true,
      page: 1,
      page_size: 10,
      total: 0,
      list: [],
      //新增
      dialogVisibleAdd: false,
      ruleForm: {
        title: "",
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入" }],
        content: [{ required: true, message: "请输入" }]
      },
      // 详情
      detail: {}
    };
  },
  mounted() {
    this.featchData();
  },
  methods: {
    featchData() {
      carbon_article_list(`page=1&page_size=10`).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.list = res.data.list;
          this.total = res.data.total;
        } else {
          this.list = [];
          this.total = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.featchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.featchData();
    },
    addMsg() {
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs.ruleFormRef.resetFields();
      });
    },
    changeHtml(html) {
      this.ruleForm.content = html;
    },
    confirmClick() {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          carbon_article_add(this.ruleForm).then(res => {
            if (res.code == 0) {
              this.dialogVisibleAdd = false;
              this.$message.success("添加成功");
              this.featchData();
            }
          });
        }
      });
    },
    toDetail(id) {
      carbon_article_info({ id: id }).then(res => {
        if (res.code == 0) {
          this.flag = false;
          this.detail = res.data;
        }
      });
    },
    deleteRow(id) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          carbon_article_delete({ id: id }).then(res => {
            if (res.code == 0) {
              this.$message.success("删除成功");
              this.featchData();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    taggle() {
      this.flag = !this.flag;
    }
  }
};
</script>
<style lang="scss" scoped>
.realtimeMonitoring {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .back {
    margin-bottom: 10px;
    text-align: right;
  }
  .demo-pagination-block {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 30px;
    margin-top: 18px;
  }
  .box {
    height: calc(100% - 95px);
    overflow: auto;
    .list-box {
      > div {
        position: relative;
        padding: 20px;
        margin-bottom: 20px;
        background: #ffffff;
        border-radius: 10px;
        h1 {
          margin: 0;
          margin-bottom: 10px;
          font-size: 18px;
          color: #1f304c;
          text-align: left;
        }
        .content {
          font-size: 16px;
          line-height: 26px;
          color: #4a5975;
        }
        .footer-info {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 14px;
          color: #8894b3;
          > p {
            margin: 0;
          }
        }
        > span {
          position: absolute;
          top: 20px;
          right: 15px;
          display: inline-block;
          width: 30px;
          height: 30px;
          margin-left: 15px;
          line-height: 34px;
          text-align: center;
          cursor: pointer;
          background: #f9fafb;
          border: 1px solid #dee2eb;
          border-radius: 6px;
        }
      }
      > div:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
