<template>
  <div class="company-com">
    <div class="company-msg">
      <h1>{{ treeNode.name }}</h1>
      <span>所属行业：{{ isType(treeNode.industry_type) }}</span>
      <div>
        <div>
          <span></span>
          <label>企业信用代码：{{ treeNode.credit_code }}</label>
        </div>
        <div v-if="treeNode.province">
          <span></span>
          <label>企业所在地：{{ treeNode?.province.ext_name }}{{ treeNode.city.ext_name }}</label>
          <label>{{ treeNode.area.ext_name }}{{ treeNode.address }}</label>
        </div>
      </div>
      <div>
        <div>
          <span></span>
          <label>联系人：{{ treeNode.contact }}</label>
        </div>
        <div>
          <span></span>
          <label>联系方式：{{ treeNode.contact_info }}</label>
        </div>
        <div>
          <span></span>
          <label>职务：{{ treeNode.contact_post }}</label>
        </div>
      </div>
    </div>
    <div class="company-table table-box">
      <div class="nav-box">
        <div>
          <span :class="{ active: flag == 2 }" @click="selectCom(2)">子公司</span>
          <span :class="{ active: flag == 3 }" @click="selectCom(3)">部门</span>
        </div>
        <el-button
          :disabled="!userInfo.is_admin || !isEdit"
          @click="addSubCompany"
          type="primary"
          class="search-btn"
          v-if="flag == 2"
        >
          <img
            src="@/assets/images/common/add-circle-2.svg"
            alt=""
            style="width: 18px; height: 18px; margin-right: 3px; color: #ffffff"
          />
          添加子公司
        </el-button>
        <el-button :disabled="!isEdit" @click="addDepartment" type="primary" class="search-btn" v-else>
          <img
            src="@/assets/images/common/add-circle-2.svg"
            alt=""
            style="width: 18px; height: 18px; margin-right: 3px; color: #ffffff"
          />
          添加部门
        </el-button>
      </div>
      <div v-if="flag == 2">
        <div class="sub-filter-form">
          <label>子公司</label>
          <el-input v-model="filterStr" style="width: 250px"></el-input>
          <el-button class="search-btn" style="margin-left: 10px" @click="reset"> 重置 </el-button>
          <el-button type="primary" class="search-btn" @click="organizationData"> 查询 </el-button>
        </div>
        <div class="table-list">
          <el-table class="my-custom-table1" :data="carbonCk_list">
            <el-table-column label="子公司名称" prop="name" align="left" width="200"> </el-table-column>
            <el-table-column label="负责人" prop="contact" align="left" width="120"> </el-table-column>
            <el-table-column label="负责人电话" prop="contact_info" align="left" width="120"> </el-table-column>
            <el-table-column label="负责人岗位" prop="contact_post" align="left" width="120"> </el-table-column>
            <el-table-column label="描述" prop="description" align="left" width="300" show-overflow-tooltip> </el-table-column>
            <el-table-column label="地址" align="left" width="300">
              <template #default="scope">
                <span v-if="scope.row.province">
                  {{ scope.row.province.ext_name }}{{ scope.row.city.ext_name }} {{ scope.row.area.ext_name
                  }}{{ scope.row.address }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120" fixed="right">
              <template #default="scope">
                <div class="table-btn" v-if="isEdit">
                  <div @click="editSubCompany(scope.row)">
                    <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
                  </div>
                  <div @click="deleteSubCompany(scope.row)">
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
      </div>
      <div v-if="flag == 3">
        <div class="sub-filter-form">
          <label>部门</label>
          <el-input v-model="filterStr" style="width: 250px"></el-input>
          <el-button class="search-btn" style="margin-left: 10px" @click="reset"> 重置 </el-button>
          <el-button type="primary" class="search-btn" @click="organizationData"> 查询 </el-button>
        </div>
        <div class="table-list">
          <el-table class="my-custom-table" :data="carbonCk_list">
            <el-table-column label="部门名称" prop="name" align="left" width="200"> </el-table-column>
            <el-table-column label="负责人" prop="contact" align="left" width="120"> </el-table-column>
            <el-table-column label="负责人电话" prop="contact_info" align="left" width="120"> </el-table-column>
            <el-table-column label="负责人岗位" prop="contact_post" align="left" width="120"> </el-table-column>
            <el-table-column label="描述" prop="description" align="left"> </el-table-column>
            <el-table-column label="操作" align="center" width="120" fixed="right">
              <template #default="scope">
                <div class="table-btn" v-if="isEdit">
                  <!-- <div>添加成员</div> -->
                  <div @click="editDepartment(scope.row)">
                    <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
                  </div>
                  <div @click="deleteDepartment(scope.row)">
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
      </div>
    </div>
  </div>
</template>
<script>
import { organizationData } from "@/api/modules/organization.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ["addSubCompany", "editSubCompany", "deleteSubCompany", "addDepartment"],
  data() {
    return {
      treeNode: {},
      filterStr: "",
      flag: 2,
      carbonCk_list: [],
      obj: { 1: "行业1", 2: "行业2", 3: "行业3" },
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
    initPage(data) {
      this.treeNode = data;
      this.organizationData();
    },
    //查询子级
    organizationData() {
      let str = `parent_id=${this.treeNode.id}&org_type=${this.flag}&org_name=${this.filterStr}&page=1&page_size=100`;
      organizationData(str).then(res => {
        if (res.code == 0) {
          this.carbonCk_list = res.data.list;
        }
      });
    },
    //添加子公司
    addSubCompany() {
      this.$emit("addSubCompany", this.treeNode);
    },
    //编辑子公司
    editSubCompany(row) {
      this.$emit("editSubCompany", { level: 1 }, row);
    },
    //删除子公司
    deleteSubCompany(row) {
      this.$emit("deleteSubCompany", row);
    },
    //添加部门
    addDepartment() {
      this.$emit("addDepartment", this.treeNode);
    },
    //编辑部门
    editDepartment(row) {
      this.$emit("editSubCompany", { level: 3 }, row);
    },
    //删除部门
    deleteDepartment(row) {
      this.$emit("deleteSubCompany", row);
    },
    reset() {
      this.filterStr = "";
      this.organizationData();
    },
    selectCom(val) {
      this.flag = val;
      this.organizationData();
    },
    delete(row) {
      console.log(row);
    },
    isType(value) {
      let ary = this.typeList.filter(item => item.value == value);
      if (ary.length > 0) {
        return ary[0].label;
      }
      return "";
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
