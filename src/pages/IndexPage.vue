<template>
  <q-page class="row items-center justify-evenly q-gutter-md">
    <div id="card-groups" class="row q-gutter-md">
      <div class="col-sm-12 col-lg-4">
        <q-card class="card card-elevated">
          <q-card-section>
            <div class="card-body">
              <h4>第 一 步</h4>
              <div>在
                <q-btn flat label="官网" class="custom-btn small-btn" href="https://ak.hypergryph.com/user" target="_blank"></q-btn>
                检查登录状态
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-sm-12 col-lg-4">
        <q-card class="card card-elevated">
          <q-card-section>
            <div class="card-body">
              <h4>第 二 步</h4>
              <div>复制所属服务器链接内 <strong class="text-red">全部内容</strong></div>
              <div class="btn-group">
                <q-btn flat label="官服" class="custom-btn small-btn" href="https://web-api.hypergryph.com/account/info/hg" target="_blank"></q-btn>
                <q-btn flat label="B服" class="custom-btn-pink small-btn" href="https://web-api.hypergryph.com/account/info/ak-b" target="_blank"></q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

// TODO 有时间重写了比较好

<script setup lang="ts">
</script>

<style scoped>
.card {
  height: 150px;
  border-radius: 15px;
}

.card-elevated {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
}

.card-elevated:hover {
  transform: translateY(-5px);
}

.custom-btn {
  background-color: #6200ea;
  color: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}

.custom-btn:hover {
  background-color: #3700b3;
  transform: scale(1.05);
}

.custom-btn-pink {
  background-color: #f86c96;
  color: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}

.custom-btn-pink:hover {
  background-color: #d81b60;
  transform: scale(1.05);
}

.small-btn {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-group {
  display: flex;
  gap: 10px;
}
</style>
