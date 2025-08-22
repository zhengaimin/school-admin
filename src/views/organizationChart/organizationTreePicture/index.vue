<template>
  <div style="height: 100%">
    <div style="display: flex; padding: 10px" v-if="false">
      <div style="margin-right: 10px"><el-switch v-model="horizontal"></el-switch> 横向</div>
      <div style="margin-right: 10px"><el-switch v-model="collapsable"></el-switch> 可收起</div>
      <div style="margin-right: 10px"><el-switch v-model="disaled"></el-switch> 禁止编辑</div>
      <div style="margin-right: 10px"><el-switch v-model="onlyOneNode"></el-switch> 仅拖动当前节点</div>
    </div>
    <div style="padding: 0 10px 10px" v-if="false">
      背景色：<el-color-picker v-model="style.background" size="small"></el-color-picker>&nbsp; 文字颜色：<el-color-picker
        v-model="style.color"
        size="small"
      >
      </el-color-picker>
    </div>
    <div style="width: 100%; height: 100%; overflow: hidden; border-radius: 10px">
      <vue3-tree-org
        :data="data || ''"
        :load="loadData"
        :node-draggable="true"
        :props="{ id: 'id', label: 'name', children: 'children' }"
        :center="true"
        :horizontal="horizontal"
        :disabled="disaled"
        :collapsable="collapsable"
        :label-style="style"
        :only-one-node="onlyOneNode"
        :before-drag-end="beforeDragEnd"
        :tool-bar="{ scale: false, restore: false, expand: false, zoom: false, fullscreen: false, center: true }"
        @on-node-drag="nodeDragMove"
        @on-node-drag-end="nodeDragEnd"
        @on-contextmenu="onMenus"
        @on-expand="onExpand"
        @on-node-dblclick="onNodeDblclick"
        @on-node-click="onNodeClick"
      >
        <template #default="{ node }">
          <div>
            <div class="tree-org-node__text node-label" v-if="node['$$data']['org_type'] == 1 || node['$$data']['org_type'] == 2">
              <div class="custom-content">{{ node.label }}</div>
            </div>
            <div class="tree-org-node__text node-label levelThree" v-else-if="node['$$data']['org_type'] == 3">
              <div class="custom-content">{{ node.label }}</div>
            </div>
            <div class="tree-org-node__text node-label levelUser" v-else>
              <div class="custom-content">{{ node.label }}</div>
            </div>
          </div>
        </template>
      </vue3-tree-org>
    </div>
  </div>
</template>
<script>
import { organizationList } from "@/api/modules/organization.js";
import { userList } from "@/api/modules/user.js";
export default {
  data() {
    return {
      data: {},
      horizontal: false,
      collapsable: false,
      onlyOneNode: true,
      expandAll: true,
      disaled: true,
      style: {
        background: "#fff",
        color: "#5e6d82"
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptName: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.toggleExpand(this.data, this.expandAll);
    this.getTree();
  },
  mounted() {
    this.getTree();
  },
  methods: {
    getTree() {
      organizationList().then(res => {
        if (res.code == 0 && res.data) {
          this.data = res.data[0];
        } else {
          this.data = {
            id: 0,
            label: "暂无数据"
          };
        }
      });
    },
    onNodeClick(e, data) {
      if (data.org_type != 3) {
        return;
      }
      userList(`org_id=${data.id}`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          res.data.list.map(v => {
            v.name = v.username;
          });
          this.resetTree(this.data, res.data.list);
        }
      });
    },
    resetTree(node, list) {
      if (node.org_type == 3) {
        if (node.id == list[0].org_id) {
          node.children = list;
        }
      }
      if (node.children && node.children.length > 0) {
        node.children.map(child => {
          this.resetTree(child, list);
        });
      }
    },
    loadData(node, resolve) {
      if (node.$$level === 0) {
        return resolve([]);
      }
      if (node.$$level > 1) return resolve([]);
    },
    nodeDragEnd(data, isSelf) {
      console.log(data, isSelf);
    },
    onMenus({ node, command }) {
      console.log(node, command);
    },
    onExpand(e, data) {
      console.log(e, data);
    },
    onExpandAll(b) {
      console.log(b);
    },
    nodeDragMove(data) {
      console.log(data);
    },
    beforeDragEnd(node, targetNode) {
      return new Promise((resolve, reject) => {
        if (!targetNode) reject();
        if (node.id === targetNode.id) {
          reject();
        } else {
          resolve();
        }
      });
    },
    onNodeDblclick() {
      console.log("onNodeDblclick");
    },
    expandChange() {
      this.toggleExpand(this.data, this.expandAll);
    },
    toggleExpand(data, val) {
      if (Array.isArray(data)) {
        data.forEach(item => {
          item.expand = val;
          if (item.children) {
            this.toggleExpand(item.children, val);
          }
        });
      } else {
        data.expand = val;
        if (data.children) {
          this.toggleExpand(data.children, val);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep(.tree-org-node__inner) {
  border-radius: 25px !important;
}
::v-deep(.zm-tree-org) {
  padding-top: 50px;
}
.tree-org-node__text {
  height: 35px;
  padding: 0 30px;
  font-size: 20px;
  line-height: 35px;
  color: #ffffff;
  background: linear-gradient(194deg, #0ec69a 0%, #02c0e9 100%);
  border-radius: 25px;
}
.levelTwo {
  background: #0ec69a;
}
.levelThree {
  font-size: 16px;
  background: #0ec69a;
}
.levelUser {
  font-size: 14px;
  color: #1f304c;
  background: #dee2eb;
}
</style>
