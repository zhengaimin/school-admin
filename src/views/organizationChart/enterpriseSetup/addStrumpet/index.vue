<template>
  <div>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-position="top">
      <el-row>
        <el-col :span="24">
          <h1><span></span>计量器具信息</h1>
          <el-row>
            <el-col :span="15">
              <el-form-item label="计量器具名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="计量器具编号" prop="instrument_id">
                <el-input v-model="ruleForm.instrument_id" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="型号规格" prop="model_specification">
                <el-input v-model="ruleForm.model_specification" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="计量精度" prop="precision">
                <el-input v-model="ruleForm.precision" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="能源品种" prop="varieties_id">
                <el-select @focus="varieties_list" v-model="ruleForm.varieties_id">
                  <el-option v-for="v in varietiesList" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="测量范围(最小值)">
                <el-input v-model="ruleForm.measuring_min" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="最大值">
                <el-input v-model="ruleForm.measuring_max" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="生产厂家" prop="manufacturer">
                <el-input v-model="ruleForm.manufacturer" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="安装使用地点" prop="path">
                <el-input v-model="ruleForm.path" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="检修周期" prop="intervals">
                <el-input v-model="ruleForm.intervals" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="设备状态" prop="state">
                <el-select v-model="ruleForm.state" placeholder="请选择">
                  <el-option label="停用" :value="Number(1)" />
                  <el-option label="启用" :value="Number(2)" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin: 20px 0; text-align: right">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </div>
</template>
<script>
import { instruments_add, instruments_update, factor_varieties_list } from "@/api/modules/enterpriseSetup.js";
export default {
  emits: ["close"],
  data() {
    return {
      varietiesList: [],
      ruleForm: {
        type: 1,
        name: "",
        instrument_id: "",
        model_specification: "",
        precision: "",
        varieties_id: "",
        measuring_min: "",
        measuring_max: "",
        unit_id: "",
        manufacturer: "",
        path: "",
        intervals: "",
        state: ""
      },
      rules: {
        name: [{ required: true, message: "必填项" }],
        instrument_id: [{ required: true, message: "必填项" }],
        model_specification: [{ required: true, message: "必填项" }],
        precision: [{ required: true, message: "必填项" }],
        varieties_id: [{ required: true, message: "必填项" }]
      }
    };
  },
  methods: {
    initPage(data) {
      if (data) {
        let form = data;
        for (let key in this.ruleForm) {
          if (form[key]) {
            this.ruleForm[key] = form[key] == -176896 ? "" : form[key];
          } else {
            if (key != "type") {
              this.ruleForm[key] = "";
            }
          }

          this.ruleForm["id"] = form.id;
        }
        return;
      }
      this.$refs.ruleFormRef.resetFields();
      delete this.ruleForm.id;
    },
    //能源品种列表
    varieties_list() {
      let str = `model_type=1`;
      factor_varieties_list(str).then(res => {
        if (res.code == 0) {
          this.varietiesList = res.data.list;
        } else {
          this.varietiesList = [];
        }
      });
    },
    submitForm() {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          let numberKey = ["varieties_id", "state", "unit_id"];
          let emptyKey = ["measuring_min", "measuring_max"];
          for (let key in this.ruleForm) {
            if (numberKey.includes(key)) {
              this.ruleForm[key] = Number(this.ruleForm[key]);
            }
            if (emptyKey.includes(key)) {
              if (this.ruleForm[key] == "") {
                this.ruleForm[key] = -176896;
              } else {
                this.ruleForm[key] = Number(this.ruleForm[key]);
              }
            }
          }

          if (this.ruleForm.id) {
            instruments_update(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.$message.success("修改成功");
                this.$emit("close", "addSuccess");
              }
            });
            return;
          }
          instruments_add(this.ruleForm).then(res => {
            if (res.code == 0) {
              this.$message.success("新增成功");
              this.$emit("close", "addSuccess");
            }
          });
        }
      });
    },
    cancel() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="scss" scoped>
h1 {
  display: flex;
  align-items: center;
  margin: 0;
  margin-bottom: 20px;
  font-size: 14px;
  > span {
    display: inline-block;
    width: 4px;
    height: 14px;
    margin-right: 8px;
    vertical-align: middle;
    background: #0ec69a;
  }
}
:deep(.el-upload) {
  width: 100%;
}
.upload-box {
  width: 100%;
  padding-top: 10px;
  cursor: pointer;
  background: rgb(249 250 251);
  border: 1px solid rgb(222 226 235);
  border-radius: 5px;
  p {
    padding: 0;
    margin: 0;
    margin-top: -15px;
    color: #999999;
  }
}
.file-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding-right: 10px;
  background: #d9ecff;
  border: 1px solid #cccccc;
  > div {
    display: flex;
    align-items: center;
  }
}
.link-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 600px;
  border: 1px solid #cccccc;
  > div {
    height: 600px;
    h2 {
      padding: 10px 0;
      margin: 0;
      font-size: 15px;
      font-weight: normal;
      color: #ffffff;
      text-align: center;
      background: #0ec69a;
    }
    p {
      height: 35px;
      padding: 0;
      margin: 0;
      line-height: 35px;
      cursor: pointer;
      border-bottom: 1px solid #cccccc;
      i {
        float: right;
        margin-top: 10px;
        margin-right: 10px;
        font-size: 18px;
        color: #0ec69a;
      }
    }
  }
  .link-left {
    width: 200px;
    border-right: 1px solid #cccccc;
  }
  .link-center {
    width: 200px;
    border-right: 1px solid #cccccc;
  }
  .link-right {
    flex: auto;
  }
}
</style>
