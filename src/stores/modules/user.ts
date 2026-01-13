import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";
import { generatePrefix } from "@/stores/helper/prefix";

const id = generatePrefix("user");

export const useUserStore = defineStore(id, {
  state: (): UserState => ({
    token: "",
    userInfo: { name: "" },
    permissions: [],
    moduleKeys: [],
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
    // Set permissions
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },
    // Set moduleKeys
    setModuleKeys(moduleKeys: string[]) {
      this.moduleKeys = moduleKeys;
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
