import { defineStore } from "pinia";
import { generatePrefix } from "@/stores/helper/prefix";

const id = generatePrefix("carbon");

interface CarbonState {
  carbonRow: Record<string, unknown>;
}

export const carbonStore = defineStore(id, {
  state: (): CarbonState => ({
    carbonRow: {}
  }),
  getters: {},
  actions: {
    setCarbonRow(carbonRow: Record<string, unknown>) {
      this.carbonRow = carbonRow;
    }
  }
});
