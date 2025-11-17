import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueApexCharts from 'vue3-apexcharts';

import App from './app/App.vue';
import { router } from './app/providers/router';
import { useCryptoStore } from '@/entities/crypto'
import { useAppStore } from '@/shared/stores/app.store.ts'

import './styles/reset.css';
import './style.css';


const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

// глобальный компонент для графиков
app.use(VueApexCharts);

const cryptoStore = useCryptoStore(pinia);
cryptoStore.initFavorites();

const appStore = useAppStore(pinia);
appStore.initConnectivityListeners();

app.mount('#app');
