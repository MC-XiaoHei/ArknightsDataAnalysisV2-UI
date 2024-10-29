<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="w-[320px]">

      <q-img :src="imgData" />
      <q-item-section class="text-h5 q-pa-md">
        <q-item-label class="text-gray-900">
          你好 证明下你是人
          <q-item-label class="text-body2 text-primary" @click="getNewCaptcha();">巧了 我不是人 看不懂 换一个</q-item-label>
        </q-item-label>
        <q-input autofocus :debounce="0" v-model:model-value="captchaInfo.code" label="验证码" class="q-pb-sm" />
        <q-btn flat rounded label="确定" @click="submit" :disable="captchaInfo.code.length !== 4" />
      </q-item-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { ref } from 'vue';
import { api } from 'boot/axios';

interface CaptchaInfo {
  captcha_token: string,
  code: string
}

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const $q = useQuasar();
const captchaInfo = ref<CaptchaInfo>({ captcha_token: '', code: '' });
const imgData = ref('');

function submit() {
  api.post('/captcha/validate', captchaInfo.value).then(() => {
    onDialogOK(captchaInfo.value);
  }).catch((err) => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: '你确定是这样的吗'
    });
    getNewCaptcha();
    captchaInfo.value.code = '';
  });
}

function getNewCaptcha() {
  api.get('/captcha/create').then((res) => {
    imgData.value = res.data['image'];
    captchaInfo.value.captcha_token = res.data['captcha_token'];
  });
}

getNewCaptcha();
</script>
