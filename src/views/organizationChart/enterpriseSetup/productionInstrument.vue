<template>
  <div class="table-box">
    <div class="btn-box">
      <span>计量器具列表</span>
      <div>
        <el-button :disabled="!isEdit" type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        <el-button :disabled="!isEdit" type="primary" class="search-btn" @click="loadFileTemple"> 下载模板 </el-button>
        <el-button :disabled="!isEdit" type="primary" class="search-btn" @click="uploadFile"> 导入 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table style="height: calc(100% - 50px)" class="my-custom-table" :data="instrumentsList">
        <el-table-column label="计量器具名称" prop="name" align="left"> </el-table-column>
        <el-table-column label="计量器具编号" prop="instrument_id" align="left"> </el-table-column>
        <el-table-column label="型号规格" prop="model_specification" align="left"> </el-table-column>
        <el-table-column label="计量精度" prop="precision" align="left"> </el-table-column>
        <el-table-column label="能源名称" prop="varieties_name" align="left"> </el-table-column>

        <!-- <el-table-column label="排放过程">
          <template #default="scope">
            {{ varietiesObj[scope.row.emission_process_type] }}
          </template>
        </el-table-column>
        <el-table-column label="数据采集协议">
          <template #default="scope">
            {{ dealTypeObj[scope.row.config_json.deal_type] }}
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template #default="scope">
            {{ scope.row.config_json.send_type }}
          </template>
        </el-table-column>
        <el-table-column label="频率">
          <template #default="scope">
            {{ scope.row.config_json.frequency }}
          </template>
        </el-table-column> -->
        <el-table-column label="使用手册" width="250px">
          <template #default="scope">
            <div @click="loadFile(scope.row)" style="color: #409eff; cursor: pointer">
              {{ scope.row.file_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div v-if="isEdit" @click="addFile(scope.row)">
                <img src="@/assets/images/common/upload-circle-2.svg" alt="" style="width: 18px; height: 18px" />
              </div>
              <div v-if="isEdit" @click="viewDetail(scope.row, 'edit')">
                <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 18px; height: 18px" />
              </div>
              <div v-if="isEdit" @click="deleteProcess(scope.row)">
                <img
                  src="@/assets/images/common/delete-circle-2.svg"
                  alt=""
                  style="width: 18px; height: 18px; margin-right: 3px"
                />
              </div>
              <div @click="viewDetail(scope.row)">
                <img src="@/assets/images/common/view-circle-2.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />
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
    <!-- 新增 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" title="新增计量器具" :width="800">
      <div style="min-height: 100px; padding: 10px 20px 0; text-align: center">
        <add-strumpet ref="addStrumpet" @close="handleReset" />
      </div>
    </el-dialog>
    <!-- 上传文件 -->
    <el-dialog v-model="loadFlag" :close-on-click-modal="false" title="上传使用手册" :width="800">
      <div style="min-height: 100px; text-align: center">
        <el-row>
          <el-col :span="24">
            <el-upload
              v-if="!ruleForm.file_id"
              style="width: 100%"
              class="upload-demo"
              :action="activeUrl"
              :data="{ source: 2, is_common: 1 }"
              :headers="{ Authorization: token }"
              :before-upload="beforeAvatarUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :limit="1"
              :show-file-list="false"
            >
              <div class="upload-box">
                <el-icon style="font-size: 25px; color: #cccccc"><UploadFilled /></el-icon>
                <p>请上传</p>
              </div>
            </el-upload>
            <div class="file-box" v-else>
              <div>
                <el-icon style="font-size: 25px; color: #cccccc"><Document /></el-icon>
                <p>{{ ruleForm.file_name }}</p>
              </div>
              <el-icon @click="handleRemove" class="delete-icon" style="font-size: 20px; color: #f56c6c; cursor: pointer">
                <Close />
              </el-icon>
            </div>
          </el-col>
        </el-row>
        <div style="margin: 20px 0; text-align: right">
          <el-button @click="loadFlag = false">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 导入计量器具 -->
    <el-dialog v-model="strumentsloadFlag" :close-on-click-modal="false" title="导入计量器具" :width="800">
      <div style="min-height: 100px; text-align: center">
        <el-row v-if="!falseFlag">
          <el-col :span="24">
            <el-upload
              style="width: 100%"
              class="upload-demo"
              ref="uploadFile"
              :action="activeUrlInstruments"
              :data="{}"
              :headers="{ Authorization: token }"
              :before-upload="beforeAvatarUpload1"
              :on-success="handleSuccess1"
              :limit="1"
              :show-file-list="false"
            >
              <div class="upload-box">
                <el-icon style="font-size: 25px; color: #cccccc"><UploadFilled /></el-icon>
                <p>请上传</p>
              </div>
            </el-upload>
          </el-col>
        </el-row>
        <div v-else>
          <el-row>
            <h1 class="errorMath">
              导入失败数量：<span style="font-weight: bold; color: red">{{ errorData.fail_count }}</span>
            </h1>
          </el-row>
          <el-row>
            <el-table class="my-custom-table" :data="errorData.instruments_templates">
              <el-table-column label="计量器具名称" prop="name" align="left"> </el-table-column>
              <el-table-column label="计量器具编号" prop="instrument_id" align="left"> </el-table-column>
              <el-table-column label="型号规格" prop="model_specification" align="left"> </el-table-column>
              <el-table-column label="计量精度" prop="precision" align="left"> </el-table-column>
              <el-table-column label="能源品种" prop="varieties_name" align="left"> </el-table-column>
              <el-table-column label="错误类型" width="150px">
                <template #default="{ row }">
                  <div class="error-box">
                    {{ { 1: "缺少参数", 2: "计量器具编号重复", 3: "名字重复" }[row.fail_type] }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div style="margin: 20px 0; text-align: right">
          <el-button @click="strumentsloadFlag = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog v-model="dialogVisibleDetail" :close-on-click-modal="false" title="详情" :width="700">
      <div class="detail-box" style="min-height: 100px; padding: 0 20px">
        <h1 style="margin-bottom: 10px">{{ detailData.name }}</h1>
        <el-row :gutter="20">
          <el-col :span="12"><span class="dot"></span>型号规格：{{ detailData.model_specification }}</el-col>
          <el-col :span="12"><span class="dot"></span>编号：{{ detailData.instrument_id }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><span class="dot"></span>计量精度：{{ detailData.precision }}</el-col>
          <el-col :span="12">
            <span class="dot"></span>
            能源名称：{{ detailData.varieties_name }}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><span class="dot"></span>生产厂家：{{ detailData.manufacturer }}</el-col>
          <el-col :span="12"><span class="dot"></span>安装使用地点：{{ detailData.path }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><span class="dot"></span>检修周期：{{ detailData.intervals }}</el-col>
          <el-col :span="12"><span class="dot"></span>设备状态：{{ ["", "停用", "启用"][detailData.state] }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><span class="dot"></span>测量最小值：{{ detailData.measuring_min }}</el-col>
          <el-col :span="12"><span class="dot"></span>测量最大值：{{ detailData.measuring_max }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><span class="dot"></span>单位：{{ ["", "吨", "千克"][detailData.unit_id] }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <span class="dot"></span>
            使用手册：<a
              @click="loadFile({ file_id: file_info.id, file_name: file_info.name })"
              style="color: #409eff; cursor: pointer"
            >
              {{ file_info.name }}
            </a>
          </el-col>
        </el-row>
        <!-- <h1 style="margin: 15px 0"><span></span> 现场数据采集</h1>
        <el-row :gutter="20">
          <el-col :span="12"><span class="dot"></span>数据采集协议：{{ detailJson.deal_type }}</el-col>
        </el-row>
        <div v-if="detailJson.deal_type == 1">
          <el-row :gutter="20">
            <el-col :span="12"><span class="dot"></span>协议类型：{{ detailJson.obj.deal_type_val }}</el-col>
            <el-col :span="12">
              <span class="dot"></span>
              波特率：{{ detailJson.obj.rate }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="dot"></span>
              校验方式：{{ ["", "无校验", "奇校验", "偶校验"][detailJson.obj.method] }}
            </el-col>
            <el-col :span="12">
              <span class="dot"></span>
              停止位：{{ detailJson.obj.stop }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"><span class="dot"></span>起始地址：{{ detailJson.obj.startAddress }}</el-col>
            <el-col :span="12"><span class="dot"></span>结束地址：{{ detailJson.obj.endAddress }}</el-col>
          </el-row>
        </div>
        <div v-if="detailJson.deal_type == 2">
          <el-row :gutter="20">
            <el-col :span="12"><span class="dot"></span>主机/host：{{ detailJson.obj.host }}</el-col>
            <el-col :span="12">
              <span class="dot"></span>
              主机/端口：{{ detailJson.obj.port }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="dot"></span>
              协议：{{ detailJson.obj.protocol }}
            </el-col>
            <el-col :span="12">
              <span class="dot"></span>
              端点：{{ detailJson.obj.point }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"><span class="dot"></span>认证方式：{{ detailJson.obj.way }}</el-col>
            <el-col :span="12"><span class="dot"></span>值：{{ detailJson.obj.wayVal }}</el-col>
          </el-row>
        </div>
        <div v-if="detailJson.deal_type == 3">
          <el-row :gutter="20">
            <el-col :span="12"><span class="dot"></span>数据库类型：{{ detailJson.obj.databaseType }}</el-col>
            <el-col :span="12">
              <span class="dot"></span>
              数据库端口：{{ detailJson.obj.databaseHost }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="dot"></span>
              用户名：{{ detailJson.obj.username }}
            </el-col>
            <el-col :span="12">
              <span class="dot"></span>
              密码：{{ detailJson.obj.password }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20"><span class="dot"></span>数据表：</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <div style="padding: 10px; margin: 10px; border: 1px solid #cccccc">
                {{ detailJson.obj.dataSheet }}
              </div>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="20">
          <el-col :span="12"><span class="dot"></span>类型：{{ detailJson.send_type }}</el-col>
          <el-col :span="12">
            <span class="dot"></span>
            频率：{{ detailJson.frequency }}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><span class="dot"></span>计算公式：{{ detailJson.equation }}</el-col>
          <el-col :span="12">
            <span class="dot"></span>
            自定义字段：{{ detailJson.defined }}
          </el-col>
        </el-row> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { useUserStore } from "@/stores/modules/user";
import addStrumpet from "./addStrumpet/index.vue";
import { instruments_list, instruments_delete, instruments_info, instruments_update } from "@/api/modules/enterpriseSetup.js";
// import { file_download } from "@/api/modules/common.js";
import { ElMessageBox } from "element-plus";
export default {
  components: {
    addStrumpet
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //新增计量器具
      dialogVisibleAdd: false,
      instrumentsList: [],
      total: 0,
      page: 1,
      page_size: 10,
      levelObj: {
        1: "厂级",
        2: "车间级（工序级）",
        3: "设备级"
      },
      dealTypeObj: {
        1: "RS485",
        2: "API",
        3: "Database"
      },

      varietiesObj: {
        1: "化石燃料燃烧排放",
        2: "净购入的电力排放",
        3: "净购入的热力排放(热水)",
        4: "净购入的热力排放(蒸汽)",
        5: "熟料生产过程产生的碳排放（熟料）",
        6: "熟料生产过程产生的碳排放（非碳酸盐替代原料）",
        7: "光伏发电"
      },
      //详情
      dialogVisibleDetail: false,
      detailData: "",
      detailJson: "",
      file_info: "",
      //上传文件
      loadFlag: false,
      localFile: "",
      ruleForm: {
        file_id: "",
        file_name: ""
      },
      //导入计量器具
      strumentsloadFlag: false,
      falseFlag: false,
      errorData: {}
    };
  },
  computed: {
    activeUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/common/file/upload`;
      } else {
        return `/common/file/upload`;
      }
    },
    activeUrlInstruments() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/instruments/upload_template`;
      } else {
        return `/admin/instruments/upload_template`;
      }
    },
    loadTemple() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/instruments/download_template`;
      } else {
        return `/admin/instruments/download_template`;
      }
    },
    loadFileurl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/common/file/file_download?file_id=`;
      } else {
        return `/common/file/file_download?file_id=`;
      }
    },
    token() {
      return useUserStore().token;
    }
  },
  mounted() {
    // this.initPage();
  },
  methods: {
    initPage(val) {
      this.unitVal = val;
      this.getList();
    },
    getList() {
      let str = `page=${this.page}&page_size=${this.page_size}`;
      instruments_list(str).then(res => {
        if (res && res.data && res.data.list) {
          res.data.list.map(item => {
            item.config_json = item.config_json ? JSON.parse(item.config_json) : "";
          });
          this.instrumentsList = res.data.list;
          this.total = res.data.total;
        } else {
          this.instrumentsList = [];
          this.total = 0;
        }
      });
    },
    handleReset(val) {
      if (val == "addSuccess") {
        this.getList();
      }
      this.dialogVisibleAdd = false;
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
        this.$refs.addStrumpet.initPage();
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
          instruments_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    // 详情
    viewDetail(row, type) {
      this.dialogVisibleDetail = type == "edit" ? false : true;
      instruments_info({ id: row.id }).then(res => {
        if (type == "edit") {
          this.dialogVisibleAdd = true;
          this.$nextTick(() => {
            this.$refs.addStrumpet.initPage(res.data);
          });
          return;
        }
        if (res && res.data) {
          this.detailData = res.data;
          this.detailJson = res.data.config_json ? JSON.parse(res.data.config_json) : {};
          this.file_info = { name: res.data.file_name, id: res.data.file_id };
        } else {
          this.detailData = {};
          this.detailJson = {};
          this.file_info = {};
        }
      });
    },
    //上传文件
    addFile(row) {
      this.loadFlag = true;
      this.ruleForm.file_id = row.file_id;
      this.ruleForm.file_name = row.file_name;
      this.ruleForm.model_specification = row.model_specification;
    },
    beforeAvatarUpload(file) {
      this.localFile = file;
      return true;
    },
    handleSuccess(res) {
      this.ruleForm.file_id = res.data.file_id;
      this.ruleForm.file_name = this.localFile.name;
    },
    handleRemove() {
      this.ruleForm.file_id = "";
      this.ruleForm.file_name = "";
    },
    submitForm() {
      if (this.ruleForm.file_id) {
        instruments_update(this.ruleForm).then(res => {
          if (res && res.code == 0) {
            this.$message.success("上传成功");
            this.loadFlag = false;
            this.getList();
          }
        });
      } else {
        this.$message.error("请上传文件");
      }
    },
    //导入计量器具

    loadFileTemple() {
      let url = this.loadTemple;
      axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token
          },
          responseType: "blob"
        })
        .then(data => {
          const content = data.data;
          let blob = new Blob([content], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.href = url;
          aLink.setAttribute("download", "计量器具.xlsx");
          aLink.click();
          window.URL.revokeObjectURL(url);
        });
    },
    uploadFile() {
      this.strumentsloadFlag = true;
      this.falseFlag = false;
    },
    beforeAvatarUpload1() {
      // this.$refs.uploadFile.clearFiles();
    },
    handleSuccess1(res) {
      if (res.code == 0 && res.data.fail_count == 0) {
        this.$message.success("导入成功");
        this.strumentsloadFlag = false;
      } else {
        this.errorData = res.data;
        this.falseFlag = true;
      }
      this.getList();
    },
    //下载
    loadFile(row) {
      let url = `${this.loadFileurl}${row.file_id}`;
      axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token
          },
          responseType: "blob"
        })
        .then(data => {
          const content = data.data;
          let blob = new Blob([content], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.href = url;
          aLink.setAttribute("download", row.file_name);
          aLink.click();
          window.URL.revokeObjectURL(url);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.table-box {
  position: relative;
  height: 100%;
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
    height: calc(100% - 50px);
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
  .demo-pagination-block {
    position: absolute;
    right: 12px;
    bottom: 10px;
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
