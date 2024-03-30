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
          <q-btn class="flex-1" label="注册" @click="register();" color="primary" />
          <q-btn class="flex-1" label="登录" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import store from 'boot/store';
import { useDialogPluginComponent, useQuasar } from 'quasar';

const { onDialogOK, dialogRef, onDialogHide } = useDialogPluginComponent();
import CaptchaDialog from 'components/CaptchaDialog.vue';
import { api } from 'boot/axios';

const $q = useQuasar();
const isPwd = ref(true);
const password = ref('');
const username = ref('');

defineEmits([
  ...useDialogPluginComponent.emits
]);

store.token = '';

async function login() {
  $q.loading.show();
  let params = new URLSearchParams();
  params.append('grant_type', '');
  params.append('username', username.value);
  params.append('password', password.value);
  params.append('scope', '');
  params.append('client_id', '');
  params.append('client_secret', '');

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
      console.log(err);
      $q.notify({
        type: 'negative',
        message: '好好想想 你是不是记忆错乱了'
      });
      $q.loading.hide();
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
        type: 'email'
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
      }).then(() => {
        login();
      }).catch((err) => {
        console.log(err);
        $q.notify({
          type: 'negative',
          message: '机器人不得入内'
        });
      });
    });
  });
}
</script>
