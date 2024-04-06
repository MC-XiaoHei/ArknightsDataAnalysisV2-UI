import { Cookies } from 'quasar';
import { reactive, watch } from 'vue';
import { api } from 'boot/axios';

export const USERNAME = 'username';
export const EMAIL = 'email';
export const TOKEN = 'token';
export const NICKNAME = 'nickname';
export const PRIVATE_QQ = 'privateQQ';
export const IS_STATISTICS = 'is_statistics';
export const IS_LUCKY_RANK = 'is_lucky_rank';
export const IS_AUTO_GIFT = 'is_auto_gift';
export const NAME_DISPLAY = 'name_display';
export const NICKNAME_DISPLAY = 'nickname_display';
export const BASE_URL = process.env.BASE_URL;

export interface Account {
  uid: string;
  channel: string;
  nickname: string;
  available: boolean;
}

function getStringSettings(name: string, defaultVal: string): string {
  const cookieValue = Cookies.get(name);
  if (cookieValue !== null) {
    return cookieValue;
  }
  Cookies.set(name, defaultVal, cookiesOptions);
  return defaultVal;
}

const cookiesOptions = {
  expires: '1000d',
  path: '/'
};

const store = reactive({
  username: getStringSettings(USERNAME, ''),
  email: getStringSettings(EMAIL, ''),
  token: getStringSettings(TOKEN, ''),
  nickname: getStringSettings(NICKNAME, ''),
  privateQQ: getStringSettings(PRIVATE_QQ, ''),
  isStatistics: Cookies.get(IS_STATISTICS) === 'true',
  isLuckyRank: Cookies.get(IS_LUCKY_RANK) === 'true',
  isAutoGift: Cookies.get(IS_AUTO_GIFT) === 'true',
  nameDisplay: getStringSettings(NAME_DISPLAY, 'nickname'),
  nicknameDisplay: Cookies.get(NICKNAME_DISPLAY) === 'true',
  selectedAccount: {} as Account,
});
watch(() => store.nickname, (newValue) => {
  Cookies.set(NICKNAME, newValue.toString(), cookiesOptions);
});
watch(() => store.email, (newValue) => {
  Cookies.set(EMAIL, newValue.toString(), cookiesOptions);
});
watch(() => store.username, (newValue) => {
  Cookies.set(USERNAME, newValue.toString(), cookiesOptions);
});
watch(() => store.token, (newValue) => {
  if (newValue === undefined) return;
  Cookies.set(TOKEN, newValue.toString(), cookiesOptions);
  api.defaults.headers.Authorization = 'Bearer ' + newValue;
});
watch(() => store.privateQQ, (newValue) => {
  if (newValue === undefined)
    Cookies.set(PRIVATE_QQ, '0', cookiesOptions);
  else
    Cookies.set(PRIVATE_QQ, newValue.toString(), cookiesOptions);
});
watch(() => store.isStatistics, (newValue) => {
  Cookies.set(IS_STATISTICS, newValue.toString(), cookiesOptions);
});
watch(() => store.isLuckyRank, (newValue) => {
  Cookies.set(IS_LUCKY_RANK, newValue.toString(), cookiesOptions);
});
watch(() => store.isAutoGift, (newValue) => {
  Cookies.set(IS_AUTO_GIFT, newValue.toString(), cookiesOptions);
});
watch(() => store.nameDisplay, (newValue) => {
  Cookies.set(NAME_DISPLAY, newValue.toString(), cookiesOptions);
});
export default store;
