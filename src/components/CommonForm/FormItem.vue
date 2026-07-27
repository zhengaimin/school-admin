<template>
  <el-form-item :label="config.label" :prop="config.model" :rules="config.rules">
    <el-input
      v-if="config.type === 'input'"
      v-model="value"
      :type="config.valueType"
      :placeholder="config.placeholder"
      :maxlength="config.maxlength"
      clearable
    ></el-input>
    <el-input-number
      style="width: 100%"
      v-else-if="config.type === 'num_input'"
      v-model="value"
      :placeholder="config.placeholder"
      :min="config.min"
      :max="config.max"
    />
    <el-rate v-else-if="config.type == 'rate'" v-model="value" />
    <el-slider v-else-if="config.type === 'slider'" v-model="value" />
    <el-select
      v-else-if="config.type == 'select'"
      :disabled="config.disabled"
      v-model="value"
      :placeholder="config.placeholder"
      style="width: 100%"
      :multiple="config.multiple"
      clearable
    >
      <el-option v-for="(option, index) in config.options" :key="index" :label="option.label" :value="option.value"></el-option>
    </el-select>
    <el-date-picker
      v-else-if="config.type === 'date'"
      style="width: 100%"
      v-model="value"
      type="date"
      :placeholder="config.placeholder"
    />
    <el-date-picker
      v-else-if="config.type === 'datetime'"
      style="width: 100%"
      v-model="value"
      type="datetime"
      :placeholder="config.placeholder"
    />
    <el-radio-group v-else-if="config.type === 'radio'" v-model="value" class="ml-4">
      <el-radio :label="option.value" v-for="(option, index) in config.options" :key="index">{{ option.label }}</el-radio>
    </el-radio-group>
    <el-checkbox-group v-model="value" v-else-if="config.type === 'checkbox'">
      <el-checkbox v-for="v in config.options" :key="v.value" :label="v.value" :value="v.value">{{ v.label }}</el-checkbox>
    </el-checkbox-group>
    <el-input
      v-else-if="config.type === 'textarea'"
      v-model="value"
      :autosize="{
        minRows: config.minRows ? config.minRows : 3,
        maxRows: config.maxRows ? config.maxRows : 20
      }"
      type="textarea"
      show-word-limit
      :maxlength="config.maxlength ? config.maxlength : 5000"
      :placeholder="config.placeholder"
    />
    <el-upload
      v-else-if="config.type === 'file'"
      v-model:file-list="value"
      class="upload-demo"
      :action="config.action"
      multiple
      :limit="config.limit ? config.limit : 1"
      :on-exceed="handleExceed"
    >
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
      </template>
    </el-upload>
  </el-form-item>
</template>
<script>
export default {
  props: {
    modelValue: {
      type: null
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      }
    }
  }
};
</script>
