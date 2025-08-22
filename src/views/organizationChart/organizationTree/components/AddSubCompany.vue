<template>
  <div>
    <CommonForm
      ref="addSubCompany"
      :form-config="form"
      :common-config="commonConfig"
      :form-items="formItems"
      @handle-reset="handleReset"
      @get-form-data="getFormData"
    >
      <template #laster>
        <div style="display: flex; justify-content: space-between">
          <div style="width: 100%">
            <el-form-item label="法人" prop="corporate_name" :rules="[{ required: true, message: '请填写法人' }]">
              <el-input v-model="form.corporate_name"></el-input>
            </el-form-item>
            <el-form-item label="注册日期" prop="registration_date" :rules="[{ required: true, message: '请填写电子邮箱' }]">
              <el-input v-model="form.registration_date"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="contact_mail" :rules="[{ required: true, message: '请填写电子邮箱' }]">
              <el-input v-model="form.contact_mail"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="province_id" :rules="[{ required: true, message: '请选择公司地址' }]">
              <el-select
                style="width: 49%; margin-right: 2%; margin-bottom: 10px"
                v-model="form.province_id"
                clearable
                size="default"
                placeholder="请选择省"
                @focus="locations({ deep: 0 })"
                @change="val => ((form.city_id = ''), (form.area_id = ''), (form.street_id = ''))"
              >
                <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-select
                style="width: 49%; margin-bottom: 10px"
                v-model="form.city_id"
                clearable
                size="default"
                placeholder="请选择市"
                @focus="locations({ deep: 1 })"
                @change="val => ((form.area_id = ''), (form.street_id = ''))"
              >
                <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-select
                style="width: 49%; margin-right: 2%"
                v-model="form.area_id"
                clearable
                size="default"
                placeholder="请选择区县"
                @focus="locations({ deep: 2 })"
                @change="val => (form.street_id = '')"
              >
                <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-select
                v-if="false"
                style="width: 49%"
                v-model="form.street_id"
                clearable
                size="default"
                placeholder="请选择街道"
                @focus="locations({ deep: 3 })"
              >
                <el-option v-for="item in streetList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div>
          <el-form-item label="详细地址" prop="address" :rules="[{ required: true, message: '必填项' }]">
            <el-input v-model="form.address" placeholder="请输入详细地址" />
          </el-form-item>
        </div>
      </template>
    </CommonForm>
  </div>
</template>
<script>
import { formInfo } from "@/api/modules/formConfig.js";
import CommonForm from "@/components/CommonForm/index.vue";
import { deepClone } from "@/utils/deepClone.js";
import { locations } from "@/api/modules/common.js";
import { organizationAdd, organizationUpdate } from "@/api/modules/organization.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  components: { CommonForm },
  emits: ["handleReset"],
  data() {
    return {
      form: {
        province_id: "",
        city_id: "",
        area_id: "",
        street_id: "",
        address: "",
        logo: "http://img/aa.jpg"
      },
      formItems: [],
      commonConfig: {},
      localConfig: {
        labelPosition: "left",
        col: 3,
        labelWidth: 100,
        size: "default",
        labelSize: 14,
        btnposition: "left"
      },
      tenant_list: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      streetList: [],
      parent_id: "",
      typeList: [
        {
          label: "农、林、牧、渔业",
          value: 1
        },
        {
          label: "采矿业",
          value: 2
        },
        {
          label: "制造业",
          value: 3
        },
        {
          label: "电力、热力、燃气及水生产和供应业",
          value: 4
        },
        {
          label: "建筑业",
          value: 5
        },
        {
          label: "批发和零售业",
          value: 6
        },
        {
          label: "交通运输、仓储和邮政业",
          value: 7
        },
        {
          label: "住宿和餐饮业",
          value: 8
        },
        {
          label: "信息传输、软件和信息技术服务业",
          value: 9
        },
        {
          label: "金融业",
          value: 10
        },
        {
          label: "房地产业",
          value: 11
        },
        {
          label: "租赁和商务服务业",
          value: 12
        },
        {
          label: "科学研究和技术服务业",
          value: 13
        },
        {
          label: "水利、环境和公共设施管理业",
          value: 14
        },
        {
          label: "居民服务、修理和其他服务业",
          value: 15
        },
        {
          label: "教育",
          value: 16
        },
        {
          label: "卫生和社会工作",
          value: 17
        },
        {
          label: "文化、体育和娱乐业",
          value: 18
        },
        {
          label: "公共管理、社会保障和社会组织",
          value: 19
        },
        {
          label: "国际组织",
          value: 20
        }
      ]
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    }
  },
  methods: {
    async initPage(parent_id) {
      this.parent_id = parent_id;
      this.formInfo();
      for (let key in this.form) {
        if (key != "id" && key != "logo") {
          this.form[key] = "";
        }
      }
      this.provinceList = [];
      this.cityList = [];
      this.areaList = [];
      this.streetList = [];
    },
    initPageEdit(data) {
      this.formInfo();
      this.$nextTick(() => {
        for (let key in data) {
          this.form[key] = data[key];
        }
        this.form.org_name = data.name;
        this.locations({ deep: 0 });
        this.locations({ deep: 1 });
        this.locations({ deep: 2 });
        this.locations({ deep: 3 });
      });
    },
    formInfo() {
      formInfo({ key: "addSubCompany" }).then(res => {
        let configObj = JSON.parse(res.data);
        this.commonConfig = configObj.config ? deepClone(JSON.parse(configObj.config).commonConfig) : this.localConfig;
        this.formItems = configObj.config ? deepClone(JSON.parse(configObj.config).configList) : [];
        this.formItems.forEach(v => {
          if (v.model == "tenant_id") {
            v.options = [];
            this.tenant_list.map(item => {
              v.options.push({ label: item.name, value: item.id });
            });
          }
          if (v.model == "industry_type") {
            v.options = this.typeList;
          }
        });
      });
    },
    //获取地址
    locations(params) {
      let parent_code = "";
      switch (params.deep) {
        case 0:
          parent_code = "";
          break;
        case 1:
          parent_code = this.form.province_id;
          break;
        case 2:
          parent_code = this.form.city_id;
          break;
        case 3:
          parent_code = this.form.area_id;
          break;
      }
      let form = `deep=${params.deep}&parent_code=${parent_code}`;
      locations(form).then(res => {
        if (res.code == 0) {
          switch (params.deep) {
            case 0:
              this.provinceList = res.data.list;
              break;
            case 1:
              this.cityList = res.data.list;
              break;
            case 2:
              this.areaList = res.data.list;
              break;
            case 3:
              this.streetList = res.data.list;
              break;
          }
        }
      });
    },
    //获取表单数据
    getFormData(form) {
      const reg = /^1[3-9]\d{9}$/;
      if (!reg.test(form.contact_info) && form.contact_info !== "") {
        this.$message.warning("请输入正确的电话号码");
        return;
      }
      form.sort = Number(form.sort);
      form.org_type = 2;
      form.industry_type = Number(form.industry_type);
      form.parent_id = this.parent_id;
      this.form.street_id = 0; //暂时不填街道
      if (this.form.id) {
        delete form.parent_id;
        organizationUpdate(form).then(res => {
          if (res.code == 0) {
            this.$message.success("修改成功");
            this.handleReset();
          }
        });
        return;
      }
      organizationAdd(form).then(res => {
        if (res.code == 0) {
          this.$message.success("新增成功");
          this.handleReset();
        }
      });
    },
    handleReset() {
      this.$emit("handleReset");
    }
  }
};
</script>
