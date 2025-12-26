import { defineStore } from "pinia";
import { generatePrefix } from "@/stores/helper/prefix";

const id = generatePrefix("form");

interface FormConfigState {
  configObj: Record<string, unknown>;
  logoForm: Record<string, unknown>;
}

export const formConfigStore = defineStore(id, {
  state: (): FormConfigState => ({
    configObj: {},
    logoForm: {}
  }),
  getters: {},
  actions: {
    setConfigObj(configObj: Record<string, unknown>) {
      this.configObj = configObj;
    },
    setLogoObj(logoForm: Record<string, unknown>) {
      this.logoForm = logoForm;
    }
  }
});
