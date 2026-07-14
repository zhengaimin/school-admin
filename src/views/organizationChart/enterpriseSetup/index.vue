<template>
  <div style="height: 100%">
    <div class="tab-box">
      <div>
        <el-radio-group v-model="radio2" @change="selectCom">
          <el-radio-button :label="$t('company.sourceType')" value="1" />
          <el-radio-button :label="$t('company.productVariety')" value="2" />
          <el-radio-button :label="$t('company.productionProcesses')" value="3" />
          <el-radio-button :label="$t('company.device')" value="4" />
          <el-radio-button :label="$t('company.energyUnit')" value="5" />
          <el-radio-button :label="$t('company.energyEquipment')" value="6" />
          <!-- <el-radio-button label="物质流向图" value="3" v-if="false" /> -->
        </el-radio-group>
      </div>
      <div>
        <!-- <el-button type="primary" v-if="isEdit && radio2 == 1" @click="addList"> 新增 </el-button> -->
      </div>
    </div>
    <div class="content">
      <productionEnergy :is-edit="isEdit" v-if="radio2 == 1" ref="productionEnergy" />
      <productionList :is-edit="isEdit" v-if="radio2 == 2" ref="productionList" />
      <productionProcesses :is-edit="isEdit" v-if="radio2 == 3" ref="productionProcesses" />
      <!-- <productionVariety :is-edit="isEdit" v-if="radio2 == 3" ref="productionVariety" /> -->
      <productionInstrument :is-edit="isEdit" v-if="radio2 == 4" ref="productionInstrument" />
      <productionUnit :is-edit="isEdit" v-if="radio2 == 5" ref="productionUnit" />
      <productionEquipment :is-edit="isEdit" v-if="radio2 == 6" ref="productionEquipment" />
    </div>
  </div>
</template>
<script>
import productionEnergy from "./productionEnergy.vue";
import productionList from "./productionList.vue";
import productionProcesses from "./productionProcesses.vue";
// import productionVariety from "./productionVariety.vue";
import productionInstrument from "./productionInstrument.vue";
import productionUnit from "./productionUnit.vue";
import productionEquipment from "./productionEquipment.vue";
import { api_list } from "@/api/modules/menu.js";
export default {
  components: {
    productionEnergy,
    productionList,
    productionProcesses,
    // productionVariety,
    productionInstrument,
    productionUnit,
    productionEquipment
  },
  data() {
    return {
      radio2: "1",
      buttonList: []
    };
  },
  computed: {
    isEdit() {
      return this.buttonList.includes("system") || this.buttonList.includes("edit");
    }
  },
  mounted() {
    this.api_list();
  },
  methods: {
    api_list() {
      //获取路由地址
      let path = `path=${this.$router.currentRoute.value.fullPath}&menu_type=F&visible=0`;
      api_list(path).then(res => {
        if (res.data.list && res.data.list.length > 0) {
          res.data.list.map(v => {
            this.buttonList.push(v.title);
          });
        } else {
          this.buttonList = [];
        }
      });
    },
    selectCom() {
      let list = [
        "",
        "",
        "productionList",
        "productionProcesses",
        "productionInstrument",
        "productionUnit",
        "productionEquipment"
      ];
      if (list[this.radio2]) {
        this.$refs[list[this.radio2]].initPage(this.radio2);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
