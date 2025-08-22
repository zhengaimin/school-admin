<template>
  <div style="border: 1px solid #cccccc">
    <Toolbar style="border-bottom: 1px solid #cccccc" :editor="editor" :default-config="toolbarConfig" :mode="mode" />
    <Editor
      style="height: 400px; overflow-y: hidden"
      v-model="html"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="onCreated"
      @on-change="onChange"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { img_upload } from "@/api/modules/common";
export default {
  components: { Editor, Toolbar },
  emits: ["changeHtml"],
  data() {
    return {
      editor: null,
      html: "",
      toolbarConfig: {},
      editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {
          fontSize: {
            fontSizeList: ["12px", "13px", "14px", "15px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "30px"]
          },
          lineHeight: {
            lineHeightList: ["0.8", "1", "1.5", "2", "2.5", "3"]
          },
          // 这种方式上传的就是base64
          // uploadImage: {
          //   base64LimitSize: 10 * 1024 * 1024, //最大为10M
          // },
          uploadImage: {
            customUpload: this.uploadImg,
            // server: "/api/htsc/file_hub/common/img_upload",
            timeout: 5 * 1000, // 5s
            headers: { Accept: "text/x-json" },
            maxFileSize: 10 * 1024 * 1024, // 10M
            base64LimitSize: 5 * 1024 // insert base64 format, if file's size less than 5kb
          },
          // uploadVideo:{
          //   customUpload: this.uploadVideo,
          // }
          color: {
            colors: [
              "rgb(0, 0, 0)",
              "rgb(38, 38, 38)",
              "rgb(89, 89, 89)",
              "rgb(140, 140, 140)",
              "rgb(191, 191, 191)",
              "rgb(217, 217, 217)",
              "rgb(233, 233, 233)",
              "rgb(245, 245, 245)",
              "rgb(250, 250, 250)",
              "rgb(255, 255, 255)",
              "rgb(225, 60, 57)",
              "rgb(231, 95, 51)",
              "rgb(235, 144, 58)",
              "rgb(245, 219, 77)",
              "rgb(114, 192, 64)",
              "rgb(89, 191, 192)",
              "rgb(66, 144, 247)",
              "rgb(54, 88, 226)",
              "rgb(106, 57, 201)",
              "rgb(216, 68, 147)",
              "rgb(251, 233, 230)",
              "rgb(252, 237, 225)",
              "rgb(252, 239, 212)",
              "rgb(252, 251, 207)",
              "rgb(231, 246, 213)",
              "rgb(218, 244, 240)",
              "rgb(217, 237, 250)",
              "rgb(224, 232, 250)",
              "rgb(237, 225, 248)",
              "rgb(246, 226, 234)",
              "rgb(255, 163, 158)",
              "rgb(255, 187, 150)",
              "rgb(255, 213, 145)",
              "rgb(255, 251, 143)",
              "rgb(183, 235, 143)",
              "rgb(135, 232, 222)",
              "rgb(145, 213, 255)",
              "rgb(173, 198, 255)",
              "rgb(211, 173, 247)",
              "rgb(255, 173, 210)",
              "rgb(255, 77, 79)",
              "rgb(255, 122, 69)",
              "rgb(255, 169, 64)",
              "rgb(255, 236, 61)",
              "rgb(115, 209, 61)",
              "rgb(54, 207, 201)",
              "rgb(64, 169, 255)",
              "rgb(89, 126, 247)",
              "rgb(146, 84, 222)",
              "rgb(247, 89, 171)",
              "rgb(207, 19, 34)",
              "rgb(212, 56, 13)",
              "rgb(212, 107, 8)",
              "rgb(212, 177, 6)",
              "rgb(56, 158, 13)",
              "rgb(8, 151, 156)",
              "rgb(9, 109, 217)",
              "rgb(29, 57, 196)",
              "rgb(83, 29, 171)",
              "rgb(196, 29, 127)",
              "rgb(130, 0, 20)",
              "rgb(135, 20, 0)",
              "rgb(135, 56, 0)",
              "rgb(97, 71, 0)",
              "rgb(19, 82, 0)",
              "rgb(0, 71, 79)",
              "rgb(0, 58, 140)",
              "rgb(6, 17, 120)",
              "rgb(34, 7, 94)",
              "rgb(120, 6, 80)",

              "#1F304C",
              "#4A5975",
              "#8894B3"
            ]
          }
        }
      },
      mode: "default" // or 'simple'
    };
  },
  computed: {
    user_id() {
      return JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).id : "";
    }
  },
  mounted() {
    this.toolbarConfig.excludeKeys = ["group-video", "insertTable", "codeBlock"]; //隐藏不需要的工具项
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    onChange() {
      this.$emit("changeHtml", this.editor.getHtml());
    },
    uploadImg(file, insertFn) {
      let imgData = new FormData();
      imgData.append("file", file);
      imgData.append("is_common", 1);
      //调用上传图片接口，上传图片
      img_upload(imgData).then(res => {
        insertFn(res.data.file_path);
      });
    },
    uploadVideo(file, insertFn) {
      let imgData = new FormData();
      imgData.append("file", file);
      imgData.append("is_common", 1);
      //调用上传图片接口，上传图片
      img_upload(imgData).then(res => {
        insertFn(res.data.file_path);
      });
    }
  },
  destroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  }
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.w-e-text-placeholder {
  top: 9px;
}
</style>
