<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { ref } from 'vue';
import { api } from 'boot/axios';

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const $q = useQuasar();

const loading = ref(false);
const tokenValid = ref(true);

const account = ref({
  channel: 'AUTO',
  token: ''
});

async function onConfirmClick() {
  loading.value = true;
  if (account.value.channel === 'AUTO') {
    await foundToken();
  } else {
    await createAccount();
  }
  loading.value = false;
}

async function foundToken() {
  try {
    let tokenData = account.value.token;
    try {
      tokenData = JSON.parse(tokenData).data?.content || tokenData;
    } catch {
    }

    if (tokenData.length === 24) {
      account.value.channel = 'OFFICIAL';
    } else if (tokenData.length >= 296) {
      account.value.channel = 'BILIBILI';
    } else {
      account.value.token = '';
      tokenValid.value = false;
      return;
    }

    account.value.token = tokenData;
  } catch {
    account.value.token = '';
    tokenValid.value = false;
    return;
  }

  await createAccount();
}

async function createAccount() {
  if (account.value.token === '') {
    return; // 就当没看见
  }

  try {
    const res = await api.post('/accounts/create', {
      channel: account.value.channel,
      token: account.value.token
    });

    if (res.status === 200) {
      await addToUser();
    } else {
      tokenValid.value = false;
    }
  } catch {
    tokenValid.value = false;
  }
}

async function addToUser() {
  try {
    const res = await api.post('/accounts/add_to_user', {
      channel: account.value.channel,
      token: account.value.token
    });

    if (res.status === 200) {
      $q.notify({
        type: 'positive',
        message: '添加成功'
      });
      dialogRef.value?.hide();
      onDialogOK();
    } else {
      tokenValid.value = false;
    }
  } catch {
    tokenValid.value = false;
  }
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="w-[320px]">
      <q-card-section class="text-primary">
        <div class="text-h6">添加账号</div>
        <q-input v-model="account.token" :label="account.channel === 'AUTO' ? 'Context' : 'Token'" />
        <q-item-label v-if="!tokenValid" class="pt-2 text-red-400" caption>Token无效！</q-item-label>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn-toggle v-model="account.channel"
                      toggle-color="primary"
                      dense
                      flat
                      text-color="grey-8"
                      :options="[
                        {label: 'AUTO', value: 'AUTO'},
                        {label: 'B服', value: 'BILIBILI'},
                        {label: '官服', value: 'OFFICIAL'},
                      ]"
                      label="可用" />
        <q-btn @click="onConfirmClick" flat>
          确定
          <q-spinner v-if="loading" size="20px" class="q-ml-sm" />
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
