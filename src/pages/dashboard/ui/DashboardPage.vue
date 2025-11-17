<template>
  <section class="dashboard-page">
    <h2 class="dashboard-title">Crypto Market Overview</h2>

    <p class="dashboard-subtitle">
      Список популярных криптовалют с ценой в USD и изменением за 24 часа.
    </p>

    <div class="dashboard-controls">
      <CryptoFilters @change="onFiltersChange" />

      <span class="dashboard-refresh-info">
        Обновление данных каждые 30 секунд
      </span>
    </div>

    <!-- OFFLINE-баннер -->
    <div v-if="!isOnline" class="dashboard-offline">
      Нет подключения к интернету. Показаны последние загруженные данные.
    </div>

    <!-- Сортировка над таблицей (desktop) -->
    <div class="dashboard-sort-desktop">
      <button
        type="button"
        class="dashboard-sort-btn"
        :class="{ 'dashboard-sort-btn_active': filters.sortBy === 'name' }"
        @click="onDesktopSort('name')"
      >
        <span>По названию</span>
        <span class="dashboard-sort-arrow">
          {{ filters.sortBy === 'name' && filters.sortDir === 'desc' ? '↓' : '↑' }}
        </span>
      </button>

      <button
        type="button"
        class="dashboard-sort-btn dashboard-sort-btn_right"
        :class="{ 'dashboard-sort-btn_active': filters.sortBy === 'price' }"
        @click="onDesktopSort('price')"
      >
        <span>По цене (USD)</span>
        <span class="dashboard-sort-arrow">
          {{ filters.sortBy === 'price' && filters.sortDir === 'desc' ? '↓' : '↑' }}
        </span>
      </button>
    </div>

    <div class="dashboard-content">
      <MarketTable
        :items="filteredItems"
        :is-loading="isLoading"
        :error="error"
        @retry="retryLoad"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, reactive } from 'vue';
import { useCryptoStore } from '@/entities/crypto';
import { MarketTable } from '@/widgets/market-table';
import { CryptoFilters } from '@/features/crypto-filters';
import type { CryptoFilterState } from '@/features/crypto-filters';
import type { CryptoMarketItem } from '@/entities/crypto';
import { useAppStore } from '@/shared/stores/app.store';

const cryptoStore = useCryptoStore();
const appStore = useAppStore();

const filters = reactive<CryptoFilterState>({
  search: '',
  sortBy: 'name',
  sortDir: 'asc',
});

let refreshTimer: number | undefined;

const rawItems = computed(() => cryptoStore.items);
const isLoading = computed(() => cryptoStore.isLoading);
const error = computed(() => cryptoStore.error);
const isOnline = computed(() => appStore.isOnline);

const filteredItems = computed<CryptoMarketItem[]>(() => {
  const search = filters.search.trim().toLowerCase();
  const sortBy = filters.sortBy;
  const sortDir = filters.sortDir;

  let result = [...rawItems.value];

  if (search) {
    result = result.filter((item) => {
      const name = item.name.toLowerCase();
      const symbol = item.symbol.toLowerCase();
      return name.includes(search) || symbol.includes(search);
    });
  }

  result.sort((a, b) => {
    let cmp = 0;

    if (sortBy === 'name') {
      const an = a.name.toLowerCase();
      const bn = b.name.toLowerCase();
      if (an < bn) cmp = -1;
      if (an > bn) cmp = 1;
    } else if (sortBy === 'price') {
      cmp = a.current_price - b.current_price;
    }

    return sortDir === 'asc' ? cmp : -cmp;
  });

  return result;
});

onMounted(() => {
  if (!cryptoStore.items.length) {
    cryptoStore.loadMarkets();
  }

  refreshTimer = window.setInterval(() => {
    cryptoStore.loadMarkets();
  }, 30_000);
});

onBeforeUnmount(() => {
  if (refreshTimer !== undefined) {
    clearInterval(refreshTimer);
  }
});

function onFiltersChange(next: CryptoFilterState) {
  filters.search = next.search;
  filters.sortBy = next.sortBy;
  filters.sortDir = next.sortDir;
}

function onDesktopSort(field: 'name' | 'price') {
  if (filters.sortBy === field) {
    filters.sortDir = filters.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    filters.sortBy = field;
    filters.sortDir = 'asc';
  }
}

function retryLoad() {
  cryptoStore.loadMarkets();
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dashboard-title {
  font-size: 20px;
  font-weight: 600;
}

.dashboard-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.dashboard-controls {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.dashboard-refresh-info {
  font-size: 12px;
  color: var(--text-muted);
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.dashboard-offline {
  margin-top: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.12);
  border: 1px dashed rgba(148, 163, 184, 0.7);
  font-size: 12px;
  color: var(--text-secondary);
}

/* сортировка над таблицей */

.dashboard-sort-desktop {
  display: none;
}

.dashboard-content {
  margin-top: 4px;
}

@media (min-width: 768px) {
  .dashboard-sort-desktop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 4px 2px 6px;
  }

  .dashboard-sort-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: transparent;
    font-size: 13px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .dashboard-sort-btn:hover {
    border-color: var(--border-subtle);
    background: var(--accent-soft);
    color: var(--text-primary);
  }

  .dashboard-sort-btn_active {
    border-color: var(--accent);
    background: var(--accent-soft);
    color: var(--text-primary);
  }

  .dashboard-sort-btn_right {
    margin-left: auto;
  }

  .dashboard-sort-arrow {
    font-size: 12px;
  }
}

@media (max-width: 640px) {
  .dashboard-controls {
    align-items: flex-start;
    flex-direction: column;
  }

  .dashboard-refresh-info {
    align-self: flex-start;
  }
}
</style>
