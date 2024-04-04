<!--suppress JSUnresolvedReference -->
<script setup lang="ts">

import store from '../boot/store';
import { api } from 'boot/axios';

import { ref, watch } from 'vue';

watch(() => store.selectedAccount, () => {
  getOsrInfo();
  getPayRecordInfo();
});

const osrInfo = ref();
const osrLuckyAvg = ref();
const osrLuckyCount = ref();
const osrNumberMonth = ref();
const osrNumberPool = ref();
const osrNotUpAvg = ref();
const osrNotUpNumber = ref();
const osrTotalCount = ref();
const osrTotalNumber = ref();
const startTime = ref();
const endTime = ref();

function getOsrInfo() {
  api.post('/accounts/data/osr_info', {
    uid: store.selectedAccount.uid
  }).then((res) => {
    osrInfo.value = res.data;
    osrLuckyAvg.value = Object.entries(osrInfo.value.osr_lucky_avg).map(([level, number]) => ({
      level,
      number
    })).reverse();
    osrLuckyCount.value = Object.entries(osrInfo.value.osr_lucky_count as []).map(([name, values]) => ({
      name: name,
      number: values['6'],
      probability: values['6'] <= 50 ? 2 : 2 + 2 * (values['6'] - 50)
    }));
    osrNumberMonth.value = Object.entries(osrInfo.value.osr_number_month).map(([date, number]) => ({ date, number }));
    const osrNumberPoolTotalData = osrInfo.value.osr_number_pool.total;
    const osrNumberPoolPerData = osrInfo.value.osr_number_pool;
    delete osrNumberPoolPerData.total;
    osrNumberPool.value = Object.entries(osrNumberPoolPerData).map(([pool, number]) => ({ pool, number }));
    osrTotalNumber.value = osrNumberPoolTotalData.all;
    delete osrNumberPoolTotalData.all;
    osrTotalCount.value = Object.entries(osrNumberPoolTotalData).map(([level, number]) => ({
      level,
      number
    })).reverse();
    osrNotUpNumber.value = osrInfo.value.osr_not_up_avg.total;
    delete osrInfo.value.osr_not_up_avg.total;
    osrNotUpAvg.value = Object.entries(osrInfo.value.osr_not_up_avg).map(([pool, number]) => ({ pool, number }));
    startTime.value = osrInfo.value.time.start_time.replace('T', ' ').replace('Z', '');
    endTime.value = osrInfo.value.time.end_time.replace('T', ' ').replace('Z', '');
  });
}

function getPayRecordInfo() {
  api.post('/accounts/data/pay_record_info', {
    uid: store.selectedAccount.uid
  }).then((res) => {
    console.log(res.data);
  });
}
</script>

<template>
  <q-page class="p-[16px] text-grey-9" v-if="store.selectedAccount.uid != null">
    <div class="text-h4">{{ store.selectedAccount.nickname }}
      <div class="text-overline">{{ startTime }} - {{ endTime }}</div>
    </div>
    <q-table
      title="抽卡数据总览"
      :rows="osrTotalCount"
      :columns="[{
        name: 'level',
        label: '总计',
        align: 'left',
        field: 'level',
        sortable: false
      }, {
        name: 'number',
        label: osrTotalNumber + '抽',
        align: 'left',
        field: 'number',
        sortable: false,
        format: (val:string) => `${val}抽`
      }]"
      row-key="name"
      hide-bottom
      hide-selected-banner
      hide-no-data
      hide-pagination
    />
    <br />
    <q-table
      title="平均出货次数"
      :rows="osrLuckyAvg"
      :columns="[{
        name: 'level',
        label: '干员星级',
        align: 'left',
        field: 'level',
        sortable: false
      }, {
        name: 'number',
        label: '抽数',
        align: 'left',
        field: 'number',
        sortable: false,
        format: (val:number) => `${val.toFixed(2)}抽`
      }]"
      row-key="name"
      hide-bottom
      hide-selected-banner
      hide-no-data
      hide-pagination
    />
    <br />
    <q-table
      title="各卡池保底情况"
      :rows="osrLuckyCount"
      :columns="[{
        name: 'name',
        label: '卡池',
        align: 'left',
        field: 'name',
        sortable: false
      }, {
        name: 'number',
        label: '未出六星抽数',
        align: 'left',
        field: 'number',
        sortable: false,
        format: (val:string) => `${val}抽`
      }, {
        name: 'probability',
        label: '出六星概率',
        align: 'left',
        field: 'probability',
        sortable: false,
        format: (val:string) => `${val}%`
      }]"
      row-key="name"
      hide-bottom
      hide-selected-banner
      hide-no-data
      hide-pagination
    />
    <br />
    <q-table
      title="每月抽卡次数"
      :rows="osrNumberMonth"
      :columns="[{
        name: 'date',
        label: '日期',
        align: 'left',
        field: 'date',
        sortable: false
      }, {
        name: 'number',
        label: '抽数',
        align: 'left',
        field: 'number',
        sortable: false,
        format: (val:string) => `${val}抽`
      }]"
      row-key="name"
      hide-bottom
      hide-selected-banner
      hide-no-data
      hide-pagination
    />
    <br />
    <q-table
      title="各卡池抽卡次数"
      :rows="osrNumberPool"
      :columns="[{
        name: 'pool',
        label: '卡池',
        align: 'left',
        field: 'pool',
        sortable: false
      }, {
        name: 'number',
        label: '抽数',
        align: 'left',
        field: 'number',
        sortable: false,
        format: (val:string) => `${val}抽`
      }]"
      row-key="name"
      hide-bottom
      hide-selected-banner
      hide-no-data
      hide-pagination
    />
    <br />
    <q-table
      title="各卡池歪卡率"
      :rows="osrNotUpAvg"
      :columns="[{
        name: 'pool',
        label: '总计',
        align: 'left',
        field: 'pool',
        sortable: false
      }, {
        name: 'number',
        label: (osrNotUpNumber * 100).toFixed(2) + '%',
        align: 'left',
        field: 'number',
        sortable: false,
        format: (val:number) => (val * 100).toFixed(2) + '%'
      }]"
      row-key="name"
      hide-bottom
      hide-selected-banner
      hide-no-data
      hide-pagination
    />
  </q-page>
</template>

<style scoped>

</style>
