<template>
  <div class="table-box">
    <div class="table-list">
      <div class="list-box" v-for="v in instrumentsList" :key="v.id">
        <div class="img-box">
          <img v-if="v.product_type == 2" src="@/assets/images/energy/product1.svg" alt="" srcset="" />
          <img v-else src="@/assets/images/energy/product2.svg" alt="" srcset="" />
        </div>
        <div>
          <div class="name-title">
            {{ v.name }}
          </div>
          <div class="outer-box">
            <div class="name-box">
              <span class="dot"></span>
              产品单位：
              <span>
                {{ v.unit }}
              </span>
            </div>
            <div class="name-box" style="padding-left: 30%">
              <span v-if="v.product_type == 2" class="dot blue"></span>
              <span v-else class="dot green"></span>
              产品类型：
              <span v-if="v.product_type == 1" class="final-product">中间产物</span>
              <span v-else class="center-product">最终产物</span>
            </div>
          </div>
        </div>
        <div class="btn-box1">
          <div v-if="isEdit" @click="editMethod(v)" style="margin-right: 10px">
            <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 18px; height: 18px" />
          </div>
          <div v-if="isEdit" @click="deleteProcess(v)">
            <img src="@/assets/images/common/delete-circle-2.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />
          </div>
        </div>
      </div>
      <div v-if="isEdit" class="box box6" @click="addMethod">
        <img src="@/assets/images/energy/add.svg" alt="" />
        <div class="source-type">
          <div>
            <h1>添加产品</h1>
          </div>
        </div>
      </div>
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
    <!-- 新增产品 -->
    <el-dialog
      v-model="dialogVisibleAdd"
      :close-on-click-modal="false"
      :title="!ruleForm.id ? '新增产品' : '编辑产品'"
      :width="700"
    >
      <div style="padding: 10px 20px 0; text-align: center">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm" status-icon>
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="产品单位" prop="unit">
            <el-input v-model="ruleForm.unit" />
          </el-form-item>
          <el-form-item label="是否最终产品" prop="product_type">
            <el-select v-model="ruleForm.product_type">
              <el-option v-for="v in product_typeList" :label="v.name" :value="Number(v.id)" :key="v.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div style="flex: auto; padding-right: 20px; text-align: right">
        <el-button @click="dialogVisibleAdd = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { product_save, product_list_page, product_delete } from "@/api/modules/enterpriseSetup.js";
import { ElMessageBox } from "element-plus";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      instrumentsList: [],
      total: 0,
      page: 1,
      page_size: 10,
      //新增计量器具
      dialogVisibleAdd: false,
      product_typeList: [
        { id: 1, name: "中间产物" },
        { id: 2, name: "最终产物" }
      ],
      ruleForm: {
        id: "",
        name: "",
        unit: "",
        product_type: ""
      },
      rules: {
        name: [{ required: true, message: "请输入产品名称" }],
        unit: [{ required: true, message: "请输入产品单位" }],
        product_type: [{ required: true, message: "请选择是否最终产品" }]
      }
    };
  },
  methods: {
    initPage() {
      this.getList();
    },
    getList() {
      let str = `page=${this.page}&page_size=${this.page_size}`;
      product_list_page(str).then(res => {
        if (res && res.data && res.data.list) {
          this.instrumentsList = res.data.list;
          this.total = res.data.total;
        } else {
          this.instrumentsList = [];
          this.total = 0;
        }
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
    //新增
    addMethod() {
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        delete this.ruleForm.id;
        this.$refs.ruleFormRef.resetFields();
      });
    },
    //编辑
    editMethod(row) {
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.ruleForm = { ...row };
      });
    },
    confirmClick() {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          product_save([this.ruleForm]).then(res => {
            if (res && res.code == 0) {
              this.$message.success("操作成功");
              this.dialogVisibleAdd = false;
              this.getList();
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
          product_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.getList();
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
.table-box {
  position: relative;
  height: 100%;
  border-radius: 10px;
  .btn-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
    margin-bottom: 12px;
    background: #ffffff;
    border-radius: 10px;
    > span {
      font-size: 16px;
    }
  }
  .table-list {
    height: calc(100% - 55px);
    overflow: auto;
    .list-box {
      display: grid;
      grid-template-columns: 100px auto 120px;
      margin-bottom: 12px;
      background: #ffffff;
      border-radius: 10px;
      .img-box {
        display: flex;
        align-items: center;
        padding-left: 20px;
      }
      .name-title {
        padding: 10px 0;
        margin: 0;
        font-size: 16px;
        font-weight: bold;
      }
      .outer-box {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        .name-box {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 100%;
          font-size: 14px;
          color: #8894b3;
          > img {
            margin-right: 15px;
          }
          > span {
            font-weight: bold;
            color: #1f304c;
          }
          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            margin-right: 7px;
            background: #b6bfd2;
            border-radius: 50%;
          }
          .blue {
            background: #a0d6f7;
          }
          .green {
            background: #bff1d3;
          }
          .center-product {
            padding: 2px 10px;
            font-weight: bold;
            color: #37affa;
            border-radius: 5px;
          }
          .final-product {
            padding: 2px 10px;
            font-weight: bold;
            color: #0ec69a;
            border-radius: 5px;
          }
          > div {
            h1 {
              padding-bottom: 7px;
              margin: 0;
              font-size: 16px;
              font-weight: bold;
              color: #1f304c;
            }
            h2 {
              margin: 0;
              font-size: 14px;
              font-weight: normal;
              color: #8894b3;
            }
          }
        }
      }
      .btn-box1 {
        display: flex;
        align-items: center;
        justify-content: center;
        > div {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: #f9fafb;
          border: 1px solid rgb(222 226 235 / 100%);
          border-radius: 6px;
          > img {
            cursor: pointer;
          }
        }
      }
    }
    .box6 {
      display: flex;
      padding: 8px 20px;
      cursor: pointer;
      background: #f9fafb;
      border: 1px solid rgb(222 226 235 / 100%);
      border-radius: 10px;
      .source-type {
        > div {
          margin-top: 10px;
          > h1 {
            margin-left: 20px;
            font-size: 18px;
            color: #1f304c;
          }
        }
      }
    }
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
    .center-product {
      padding: 2px 10px;
      font-weight: bold;
      color: #37affa;
      border-radius: 5px;
    }
    .final-product {
      padding: 2px 10px;
      font-weight: bold;
      color: #0ec69a;
      border-radius: 5px;
    }
  }
  .demo-pagination-block {
    position: absolute;
    right: 12px;
    bottom: 0;
  }
}
.detail-box {
  > h1 {
    display: flex;
    align-items: center;
    margin: 0;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: normal;
    color: #1f304c;
    > span {
      display: inline-block;
      width: 6px;
      height: 16px;
      margin-right: 8px;
      background: #0ec69a;
    }
  }
  > h2 {
    width: 160px;
    padding: 3px;
    margin: 15px 0;
    font-size: 12px;
    font-weight: normal;
    color: #4a5975;
    background: #f9fafb;
    border: 1px solid #dee2eb;
    border-radius: 5px;
  }
  .el-col-12 {
    margin-bottom: 15px;
  }
  .el-col-8 {
    margin-bottom: 15px;
  }
  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 5px;
    background: #b6bfd2;
    border-radius: 50%;
  }
}
.upload-box {
  width: 750px;
  padding: 20px 0;
  background: #f9fafb;
  border: 1px solid #dee2eb;
  border-radius: 10px;
}
.file-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 735px;
  height: 35px;
  padding: 0 10px;
  background: #d9ecff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  > div {
    display: flex;
    align-items: center;
  }
}
.errorMath {
  margin: 0;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: normal;
}
.error-box {
  color: #ffffff;
  text-align: center;
  background: #ff6a6a;
  border-radius: 10px;
}
</style>
