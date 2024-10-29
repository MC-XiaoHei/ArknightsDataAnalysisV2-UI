<template>
  <q-dialog persistent ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-form @submit="login">
        <q-card-section>
          <div class="text-h6">登入到 Arknights Data Analysis</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input class="q-pb-sm" v-model="username" outlined label="用户名" />
          <q-input outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="密码">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>

        <div class="mt-[-16px] flex justify-end q-pa-md w-full space-x-4">
          <q-btn class="flex-1" label="注册" @click="register();" color="primary" :disable="!isFormValid" />
          <q-btn class="flex-1" label="登录" type="submit" color="primary" :disable="!isFormValid" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import store from 'boot/store';
import { useDialogPluginComponent, useQuasar } from 'quasar';

const { onDialogOK, dialogRef, onDialogHide } = useDialogPluginComponent();
import CaptchaDialog from 'components/CaptchaDialog.vue';
import { api } from 'boot/axios';

const $q = useQuasar();
const isPwd = ref(true);
const password = ref('');
const username = ref('');

const isFormValid = computed(() => {
  return username.value.trim() !== '' && password.value.trim() !== '';
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

store.token = '';

async function login() {
  $q.loading.show();
  let params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username.value);
  params.append('password', password.value);

  let config = {
    method: 'post',
    url: '/users/login_password',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: params
  };
  api(config)
    .then((res) => {
      store.token = res.data['access_token'];
      store.username = username.value;
      $q.loading.hide();
      dialogRef.value?.hide();
      $q.notify({
        type: 'positive',
        message: '登录成功'
      });
      onDialogOK();
    })
    .catch((err) => {
      let errMessage = '登陆时发生未知错误';
      try {
        switch (err.response.data.detail) {
          case 'user.login.password_error':
          case 'user.login.username_error':
            errMessage = '好好想想 你是不是记忆错乱了';
            break;
          case 'user.login.disabled':
            errMessage = '此账号禁用中 请完成邮箱验证或者联系管理员';
            break;
        }
      } catch (err1) {
        console.log(err);
      } finally {
        $q.notify({
          type: 'negative',
          message: errMessage
        });
        $q.loading.hide();
      }
    });
}

async function register() {
  $q.dialog({
    component: CaptchaDialog,
    componentProps: {}
  }).onOk(captchaData => {
    $q.dialog({
      title: '你好 给下邮箱',
      message: '',
      prompt: {
        model: '',
        type: 'email',
        rules: [(val) => !!val || '邮箱不能为空', (val) => /.+@.+\..+/.test(val) || '邮箱格式不正确'],
        isValid: val => /.+@.+\..+/.test(val)
      },
      persistent: true
    }).onOk(email => {
      api.post('/users/register', {
        data: {
          username: username.value,
          password: password.value,
          email: email
        },
        captcha: captchaData
      }).then((res) => {
        if (res.data.disabled) {
          $q.notify({
            type: 'positive',
            message: '账号注册成功 但你需要完成邮箱验证才可登录'
          });
        } else {
          login();
        }
      }).catch((err) => {
        let errMessage = '注册时发生未知错误';
        try {
          switch (err.response.data.detail) {
            case 'user.register.user_exist':
              errMessage = '你真的没注册过吗';
              break;
          }
        } catch (err1) {
          console.log(err);
        } finally {
          $q.notify({
            type: 'negative',
            message: errMessage
          });
          $q.loading.hide();
        }
      });
    });
  });
}
</script>
