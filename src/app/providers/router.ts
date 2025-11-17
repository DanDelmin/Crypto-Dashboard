import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { DashboardPage } from '@/pages/dashboard';
import { NotFoundPage } from '@/pages/not-found';
import { AssetPage } from '@/pages/asset';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardPage,
  },
  {
    path: '/asset/:id',
    name: 'asset',
    component: AssetPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
