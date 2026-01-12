# Vue 开发规范

## Props 定义规范

### 1. 使用 `defineProps` + `withDefaults`

在定义组件 props 时,应优先使用 TypeScript 接口配合 `defineProps` 和 `withDefaults` 的方式,而不是使用对象字面量方式。

**❌ 不推荐:**

```vue
<script setup>
defineProps({
  formList: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>
```

**✅ 推荐:**

```vue
<script setup lang="ts">
interface Props {
  formList?: any[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  formList: () => [],
  disabled: false
});
</script>
```

**优势:**

- 提供更好的类型推断和类型检查
- 代码更简洁清晰
- 符合 Vue 3 Composition API 最佳实践
- IDE 支持更好(自动补全、重构等)

## 双向绑定规范

### 2. 使用 `defineModel` 实现双向绑定

对于需要双向绑定的 prop,应使用 Vue 3.4+ 引入的 `defineModel` 宏,而不是手动定义 `modelValue` prop 和 `update:modelValue` 事件。

**❌ 不推荐:**

```vue
<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(["update:modelValue"]);

/** 更新模型值 */
const updateValue = newValue => {
  emit("update:modelValue", newValue);
};
</script>
```

**✅ 推荐:**

```vue
<script setup lang="ts">
// 基础用法
const modelValue = defineModel<Record<string, any>>({ default: () => ({}) });

// 多个 v-model
const title = defineModel<string>("title", { default: "" });
const content = defineModel<string>("content", { default: "" });
</script>

<template>
  <!-- 直接使用,自动支持双向绑定 -->
  <input v-model="modelValue.name" />
</template>
```

**优势:**

- 自动处理 `modelValue` prop 和 `update:modelValue` 事件
- 减少模板代码,提升可维护性
- 类型安全,支持泛型约束
- 支持多个 v-model(命名模型)

## 最佳实践示例

### 完整组件示例

```vue
<template>
  <div class="form-box" v-if="processedFormList.length > 0">
    <div v-for="item in processedFormList" :key="item.id">
      <el-form-item :label="item.label">
        <el-input v-if="item.type === 'input'" v-model="modelValue[item.key]" :disabled="disabled" />
        <el-select v-else-if="item.type === 'select'" v-model="modelValue[item.key]" :disabled="disabled">
          <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Props 接口定义
interface FormItem {
  id: string;
  key: string;
  label: string;
  type: "input" | "select";
  options?: Array<{ label: string; value: any }>;
}

interface Props {
  formList?: FormItem[];
  disabled?: boolean;
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  formList: () => [],
  disabled: false
});

// 使用 defineModel 实现双向绑定
const modelValue = defineModel<Record<string, any>>({
  default: () => ({})
});

// 计算属性处理数据
const processedFormList = computed(() => {
  return props.formList.map(item => ({
    ...item
    // 添加额外处理逻辑
  }));
});
</script>
```

## 注意事项

1. **TypeScript 支持**:确保在 `<script>` 标签中添加 `lang="ts"` 属性
2. **可选属性**:Props 接口中的属性应标记为可选(`?`),默认值在 `withDefaults` 中设置
3. **类型约束**:尽可能提供具体的类型定义,避免使用 `any`
4. **默认值**:对象和数组的默认值必须使用工厂函数返回
5. **defineModel 版本**:`defineModel` 需要 Vue 3.4.0 或更高版本

## 迁移指南

### 从旧语法迁移到新语法

**步骤 1**: 将 props 定义转换为接口

```typescript
// 旧
defineProps({
  list: { type: Array, default: () => [] }
});

// 新
interface Props {
  list?: any[];
}
withDefaults(defineProps<Props>(), {
  list: () => []
});
```

**步骤 2**: 将 modelValue 转换为 defineModel

```typescript
// 旧
const props = defineProps({ modelValue: Object });
const emit = defineEmits(["update:modelValue"]);

// 新
const modelValue = defineModel<Record<string, any>>();
```

**步骤 3**: 更新模板中的事件绑定

```vue
<!-- 旧 -->
<input :value="modelValue" @input="emit('update:modelValue', $event.target.value)" />

<!-- 新 -->
<input v-model="modelValue" />
```

## UnoCSS 样式规范

### 3. UnoCSS 类名使用规范

在Vue组件中使用UnoCSS时，应遵循以下规范以确保代码的一致性和可维护性。

**核心原则**: 尽量使用 UnoCSS 自带的变量，例如 `h-full`、`p-4`、`rounded-lg`，如果无法实现，则使用 `h-[10px]` 这种任意值语法。

#### 3.1 尺寸类名规范

**❌ 不推荐:**

```vue
<div class="h-[100%] w-[100%]"></div>
```

**✅ 推荐:**

```vue
<div class="h-full w-full"></div>
```

#### 3.2 间距类名规范

**❌ 不推荐:**

```vue
<div class="p-[10px] m-[20px]"></div>
```

**✅ 推荐:**

```vue
<!-- 优先使用标准间距变量 -->
<div class="p-2 m-4"></div>

<!-- 如果标准变量不满足需求，再使用任意值 -->
<div class="p-[10px] m-[20px]"></div>
```

**说明:**

- 优先使用 UnoCSS 预设的间距变量：`p-0`、`p-1`、`p-2`、`p-3`、`p-4`、`p-5`、`p-6`、`p-8`、`p-10`、`p-12`、`p-16`、`p-20`、`p-24`
- 当设计稿中的间距值不在预设列表中时，才使用 `p-[10px]` 这种任意值语法

#### 3.3 颜色类名规范

**❌ 不推荐:**

```vue
<div class="text-[#4a5975] bg-[#ffffff]"></div>
```

**✅ 推荐:**

```vue
<!-- 优先使用标准颜色变量 -->
<div class="text-gray-600 bg-white"></div>

<!-- 如果标准颜色不满足需求，再使用任意值 -->
<div class="text-[#4a5975] bg-[#ffffff]"></div>
```

**说明:**

- 优先使用 UnoCSS 预设的颜色变量：`text-red-500`、`bg-blue-100`、`border-green-300` 等
- 当设计稿中的颜色值不在预设列表中时，才使用 `text-[#4a5975]` 这种任意值语法

#### 3.4 边框类名规范

**❌ 不推荐:**

```vue
<div class="border-[1px] border-solid border-[#0ec69a]"></div>
```

**✅ 推荐:**

```vue
<!-- 优先使用标准边框变量 -->
<div class="border border-solid border-teal-500"></div>

<!-- 如果标准边框不满足需求，再使用任意值 -->
<div class="border-[1px] border-solid border-[#0ec69a]"></div>
```

**说明:**

- 优先使用 UnoCSS 预设的边框变量：`border`、`border-2`、`border-4`、`border-8` 等
- 当设计稿中的边框宽度不在预设列表中时，才使用 `border-[1px]` 这种任意值语法

#### 3.5 圆角类名规范

**❌ 不推荐:**

```vue
<div class="rounded-[6px] rounded-[10px]"></div>
```

**✅ 推荐:**

```vue
<!-- 优先使用标准圆角变量 -->
<div class="rounded-md rounded-lg"></div>

<!-- 如果标准圆角不满足需求，再使用任意值 -->
<div class="rounded-[6px] rounded-[10px]"></div>
```

**说明:**

- 优先使用 UnoCSS 预设的圆角变量：`rounded-none`、`rounded-sm`、`rounded`、`rounded-md`、`rounded-lg`、`rounded-xl`、`rounded-2xl`、`rounded-3xl`、`rounded-full`
- 当设计稿中的圆角值不在预设列表中时，才使用 `rounded-[6px]` 这种任意值语法

#### 3.6 定位类名规范

**❌ 不推荐:**

```vue
<div class="top-[20px] left-[20px] z-[999]"></div>
```

**✅ 推荐:**

```vue
<!-- 优先使用标准定位变量 -->
<div class="top-5 left-5 z-50"></div>

<!-- 如果标准定位不满足需求，再使用任意值 -->
<div class="top-[20px] left-[20px] z-[999]"></div>
```

**说明:**

- 优先使用 UnoCSS 预设的定位变量：`top-0`、`top-1`、`top-2`、`top-3`、`top-4`、`top-5`、`top-6`、`top-8`、`top-10`、`top-12`、`top-16`、`top-20`、`top-24`
- z-index 预设变量：`z-0`、`z-10`、`z-20`、`z-30`、`z-40`、`z-50`、`z-auto`
- 当设计稿中的定位值不在预设列表中时，才使用 `top-[20px]` 这种任意值语法

### 3.7 样式组织规范

在复杂的组件中，建议使用 `@apply` 指令来组织样式，提高可读性：

**✅ 推荐:**

```vue
<template>
  <div class="custom-card">
    <div class="card-header">标题</div>
    <div class="card-content">内容</div>
  </div>
</template>

<style scoped>
.custom-card {
  @apply bg-white rounded-md shadow-md p-4;
}

.card-header {
  @apply text-lg font-bold text-gray-800 mb-2;
}

.card-content {
  @apply text-sm text-gray-600 leading-6;
}
</style>
```

**说明:**

- 在 `@apply` 指令中，同样优先使用 UnoCSS 预设变量
- 只有在预设变量无法满足需求时，才使用任意值语法

### 3.8 响应式设计规范

使用UnoCSS的响应式前缀：

**✅ 推荐:**

```vue
<!-- 优先使用标准响应式断点 -->
<div class="w-full md:w-1/2 lg:w-1/3"></div>

<!-- 复杂布局使用标准栅格系统 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
```

### 3.9 注意事项

1. **优先使用预设变量**: 尽量使用 UnoCSS 自带的变量，例如 `h-full`、`p-4`、`rounded-lg`
2. **谨慎使用任意值**: 只有在预设变量无法实现设计需求时，才使用 `h-[10px]` 这种任意值语法
3. **一致性**: 在整个项目中保持相同的类名命名风格
4. **可读性**: 优先使用语义化的类名组合
5. **性能**: 避免过度使用任意值，优先使用预设的工具类
6. **维护性**: 复杂样式使用 `@apply` 指令集中管理
7. **团队协作**: 遵循团队约定的样式规范

### 3.10 迁移指南

从传统CSS迁移到UnoCSS：

**步骤 1**: 识别可转换的CSS属性

```css
/* 传统CSS */
.container {
  height: 100%;
  width: 100%;
  padding: 10px;
  margin: 20px;
  background-color: #ffffff;
  border-radius: 6px;
}
```

**步骤 2**: 优先转换为UnoCSS预设变量

```vue
<!-- 优先使用预设变量 -->
<div class="h-full w-full p-2 m-4 bg-white rounded-md"></div>

<!-- 如果预设变量不满足需求，再使用任意值 -->
<div class="h-full w-full p-[10px] m-[20px] bg-[#ffffff] rounded-[6px]"></div>
```

**步骤 3**: 复杂样式使用@apply

```vue
<style scoped>
.container {
  @apply h-full w-full p-2 m-4 bg-white rounded-md;
}

/* 如果预设变量不满足需求 */
.container-custom {
  @apply h-full w-full p-[10px] m-[20px] bg-[#ffffff] rounded-[6px];
}
</style>
```

**最佳实践流程:**

1. 首先检查 UnoCSS 预设变量是否满足设计需求
2. 如果满足，直接使用预设变量（如 `p-4`、`rounded-lg`）
3. 如果不满足，再考虑使用任意值语法（如 `p-[10px]`、`rounded-[6px]`）
4. 在团队代码审查中，确保遵循这一优先级原则

## 事件处理规范

### 4. 点击事件命名规范

在Vue组件中，所有点击事件处理函数都应该以 `handle` 开头，以提高代码的可读性和一致性。

**❌ 不推荐:**

```vue
<template>
  <button @click="submitForm">提交</button>
  <button @click="cancel">取消</button>
  <button @click="toggleVisible">切换显示</button>
</template>

<script setup lang="ts">
const submitForm = () => {
  // 提交表单逻辑
};

const cancel = () => {
  // 取消逻辑
};

const toggleVisible = () => {
  // 切换显示逻辑
};
</script>
```

**✅ 推荐:**

```vue
<template>
  <button @click="handleSubmit">提交</button>
  <button @click="handleCancel">取消</button>
  <button @click="handleToggleVisible">切换显示</button>
</template>

<script setup lang="ts">
/** 处理表单提交 */
const handleSubmit = () => {
  // 提交表单逻辑
};

/** 处理取消操作 */
const handleCancel = () => {
  // 取消逻辑
};

/** 处理显示状态切换 */
const handleToggleVisible = () => {
  // 切换显示逻辑
};
</script>
```

**优势:**

- 提高代码可读性，一眼就能识别出这是事件处理函数
- 统一命名规范，便于团队协作和代码维护
- 避免与普通函数命名混淆
- 在IDE中更容易通过搜索找到所有事件处理函数

**命名建议:**

- 点击事件：`handleClick`、`handleSubmit`、`handleDelete`
- 切换事件：`handleToggle`、`handleSwitch`
- 选择事件：`handleSelect`、`handleChoose`
- 其他事件：`handleInputChange`、`handleScroll`

**注意事项:**

1. **一致性**: 整个项目中所有点击事件处理函数都应遵循此规范
2. **语义化**: 函数名应清楚表达事件处理的具体行为
3. **简洁性**: 在保持语义清晰的前提下，函数名尽量简洁
4. **扩展性**: 对于复杂的事件处理，可以适当增加描述性词汇，如 `handleFormSubmit`、`handleDataLoad`

**迁移指南:**

**步骤 1**: 识别现有代码中的事件处理函数

```vue
<!-- 旧代码 -->
<template>
  <button @click="saveData">保存</button>
</template>

<script setup lang="ts">
const saveData = () => {
  // 保存逻辑
};
</script>
```

**步骤 2**: 重命名事件处理函数

```vue
<!-- 新代码 -->
<template>
  <button @click="handleSaveData">保存</button>
</template>

<script setup lang="ts">
const handleSaveData = () => {
  // 保存逻辑
};
</script>
```

**步骤 3**: 更新所有相关的引用

确保在模板、计算属性、其他函数中所有对该函数的引用都更新为新的名称。

## TypeScript 使用规范

### 5. TypeScript 类型定义规范

在 Vue 组件中使用 TypeScript 时，应遵循以下类型定义规范，以确保代码的类型安全性和可维护性。

#### 5.1 接口定义规范

**❌ 不推荐:**

```typescript
// 使用 any 类型
const formData = ref<any>({});

// 类型定义不明确
interface User {
  name: string;
  age: any;
  data: Object;
}
```

**✅ 推荐:**

```typescript
// 明确定义类型
interface FormField {
  id: string;
  label: string;
  value: string | number;
  required?: boolean;
}

const formData = ref<Record<string, FormField>>({});

// 明确的类型定义
interface User {
  name: string;
  age: number;
  data: {
    address: string;
    phone: string;
  };
}
```

#### 5.2 Props 类型定义规范

**❌ 不推荐:**

```typescript
// 使用 any 类型
defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  }
});

// 类型定义不完整
interface Props {
  userList: any[];
  config: Object;
}
```

**✅ 推荐:**

```typescript
// 明确定义数组元素类型
interface User {
  id: string;
  name: string;
  email: string;
}

interface Config {
  theme: "light" | "dark";
  language: "zh" | "en";
}

interface Props {
  userList?: User[];
  config?: Config;
}

const props = withDefaults(defineProps<Props>(), {
  userList: () => [],
  config: () => ({
    theme: "light",
    language: "zh"
  })
});
```

#### 5.3 事件处理函数类型定义

**❌ 不推荐:**

```typescript
// 缺少参数类型
const handleInputChange = event => {
  console.log(event.target.value);
};

// 使用 any 类型
const handleSubmit = async (data: any) => {
  // 处理提交逻辑
};
```

**✅ 推荐:**

```typescript
// 明确定义事件类型
/** 处理输入变化事件 */
const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  console.log(target.value);
};

// 定义自定义数据类型
interface SubmitData {
  name: string;
  email: string;
  phone: string;
}

/** 处理表单数据提交 */
const handleSubmit = async (data: SubmitData) => {
  // 处理提交逻辑
};
```

#### 5.4 API 响应类型定义

**❌ 不推荐:**

```typescript
// 使用 any 类型
const fetchData = async () => {
  const response = await api.getData();
  const data: any = response.data;
  return data;
};
```

**✅ 推荐:**

```typescript
// 定义 API 响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

/** 获取用户数据 */
const fetchData = async (): Promise<UserInfo> => {
  const response = (await api.getData()) as ApiResponse<UserInfo>;
  return response.data;
};
```

#### 5.5 组件内接口调用封装规范

在 Vue 组件中调用 API 接口时，应遵循统一的封装规范，确保代码的一致性和可维护性。

**命名规范:**

- 函数名以 `axios` 开头，后跟接口名称（首字母大写）
- 例如：`axiosGetRoleListApi`、`axiosPostUserApi`、`axiosDeleteOrderApi`

**封装规范:**

1. 使用 `try...catch` 包裹接口调用
2. 在 `try` 中判断 `result.code === 0` 确认接口成功
3. 在 `catch` 中输出方法名称 + 错误信息

**❌ 不推荐:**

```typescript
// 命名不规范，缺少错误处理
const fetchRoleList = async () => {
  const res = await getRoleListApi();
  roleOptions.value = res.data?.list ?? [];
};

// 没有判断返回码
const getRoles = async () => {
  try {
    const res = await getRoleListApi();
    roleOptions.value = res.data?.list ?? [];
  } catch (error) {
    console.error(error);
  }
};
```

**✅ 推荐:**

```typescript
import type { Role } from "@/api/interface/modules";
import { getRoleListApi } from "@/api/modules/role";

const roleOptions = ref<Role.IRoleVo[]>([]);

/** 获取角色列表 */
const axiosGetRoleListApi = async (): Promise<void> => {
  try {
    const result = await getRoleListApi();

    if (result.code === 0) {
      roleOptions.value = result.data?.list ?? [];
    }
  } catch (error) {
    console.error("axiosGetRoleListApi:", error);
  }
};
```

**多参数示例:**

```typescript
import type { User } from "@/api/interface/modules";
import { getUserListApi } from "@/api/modules/user";

const userList = ref<User.IUserVo[]>([]);

/** 获取用户列表 */
const axiosGetUserListApi = async (params: User.ReqGetUserListApi): Promise<void> => {
  try {
    const result = await getUserListApi(params);

    if (result.code === 0) {
      userList.value = result.data?.list ?? [];
    }
  } catch (error) {
    console.error("axiosGetUserListApi:", error);
  }
};

// 调用示例
await axiosGetUserListApi({ page: 1, page_size: 20 });
```

**带返回值示例:**

```typescript
/** 添加用户 */
const axiosPostUserApi = async (params: User.ReqAddUserApi): Promise<boolean> => {
  try {
    const result = await postUserApi(params);

    if (result.code === 0) {
      ElMessage.success("添加成功");
      return true;
    }
    return false;
  } catch (error) {
    console.error("axiosPostUserApi:", error);
    return false;
  }
};
```

**优势:**

- 统一的命名规范，便于识别接口调用函数
- 完善的错误处理机制
- 明确的成功判断逻辑
- 便于调试和问题定位

#### 5.6 类型导出规范

**❌ 不推荐:**

```typescript
// 类型定义分散在各个文件中，难以复用
// 在组件A中
interface User {
  id: string;
  name: string;
}

// 在组件B中
interface User {
  id: string;
  name: string;
  email: string; // 字段不一致
}
```

**✅ 推荐:**

```typescript
// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

// 在组件中使用
import type { User } from "@/types/user";

const userList = ref<User[]>([]);
```

**优势:**

- 提高代码的类型安全性，减少运行时错误
- 增强代码的可读性和可维护性
- IDE 支持更好，提供更准确的自动补全和错误提示
- 便于团队协作，统一类型定义
- 重构更安全，类型检查会在编译时发现问题

**注意事项:**

1. **避免使用 any**: 尽量避免使用 `any` 类型，可以使用 `unknown` 作为替代
2. **类型完整性**: 确保接口定义完整，包含所有必要的字段
3. **可选字段**: 使用 `?` 标记可选字段，在 `withDefaults` 中设置默认值
4. **类型复用**: 将常用类型定义导出，在多处复用
5. **泛型使用**: 合理使用泛型，提高代码的灵活性

## 组件命名规范

### 6. 组件命名和组织规范

在 Vue 项目中，组件的命名和组织方式对代码的可维护性至关重要。

#### 6.1 组件文件命名

**❌ 不推荐:**

```
userlist.vue
UserProfile.vue
form-component.vue
button.vue
```

**✅ 推荐:**

```
UserList.vue
UserProfileCard.vue
BaseForm.vue
BaseButton.vue
```

**命名规则:**

1. 使用 PascalCase（大驼峰）命名法
2. 基础组件以 `Base` 开头，如 `BaseButton.vue`
3. 单例组件以 `The` 开头，如 `TheHeader.vue`
4. 业务组件根据功能命名，如 `UserList.vue`

#### 6.2 组件注册命名

**❌ 不推荐:**

```vue
<template>
  <userlist />
  <user-profile />
  <base-button />
</template>

<script setup>
import userlist from "./UserList.vue";
import userProfile from "./UserProfile.vue";
import BaseButton from "./BaseButton.vue";
</script>
```

**✅ 推荐:**

```vue
<template>
  <UserList />
  <UserProfileCard />
  <BaseButton />
</template>

<script setup>
import UserList from "./UserList.vue";
import UserProfileCard from "./UserProfileCard.vue";
import BaseButton from "./BaseButton.vue";
</script>
```

#### 6.3 组件目录结构

**❌ 不推荐:**

```
src/
├── components/
│   ├── UserList.vue
│   ├── UserProfile.vue
│   ├── Button.vue
│   ├── Form.vue
│   └── Modal.vue
```

**✅ 推荐:**

```
src/
├── components/
│   ├── base/           # 基础组件
│   │   ├── BaseButton/
│   │   │   ├── index.vue
│   │   │   └── BaseButton.vue
│   │   ├── BaseForm/
│   │   │   ├── index.vue
│   │   │   └── BaseForm.vue
│   │   └── BaseModal/
│   │       ├── index.vue
│   │       └── BaseModal.vue
│   ├── business/       # 业务组件
│   │   ├── UserList/
│   │   │   ├── index.vue
│   │   │   ├── UserList.vue
│   │   │   └── components/
│   │   │       ├── UserItem.vue
│   │   │       └── UserFilter.vue
│   │   └── UserProfile/
│   │       ├── index.vue
│   │       └── UserProfile.vue
│   └── layout/         # 布局组件
│       ├── TheHeader/
│       │   ├── index.vue
│       │   └── TheHeader.vue
│       └── TheSidebar/
│           ├── index.vue
│           └── TheSidebar.vue
```

**目录结构说明:**

1. **base/**: 存放基础组件，如按钮、表单、模态框等
2. **business/**: 存放业务相关组件，如用户列表、产品卡片等
3. **layout/**: 存放布局相关组件，如头部、侧边栏等
4. 每个组件都有自己的文件夹，包含 `index.vue` 和组件文件

#### 6.4 组件 Props 命名

**❌ 不推荐:**

```typescript
interface Props {
  user_data: any[];
  isloading: boolean;
  maxcount: number;
}
```

**✅ 推荐:**

```typescript
interface Props {
  userData: User[];
  isLoading: boolean;
  maxCount: number;
}
```

**Props 命名规则:**

1. 使用 camelCase（小驼峰）命名法
2. 布尔值属性以 `is`、`has`、`can` 等前缀开头
3. 避免使用缩写，使用完整的单词

#### 6.5 组件事件命名

**❌ 不推荐:**

```vue
<template>
  <button @click="$emit('click')">点击</button>
  <input @input="$emit('input-change', $event.target.value)" />
</template>
```

**✅ 推荐:**

```vue
<template>
  <button @click="handleClick">点击</button>
  <input @input="handleInputChange" />
</template>

<script setup>
const emit = defineEmits<{
  click: [];
  'input-change': [value: string];
}>();

/** 处理点击事件 */
const handleClick = () => {
  emit('click');
};

/** 处理输入变化事件 */
const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('input-change', target.value);
};
</script>
```

**事件命名规则:**

1. 使用 kebab-case（短横线）命名法
2. 事件名应该描述发生了什么，而不是如何处理
3. 提供明确的类型定义

**优势:**

- 提高代码的可读性和可维护性
- 统一的命名规范便于团队协作
- 清晰的目录结构便于查找和维护组件
- 类型安全的事件定义减少错误

**注意事项:**

1. **一致性**: 整个项目中保持相同的命名规范
2. **语义化**: 组件名应该清楚表达其功能和用途
3. **可复用性**: 基础组件应该设计为高度可复用
4. **类型安全**: 使用 TypeScript 提供完整的类型定义

## Element Plus 组件使用规范

### 7. el-dialog 宽度规范

在使用 Element Plus 的 `el-dialog` 组件时，应遵循统一的宽度规范，以确保界面的一致性和用户体验。

**核心原则**: el-dialog 的宽度只能使用以下四种预设尺寸：`480px`、`640px`、`760px`、`1120px`。

#### 7.1 宽度选择指南

**迷你尺寸对话框 (480px)**

适用场景：

- 极简的确认/提示对话框
- 单字段表单（如命令下发、状态切换）
- 仅包含一个选择器或输入框的操作

**✅ 推荐:**

```vue
<el-dialog title="下发命令" width="480px">
  <el-select v-model="commandCode" placeholder="请选择命令类型">
    <el-option label="同步二维码" value="SYNC_QR_CODE" />
  </el-select>
</el-dialog>
```

**小尺寸对话框 (640px)**

适用场景：

- 简单的确认/提示对话框
- 单字段或少量字段的表单（1-3个字段）
- 简短的信息展示

**❌ 不推荐:**

```vue
<el-dialog title="提示" width="500px">
  <p>确认删除此项吗?</p>
</el-dialog>
```

**✅ 推荐:**

```vue
<el-dialog title="提示" width="640px">
  <p>确认删除此项吗?</p>
</el-dialog>
```

**中等尺寸对话框 (760px)**

适用场景：

- 中等复杂度的表单（4-8个字段）
- 包含少量数据展示的对话框
- 需要左右布局的表单

**✅ 推荐:**

```vue
<el-dialog title="编辑用户" width="760px">
  <el-form :model="form">
    <el-form-item label="用户名">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="form.email" />
    </el-form-item>
    <!-- 更多表单项 -->
  </el-form>
</el-dialog>
```

**大尺寸对话框 (1120px)**

适用场景：

- 复杂的表单（8个以上字段）
- 包含表格或列表的对话框
- 需要展示大量信息的详情页
- 包含多个分栏或复杂布局的对话框

**✅ 推荐:**

```vue
<el-dialog title="详细信息" width="1120px">
  <el-tabs>
    <el-tab-pane label="基本信息">
      <!-- 复杂表单内容 -->
    </el-tab-pane>
    <el-tab-pane label="详细数据">
      <el-table :data="tableData">
        <!-- 表格列定义 -->
      </el-table>
    </el-tab-pane>
  </el-tabs>
</el-dialog>
```

#### 7.2 错误示例

**❌ 不推荐的宽度值:**

```vue
<!-- 使用非标准宽度 -->
<el-dialog width="600px">...</el-dialog>
<el-dialog width="50%">...</el-dialog>
<el-dialog width="800px">...</el-dialog>
<el-dialog width="1000px">...</el-dialog>

<!-- 使用百分比或其他单位 -->
<el-dialog width="60vw">...</el-dialog>
<el-dialog width="auto">...</el-dialog>
```

#### 7.3 响应式处理

对于需要响应式适配的场景，可以使用计算属性动态设置宽度，但仍需遵循三种预设尺寸：

**✅ 推荐:**

```vue
<template>
  <el-dialog :width="dialogWidth">
    <!-- 对话框内容 -->
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();

/** 根据屏幕宽度动态设置对话框宽度 */
const dialogWidth = computed(() => {
  if (width.value < 768) {
    return "640px"; // 移动端使用小尺寸
  } else if (width.value < 1200) {
    return "760px"; // 平板使用中等尺寸
  } else {
    return "1120px"; // 桌面端使用大尺寸
  }
});
</script>
```

#### 7.4 优势

- **一致性**: 统一的宽度规范确保整个应用的视觉一致性
- **可维护性**: 减少宽度选择的随意性，便于代码审查和维护
- **用户体验**: 标准化的尺寸提供更好的用户体验
- **设计协同**: 便于设计师和开发者之间的沟通

#### 7.5 注意事项

1. **严格遵守**: 所有 el-dialog 必须使用三种预设宽度之一
2. **场景匹配**: 根据对话框内容复杂度选择合适的宽度
3. **避免嵌套**: 避免在对话框中嵌套对话框，如必须嵌套，内层对话框应使用更小的尺寸
4. **移动端适配**: 在移动端可以考虑使用 `fullscreen` 属性而不是固定宽度

#### 7.6 迁移指南

**步骤 1**: 识别现有代码中的 el-dialog

```bash
# 使用 grep 查找所有 el-dialog
grep -r "el-dialog" src/
```

**步骤 2**: 检查并修改宽度属性

```vue
<!-- 旧代码 -->
<el-dialog width="700px">...</el-dialog>

<!-- 新代码 - 根据内容选择合适的预设宽度 -->
<el-dialog width="760px">...</el-dialog>
```

**步骤 3**: 代码审查

在代码审查中，确保所有新增或修改的 el-dialog 都遵循此规范。
