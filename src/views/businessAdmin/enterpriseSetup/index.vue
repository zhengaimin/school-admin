<template>
  <div class="outer-box">
    <div class="left-box">
      <h1>企业信息</h1>
      <div>
        <ProForm :options="options"></ProForm>
      </div>
    </div>
    <div class="right-box">sd</div>
  </div>
</template>
<script>
import ProForm from "@/views/form/proForm/index1.vue";
export default {
  components: { ProForm },
  data() {
    return {
      options: {
        form: {
          inline: false,
          labelPosition: "top",
          labelWidth: "80px",
          size: "default",
          disabled: false,
          labelSuffix: ""
        },
        columns: [
          {
            formItem: {
              label: "企业名称",
              prop: "username",
              // labelWidth: "80px",
              required: true
            },
            attrs: {
              typeName: "input",
              clearable: true,
              placeholder: "请输入用户名",
              disabled: true,
              style: "width:500px"
            }
          },
          {
            formItem: {
              label: "企业信用代码",
              prop: "password",
              class: "data",
              required: true
            },
            attrs: {
              typeName: "input",
              clearable: true,
              autofocus: true,
              placeholder: "请输入密码",
              type: "password",
              style: "width:500px"
            }
          },
          {
            formItem: {
              label: "企业所在地",
              prop: "email",
              required: true
            },
            attrs: {
              typeName: "input",
              placeholder: "请输入邮箱",
              clearable: true,
              style: "width:500px"
            }
          },
          {
            formItem: {
              label: "企业所属行业",
              prop: "gender",
              required: true
            },
            attrs: {
              typeName: "select",
              placeholder: "请选择",
              options: [
                {
                  label: 1212,
                  value: 1
                }
              ],
              clearable: true,
              style: "width:500px"
            },
            children: [
              {
                label: "男",
                value: 1,
                type: "option"
              },
              {
                label: "女",
                value: 2,
                type: "option"
              }
            ]
          }
        ]
      }
    };
  },
  methods: {
    getForm(form) {
      console.log(form);
    }
  }
};
</script>
<style scoped lang="scss">
@import "./index";
</style>
