import { defineStore } from "pinia";

export const formConfigStore = defineStore({
  id: "form-list",
  state() {
    return {
      configObj: {},
      logoForm: {}
    };
  },
  getters: {},
  actions: {
    setConfigObj(configObj) {
      this.configObj = configObj;
    },
    setLogoObj(logoForm) {
      this.logoForm = logoForm;
    }
  }
});
