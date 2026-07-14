import { defineStore } from "pinia";
import { KeepAliveState } from "@/stores/interface";
import { generatePrefix } from "@/stores/helper/prefix";

const id = generatePrefix("keepAlive");

export const useKeepAliveStore = defineStore(id, {
  state: (): KeepAliveState => ({
    keepAliveName: []
  }),
  actions: {
    // Add KeepAliveName
    async addKeepAliveName(name: string) {
      if (!this.keepAliveName.includes(name)) this.keepAliveName.push(name);
    },
    // Remove KeepAliveName
    async removeKeepAliveName(name: string) {
      this.keepAliveName = this.keepAliveName.filter(item => item !== name);
    },
    // Set KeepAliveName
    async setKeepAliveName(keepAliveName: string[] = []) {
      this.keepAliveName = keepAliveName;
    }
  }
});
