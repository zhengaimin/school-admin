import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "geeker-user",
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
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    setSchoolMsg(schoolMsg: UserState["schoolMsg"]) {
      this.schoolMsg = schoolMsg;
    },
    setCount(count: UserState["count"]) {
      this.count = count;
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
