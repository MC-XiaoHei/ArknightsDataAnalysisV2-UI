<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import { api } from 'boot/axios';

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const tokenValid = ref(true);

const account = ref({
  channel: 'BILIBILI',
  token: ''
});

async function createAccount() {
  if (account.value.token === '') {
    tokenValid.value = false;
    return;
  }

  api.post('/accounts/create', {
    channel: account.value.channel,
    token: account.value.token
  }).then((res) => {
    if (res.status === 200) {
      addToUser();
    } else {
      tokenValid.value = false;
    }
  }).catch(() => {
    tokenValid.value = false;
  });
}

function addToUser() {
  api.post('/accounts/add_to_user', {
    channel: account.value.channel,
    token: account.value.token
  }).then((res) => {
    if (res.status === 200) {
      dialogRef.value?.hide();
      onDialogOK();
    } else {
      tokenValid.value = false;
    }
  }).catch(() => {
    tokenValid.value = false;
  });
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="w-[320px]">
      <q-card-section class="text-primary">
        <div class="text-h6">添加账号</div>
        <q-input v-model="account.token" label="Token" />
        <q-item-label v-if="!tokenValid" class="pt-2 text-red-400" caption>Token无效！</q-item-label>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn-toggle v-model="account.channel"
                      toggle-color="primary"
                      dense
                      flat
                      text-color="grey-8"
                      :options="[
                        {label: 'B服', value: 'BILIBILI'},
                        {label: '官服', value: 'OFFICIAL'},
                      ]"
                      label="可用" />
        <q-btn @click="createAccount" flat>确定</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
