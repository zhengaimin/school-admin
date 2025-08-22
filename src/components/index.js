// import Vue from "vue";
import { CommonForm } from "./CommonForm/index.vue";

// export default {
//   install(Vue) {
//     Vue.component("CommonForm", CommonForm);
//   }
// };

export default {
  install(app) {
    app.component("CommonForm", CommonForm);
  }
};
