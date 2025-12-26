import { computed } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";

export const ALL_SCHOOLS_ID = "-1";

export function useSchool() {
  const userStore = useUserStore();
  const { schoolMsg } = storeToRefs(userStore);

  const schoolId = computed(() => schoolMsg.value.schoolId);
  const schoolName = computed(() => schoolMsg.value.schoolName);
  const isAllSchools = computed(() => schoolMsg.value.schoolId === ALL_SCHOOLS_ID);
  const hasSchool = computed(() => {
    const id = schoolMsg.value.schoolId;
    return !!id && id !== ALL_SCHOOLS_ID;
  });

  const setSchoolMsg = (schoolId: string, schoolName: string) => {
    userStore.setSchoolMsg({ schoolId, schoolName });
  };

  const guardSchool = (): boolean => {
    if (!hasSchool.value) {
      ElMessage.warning("请选择学校后再操作");
      return false;
    }
    return true;
  };

  return { schoolMsg, schoolId, schoolName, isAllSchools, hasSchool, setSchoolMsg, guardSchool };
}
