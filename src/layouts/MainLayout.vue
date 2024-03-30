<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar class="space-x-[8px]">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-white">
          Arknights Data Analysis
        </q-toolbar-title>

        <q-btn flat class="text-white" style="text-transform: none;" label="Authors" />
        <q-btn flat class="text-white" style="text-transform: none;"
               :label="store.username===''?'Account':store.username" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list dense padding>
        <q-item>
          <q-item-section class="text-gray-600">Arknights Account</q-item-section>
          <q-item-section side>
            <q-item-label caption>
              <q-btn flat round icon="add" @click="addAccount" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <div v-for="account in accounts" :key="account.uid">
          <q-separator v-if="accounts[0] !== account" />
          <q-item :clickable="account.available" :disable="!account.available" v-ripple @click="selectAccount(account)">
            <q-item-section>
              <q-item-label>{{ account.nickname }}</q-item-label>
              <q-item-label caption lines="2">UID: {{ account.uid }} -
                {{ account.channel === 'BILIBILI' ? 'B' : '官' }}服
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import store, {
  IS_AUTO_GIFT,
  IS_LUCKY_RANK,
  IS_STATISTICS,
  NAME_DISPLAY,
  NICKNAME,
  NICKNAME_DISPLAY,
  PRIVATE_QQ
} from 'boot/store';
import SignInDialog from 'components/SignInDialog.vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import AddAccountDialog from 'components/AddAccountDialog.vue';
import { useRouter } from 'vue-router';
import { Account } from 'boot/store';

const leftDrawerOpen = ref(false);
const $q = useQuasar();
const accounts: Ref<Account[]> = ref([]);
const router = useRouter();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function selectAccount(account: Account) {
  store.selectedAccount = account;
  router.push('/account');
}

function addAccount() {
  $q.dialog({
    component: AddAccountDialog
  }).onOk(() => {
    getAccounts();
  });
}

function signIn() {
  $q.dialog({
    component: SignInDialog
  }).onOk(() => {
    setTimeout(() => {
      refreshToken();
    }, 100);
  });
}

function getInfo() {
  api.get('/users/info')
    .then((res) => {
      store.username = res.data['username'];
      store.email = res.data['email'];

      store.nickname = res.data['user_config'][NICKNAME];
      store.privateQQ = res.data['user_config'][PRIVATE_QQ];
      store.isStatistics = res.data['user_config'][IS_STATISTICS];
      store.isAutoGift = res.data['user_config'][IS_AUTO_GIFT];
      store.isLuckyRank = res.data['user_config'][IS_LUCKY_RANK];
      store.nameDisplay = res.data['user_config'][NAME_DISPLAY];
      store.nicknameDisplay = res.data['user_config'][NICKNAME_DISPLAY];
    }).catch((err) => {
    console.log(err);
  });
}

function getAccounts() {
  api.get('/accounts/list')
    .then((res) => {
      accounts.value = res.data;
    }).catch((err) => {
    console.log(err);
  });
}

function refreshToken() {
  api.post('/users/refresh_token')
    .then((res) => {
      store.token = res.data.token;
      getInfo();
      getAccounts();
    }).catch(() => {
    signIn();
  });
}

onMounted(() => {
  if (store.token === '') signIn();
  else {
    api.defaults.headers.Authorization = 'Bearer ' + store.token;
    refreshToken();
  }
});
</script>
