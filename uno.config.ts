import { defineConfig, presetAttributify, presetUno, transformerDirectives, transformerVariantGroup } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // 项目已有 reset 样式，为避免全局样式冲突默认关闭（需要的话可改为 true）
  preflights: false
});
