<template>
  <div class="table-box">
    <div class="firlter-box">
      <div>
        <label for="">物联网卡号</label>
        <el-input v-model="filterform.iccid" style="width: 300px; margin-right: 10px" />
        <label for="">设备类型</label>
        <el-select v-model="filterform.device_type" style="width: 300px; margin-right: 10px">
          <el-option v-for="v in device_type_list" :key="v.id" :label="v.name" :value="v.id" />
        </el-select>
        <el-button class="search-btn" @click="reset"> 重置 </el-button>
        <el-button type="primary" class="search-btn" @click="getList"> 查询 </el-button>
      </div>
    </div>
    <div class="sub-contemt">
      <div class="btn-box">
        <span>设备列表</span>
        <div></div>
      </div>
      <div class="table-list my-table-box">
        <el-table
          v-loading="loading"
          :data="device_list"
          style="width: 100%; height: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="合作方">
            <template #default="{ row }">
              {{ row.tenant.name }}
            </template>
          </el-table-column>
          <el-table-column label="碳科证书">
            <template #default="{ row }">
              {{ row.cert_url }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in cloumns"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :align="item.align"
            :width="item.width"
          >
          </el-table-column>
          <el-table-column label="操作" align="center" width="100" fixed="right">
            <template #default="scope">
              <div class="table-btn">
                <div @click="editRow(scope.row)">
                  <img
                    src="@/assets/images/common/edit-circle-2.svg"
                    alt=""
                    style="width: 13px; height: 13px; margin-right: 3px"
                  />编辑
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
    <!-- 新增 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="!form.id ? '新增' : '编辑'" width="800">
      <div>
        <el-form ref="form" :model="form" :rules="formrules" label-width="110px" label-position="top">
          <el-row>
            <el-col :span="15">
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="设备安装地址" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="margin: 0 10px; text-align: center">
            <el-button @click="dialogVisibleAdd = false">取消</el-button>
            <el-button type="primary" @click="confirm">确认</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { device_list, device_update } from "@/api/modules/currentLink.js";
export default {
  name: "DailyNews",
  data() {
    return {
      device_type_list: [
        { name: "碳科网关", id: 1 },
        { name: "虚拟网关", id: 2 },
        { name: "安科瑞网关", id: 3 }
      ],
      filterform: {
        iccid: "",
        device_type: ""
      },
      loading: false,
      page: 1,
      page_size: 10,
      total: 0,
      device_list: [],
      cloumns: [
        {
          label: "设备名称",
          prop: "name",
          align: "left",
          width: ""
        },
        {
          label: "设备类型",
          prop: "device_name",
          align: "left",
          width: ""
        },
        {
          label: "设备安装地址",
          prop: "address",
          align: "left",
          width: ""
        },
        {
          label: "设备MAC地址",
          prop: "mac",
          align: "left",
          width: ""
        },
        {
          label: "物联网卡号",
          prop: "iccid",
          align: "left",
          width: ""
        },
        {
          label: "设备UUID",
          prop: "uuid",
          align: "left",
          width: ""
        },
        {
          label: "设备IP",
          prop: "ip",
          align: "left",
          width: ""
        },
        {
          label: "证书密钥",
          prop: "preshared_key",
          align: "left",
          width: ""
        },
        {
          label: "创建时间",
          prop: "created_at",
          align: "left",
          width: ""
        },
        {
          label: "更新时间",
          prop: "updated_at",
          align: "left",
          width: ""
        }
      ],
      dialogVisibleAdd: false,
      form: {
        name: "",
        address: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    reset() {
      this.filterform.iccid = "";
      this.filterform.device_type = "";
      this.getList();
    },
    getList() {
      let str = `page=${this.page}&page_size=${this.page_size}&iccid=${this.filterform.iccid}&device_type=${this.filterform.device_type}`;
      device_list(str).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          let obj = {
            1: "碳科网关",
            2: "虚拟网关",
            3: "安科瑞网关"
          };
          res.data.list.map(v => {
            v.device_name = obj[v.device_type];
          });
          this.device_list = res.data.list;
          this.total = res.data.total;
          return;
        }
        this.device_list = [];
        this.total = 0;
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
    // 编辑
    editRow(row) {
      this.dialogVisibleAdd = true;
      this.form = {
        id: row.id,
        iccid: row.iccid,
        name: row.name,
        address: row.address
      };
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.form.id) {
            device_update(this.form).then(res => {
              if (res && res.code == 0) {
                this.$message.success("更新成功");
                this.getList();
                this.dialogVisibleAdd = false;
              }
            });
            return;
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.table-box {
  position: relative;
  height: 100%;
  border-radius: 12px;
  .firlter-box {
    padding: 20px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 10px;
    > div {
      label {
        margin-right: 10px;
        font-size: 14px;
        color: #666666;
      }
    }
  }
  .sub-contemt {
    height: calc(100% - 85px);
    background: #ffffff;
    border-radius: 10px;
    .btn-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 20px;
      > span {
        font-size: 16px;
      }
    }
    .table-list {
      height: calc(100% - 110px);
      overflow: auto;
      background: #ffffff;
    }
    .demo-pagination-block {
      position: absolute;
      right: 12px;
      bottom: 20px;
    }
  }
}
</style>
