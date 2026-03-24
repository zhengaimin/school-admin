# SelectFilter 使用说明

`SelectFilter` 是一个轻量筛选组件，支持单选和多选，常用于“状态/类型/标签”这类快速筛选场景。

## 基础用法

```vue
<template>
  <SelectFilter :data="filterData" :default-values="filterValue" @change="handleFilterChange" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import SelectFilter from "@/components/SelectFilter/index.vue";

const filterValue = ref({
  deviceType: "",
  status: [""]
});

const filterData = [
  {
    title: "设备类型(单)",
    key: "deviceType",
    options: [
      { label: "全部", value: "" },
      { label: "吹风机", value: "DRYER" },
      { label: "视频话机", value: "VIDEO" }
    ]
  },
  {
    title: "状态(多)",
    key: "status",
    multiple: true,
    options: [
      { label: "全部", value: "" },
      { label: "在线", value: "1" },
      { label: "离线", value: "0" }
    ]
  }
];

function handleFilterChange(value: Record<string, any>) {
  filterValue.value = value;
}
</script>
```

## Props

- `data`: 筛选项配置数组。
- `defaultValues`: 默认选中值对象，按 `key` 映射。

### data 结构

- `title`: 分组标题。
- `key`: 当前筛选项字段名。
- `multiple`: 是否多选，默认 `false`。
- `options`: 选项数组，结构为 `{ label, value, icon? }`。

## 事件

- `change(value)`: 选中项变化时触发，返回最新筛选对象。

## “全部”选项约定（重要）

- 单选场景：
  - 推荐将“全部”配置为 `value: ""`。
- 多选场景：
  - 必须把“全部”放在 `options` 第一项。
  - 组件内部按第一项处理“全选/清空”逻辑。
  - 推荐默认值使用 `[""]`。

## 参考示例

- `src/views/assembly/selectFilter/index.vue`
