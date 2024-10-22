<template>
  <div class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <div>
      <div v-if="loading" class="loader-container">
        <q-spinner-bars size="50px" color="white" />
        <div class="text-h2 opacity-[0.7] q-mt-md">正在验证中...</div>
      </div>
      <div v-else>
        <div class="text-h2 opacity-[0.7]">{{ message }}</div>
        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="primary"
          unelevated
          label="返回首页"
          to="/"
          no-caps
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'EmailVerifyPage',
  setup() {
    const route = useRoute();
    const message = ref('');
    const loading = ref(true);
    const error = ref(false);

    onMounted(async () => {
      const token = route.query.token;
      if (token) {
        try {
          const response = await api.post('/email/verify', { token: token });
          const verifyType = response.data.type;
          message.value = '验证成功';
          switch (verifyType) {
            case 'verify_email':
              message.value = '邮箱验证完成，请返回登陆';
              break;
            case 'change_password':
              message.value = '密码已更改，请返回登陆';
              break;
          }
        } catch (e) {
          console.error(e);
          message.value = '验证错误，链接可能过期或错误';
          error.value = true;
        } finally {
          loading.value = false;
        }
      } else {
        message.value = '缺少token，无法进行验证';
        loading.value = false;
        error.value = true;
      }
    });

    return {
      message,
      loading,
      error
    };
  }
});
</script>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
