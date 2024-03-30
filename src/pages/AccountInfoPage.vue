<script setup lang="ts">

import store from '../boot/store';
</script>

<template>
  <q-page class="p-[16px] text-grey-9">
    <div class="text-h4">{{ store.selectedAccount.nickname }}</div>
    <q-separator spaced />
  </q-page>
</template>

<style scoped>

</style>
