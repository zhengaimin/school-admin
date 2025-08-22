import { defineStore } from "pinia";

export const carbonStore = defineStore({
  id: "carbon-list",
  state() {
    return {
      carbonRow: {}
    };
  },
  getters: {},
  actions: {
    setCarbonRow(carbonRow) {
      this.carbonRow = carbonRow;
    }
  }
});
