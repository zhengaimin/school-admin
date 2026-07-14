<template>
  <div class="process-content">
    <div class="right" ref="refRight" style="margin-bottom: 20px">
      <h1>能源</h1>
      <div>
        <div class="energy-content">
          <div
            :class="[
              'box',
              {
                box1: v.emission_process_type == 1,
                box2: v.emission_process_type == 2,
                box3: v.emission_process_type == 3,
                box4: v.emission_process_type == 4
              }
            ]"
            v-for="v in list"
            :key="v.id"
          >
            <img v-if="v.emission_process_type == 1" src="@/assets/images/energy/energy01.svg" alt="" />
            <img v-if="v.emission_process_type == 2" src="@/assets/images/energy/energy02.svg" alt="" />
            <img v-if="v.emission_process_type == 3" src="@/assets/images/energy/energy03.svg" alt="" />
            <img v-if="v.emission_process_type == 4" src="@/assets/images/energy/energy04.svg" alt="" />
            <div class="source-type">
              <div>
                <h1>{{ v.name }}</h1>
                <img
                  v-if="false"
                  @click="deleteProcess(v)"
                  style="width: 20px; height: 20px"
                  src="@/assets/images/enterpriseSetup/delete-circle-2.svg"
                  alt=""
                />
              </div>
              <div class="create-time">创建时间：{{ v.created_at }}</div>
            </div>
          </div>
          <div v-if="isEdit" class="box box6" @click="addEnergy(1)">
            <img src="@/assets/images/energy/add.svg" alt="" />
            <div class="source-type">
              <div>
                <h1>添加常用</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right" ref="refRight">
      <h1>其它</h1>
      <div>
        <div class="energy-content">
          <div class="box box5" v-for="v in list_no" :key="v.id">
            <img src="@/assets/images/energy/noEnergy.svg" alt="" />
            <div class="source-type">
              <div>
                <h1>{{ v.name }}</h1>
              </div>
              <div class="create-time">创建时间：{{ v.created_at }}</div>
            </div>
          </div>
          <div v-if="isEdit" class="box box6" @click="addEnergy(2)">
            <img src="@/assets/images/energy/add.svg" alt="" />
            <div class="source-type">
              <div>
                <h1>添加常用</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialog" :close-on-click-modal="false" title="新增" width="80%">
      <div class="filter-box">
        <el-select style="width: 200px" v-model="filterForm.emission_process_type">
          <el-option v-for="v in unitList" :label="v.name" :value="v.id" :key="v.id" />
        </el-select>
        <el-input style="width: 200px; margin-left: 10px" v-model.trim="filterForm.variety_name" placeholder="请输入因子名称" />
        <el-button style="margin-left: 10px" type="primary" @click="factor_list">查询</el-button>
      </div>
      <div class="table-list">
        <el-table
          style="width: 100%; height: 600px"
          class="my-custom-table"
          border
          @selection-change="handleSelectionChange"
          :data="tableData"
        >
          <el-table-column v-if="isEdit" align="center" type="selection" width="55" />
          <el-table-column label="因子名称" align="left">
            <template #default="{ row }">
              {{ row.variety.name }}
            </template>
          </el-table-column>
          <el-table-column label="品类类型" align="left">
            <template #default="{ row }">
              {{ varityObj[row.variety.type] }}
            </template>
          </el-table-column>
          <el-table-column label="排放过程" align="left">
            <template #default="{ row }">
              {{ emissionObj[row.variety.emission_process_type] }}
            </template>
          </el-table-column>
          <el-table-column label="排放指南" align="left">
            <template #default="{ row }">
              {{ row.factor_source.name }}
              <span v-if="row.factor_source.second_category">-</span>
              {{ row.factor_source.second_category }}
            </template>
          </el-table-column>
          <el-table-column label="因子缺省值" align="left">
            <template #default="{ row }">
              <div v-for="v in row.factors" :key="v.key">{{ header[v.key] }}: {{ v.value }}</div>
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
      <div style="margin-top: 20px; text-align: center">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="moveConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import { factor_list, pick_to_com, factor_varieties_list, factor_delete } from "@/api/modules/basicLibrary.js";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      list_no: [],
      filterForm: {
        emission_process_type: 1,
        source_ids: [],
        variety_name: ""
      },
      varityObj: {
        1: "能源",
        2: "非能源"
      },
      emissionObj: [
        "",
        "化石燃料燃烧排放",
        "企业净购入的电力隐含的CO2排放 ",
        "企业净购入的热力(热水)隐含的CO2排放",
        "企业净购入的热力(蒸汽)隐含的CO2排放",
        "熟料生产过程产生的碳排放（熟料）",
        "熟料生产过程产生的碳排放（非碳酸盐替代原料）",
        "光伏发电"
      ],
      dialog: false,
      type: 1,
      total: 0,
      page: 1,
      page_size: 10,
      header: {},
      tableData: [],
      multipleSelection: []
    };
  },
  computed: {
    unitList() {
      let list = [
        { name: "化石燃料燃烧排放", id: 1 },
        { name: "净购入的电力排放", id: 2 },
        { name: "净购入的热力排放(热水)", id: 3 },
        { name: "净购入的热力排放(蒸汽)", id: 4 },
        { name: "熟料生产过程产生的碳排放（熟料）", id: 5 },
        { name: "熟料生产过程产生的碳排放（非碳酸盐替代原料）", id: 6 },
        { name: "光伏发电", id: 7 }
      ];
      if (this.type == 1) {
        return list.filter(v => v.id != 5 && v.id != 6);
      } else {
        return list.filter(v => v.id == 5 || v.id == 6);
      }
    }
  },
  mounted() {
    this.factor_varieties_list();
    this.factor_no_varieties_list();
  },
  methods: {
    // 获取列表品种列表
    factor_varieties_list() {
      let str = `type=1&model_type=1`;
      factor_varieties_list(str).then(res => {
        if (res.code == 0) {
          this.list = res.data.list;
        } else {
          this.list = [];
        }
      });
    },
    factor_no_varieties_list() {
      let str = `type=2&model_type=1`;
      factor_varieties_list(str).then(res => {
        if (res.code == 0) {
          this.list_no = res.data.list;
        } else {
          this.list_no = [];
        }
      });
    },
    addEnergy(v) {
      this.type = v;
      this.dialog = true;
      this.filterForm.variety_name = "";
      if (v == 1) {
        this.filterForm.emission_process_type = 1;
      } else {
        this.filterForm.emission_process_type = 5;
      }
      this.factor_list();
    },
    // 获取列表
    factor_list() {
      let source_ids_str = this.filterForm.source_ids.join(",");
      let str = `model_type=0&page=${this.page}&page_size=${this.page_size}&emission_process_type=${this.filterForm.emission_process_type}&source_ids=${source_ids_str}&variety_name=${this.filterForm.variety_name}`;
      factor_list(str).then(res => {
        if (res.code == 0 && res.data && res.data.list && res.data.list.length > 0) {
          this.header = {};
          res.data.header.map(v => {
            this.header[v.key] = v.name;
          });
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.factor_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.factor_list();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    moveConfirm() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择要同步的数据");
        return;
      }
      let ids = [];
      this.multipleSelection.map(v => {
        ids.push(v.id);
      });
      pick_to_com({ ids: ids }).then(res => {
        if (res.code == 0) {
          this.$message.success("新增成功");
          this.dialog = false;
          this.factor_varieties_list();
          this.factor_no_varieties_list();
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
          factor_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.factor_varieties_list();
              this.factor_no_varieties_list();
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
.process-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  .right {
    flex-grow: 1;
    overflow: auto;
    border-radius: 10px;
    > h1 {
      padding: 15px 20px;
      margin: 0;
      margin-bottom: 1px;
      font-size: 16px;
      font-weight: normal;
      color: #1f304c;
      background: #ffffff;
    }
    > div {
      padding: 20px;
      background: #ffffff;
      border-radius: 0 0 10px 10px;
    }
    .energy-content {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 20px;
      width: 100%;
      .box {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        background: #ffffff;
        border-radius: 10px;
        > img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        .source-type {
          width: calc(100% - 50px);
          padding-left: 20px;
          > div {
            display: flex;
            justify-content: space-between;
            > img {
              cursor: pointer;
            }
            > h1 {
              margin: 0;
              font-size: 16px;
              color: #1f304c;
            }
            > div {
              > span {
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
            > p {
              padding: 0;
              margin: 5px 0 15px;
              font-size: 14px;
              color: #4a5975;
              > span {
                display: inline-block;
                width: 8px;
                height: 8px;
                margin-right: 8px;
                background: #02c0e9;
                border-radius: 6px;
              }
            }
          }
          .create-time {
            margin-top: 10px;
            font-size: 12px;
            color: #8894b3;
          }
        }
      }
      .box1 {
        background-image: linear-gradient(180deg, #fff7f8 0%, #ffecee 100%);
      }
      .box2 {
        background-image: linear-gradient(180deg, #f1fdff 0%, #e7fbff 100%);
      }
      .box3 {
        background-image: linear-gradient(180deg, #f3fdfb 0%, #e3fbf5 100%);
      }
      .box4 {
        background-image: linear-gradient(180deg, #fff9ed 0%, #fff3e0 100%);
      }
      .box5 {
        background-image: linear-gradient(180deg, #edfff4 1%, #dffcea 99%);
      }
      .box6 {
        cursor: pointer;
        background: #f9fafb;
        border: 1px solid rgb(222 226 235 / 100%);
        .source-type {
          > div {
            margin-top: 10px;
            > h1 {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
.filter-box {
  margin-bottom: 10px;
}
.demo-pagination-block {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  text-align: right;
}
</style>
