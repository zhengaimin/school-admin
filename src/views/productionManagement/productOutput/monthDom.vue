<template>
  <div>
    <div class="content" v-for="(item, index) in productList" :key="item.product_id">
      <h1>
        <span> {{ item.product_name }}</span>
      </h1>
      <div class="set-box">
        <h2>
          单位：
          <span> {{ item.product_unit }} </span>
        </h2>
      </div>
      <div class="month-box" v-show="flag">
        <div v-for="k in item.list" :key="k.name">
          <p>{{ k.name }}</p>
          <el-input :disabled="!isEdit" min="0" oninput="if(value<0)value=0" type="number" v-model.number="k.product_num">
          </el-input>
        </div>
      </div>
      <div style="padding: 0 20px 20px; text-align: right">
        <el-button :disabled="!isEdit" type="primary" style="width: 80px" @click="addMonthBudget(index)">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { product_output_list, product_output_save } from "@/api/modules/productionManagement.js";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      flag: true,
      year: "",
      productList: [],
      monthList: [
        {
          name: "一月",
          key: 1
        },
        {
          name: "二月",
          key: 2
        },
        {
          name: "三月",
          key: 3
        },
        {
          name: "四月",
          key: 4
        },
        {
          name: "五月",
          key: 5
        },
        {
          name: "六月",
          key: 6
        },
        {
          name: "七月",
          key: 7
        },
        {
          name: "八月",
          key: 8
        },
        {
          name: "九月",
          key: 9
        },
        {
          name: "十月",
          key: 10
        },
        {
          name: "十一月",
          key: 11
        },
        {
          name: "十二月",
          key: 12
        }
      ]
    };
  },
  methods: {
    initPage(year) {
      this.year = year;
      this.monthList.map(v => {
        let monthVal = v.key < 10 ? "0" + v.key : v.key;
        v.dateStr = year + "-" + monthVal;
        v.date = Number((Date.UTC(year, v.key - 1) / 1000).toFixed(0));
        v.product_num = "";
        v.id = 0;
      });
      this.product_output_list();
    },
    product_output_list() {
      let params = `year=${this.year}&time_dimension=2`;
      product_output_list(params).then(res => {
        if (res.code == 0 && res.data && res.data.length > 0) {
          this.flag = true;
          this.productList = res.data;
          this.productList.map(v => {
            if (v.list == null) {
              v.list = JSON.parse(JSON.stringify(this.monthList));
            } else {
              let cloneList = JSON.parse(JSON.stringify(this.monthList));
              cloneList.map(k => {
                v.list.map(j => {
                  if (k.dateStr + "-01" == j.date) {
                    k.id = j.id;
                    k.product_num = j.product_num == -9007199254740991 ? "" : j.product_num;
                  }
                });
              });
              v.list = cloneList;
            }
          });
        } else {
          this.productList = [];
        }
      });
    },
    addMonthBudget(index) {
      let list = this.productList[index].list.filter(v => v.id || v.product_num !== "");
      this.flag = false;
      list.map(v => {
        v.product_num = v.product_num ? v.product_num : -9007199254740991;
      });
      let obj = {
        list: list,
        product_id: this.productList[index].product_id,
        time_dimension: 2
      };
      product_output_save(obj).then(res => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.product_output_list();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  margin-bottom: 10px;
  background: #ffffff;
  border-radius: 10px;
  > h1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
    margin: 0;
    border-bottom: 1px solid #ebeef5;
    > span {
      font-size: 16px;
      font-weight: 500;
      color: #4a5975;
    }
    > div {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: normal;
      > span {
        display: inline-block;
        height: 56px;
        margin-right: 20px;
        line-height: 56px;
        color: #1f304c;
        cursor: pointer;
      }
      .active {
        color: #0ec69a;
        border-bottom: 2px solid #0ec69a;
      }
      > label {
        margin: 0 10px 0 20px;
        font-size: 14px;
        color: #4a5975;
      }
    }
  }
  .set-box {
    padding: 0 20px;
    .company-box {
      display: grid;
      grid-template-columns: auto auto;
    }
    > h2 {
      display: flex;
      align-items: center;
      padding: 15px 0;
      margin: 0;
      font-size: 15px;
      font-weight: normal;
      color: #4a5975;
      > span {
        padding: 2px 10px;
        font-size: 18px;
        color: #ffffff;
        background: #0ec69a;
        border-radius: 5px;
        > span {
          font-size: 13px;
        }
      }
    }
    h3 {
      padding: 20px;
      margin: 0;
      background: #f9fafb;
      border: 1px solid rgb(222 226 235 / 100%);
      border-radius: 6px 0 0 6px;
      h4 {
        margin: 0;
        margin-bottom: 10px;
        font-size: 15px;
        font-weight: normal;
        color: #1f304c;
      }
    }
  }
  .month-box {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto;
    padding: 0 20px 20px;
    > div {
      padding: 20px;
      background: #f9fafb;
      border: 1px solid rgb(222 226 235 / 100%);
      p {
        margin: 0;
        margin-bottom: 10px;
        text-align: right;
      }
    }
  }
}
</style>
