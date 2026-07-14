import { defineStore } from "pinia";
import type { TUserInfo, UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";
import { generatePrefix } from "@/stores/helper/prefix";

const id = generatePrefix("user");

export const useUserStore = defineStore(id, {
  state: (): UserState => ({
    token: "",
    userInfo: { name: "" },
    schoolMsg: { schoolId: "", schoolName: "" },
    count: 0
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: TUserInfo) {
      this.userInfo = userInfo;
    },
    setSchoolMsg(schoolMsg: UserState["schoolMsg"]) {
      this.schoolMsg = schoolMsg;
    },
    setCount(count: UserState["count"]) {
      this.count = count;
    }
  },
  persist: piniaPersistConfig(id)
});
