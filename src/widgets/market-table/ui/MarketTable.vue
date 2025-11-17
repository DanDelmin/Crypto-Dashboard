<template>
  <div class="market-table">
    <!-- SKELETON: первая загрузка -->
    <div v-if="showSkeleton" class="market-table__skeleton">
      <div class="skeleton-header"></div>
      <div
        v-for="n in 7"
        :key="n"
        class="skeleton-row"
      >
        <div class="skeleton-cell skeleton-cell--short"></div>
        <div class="skeleton-cell skeleton-cell--wide"></div>
        <div class="skeleton-cell skeleton-cell--mid"></div>
        <div class="skeleton-cell skeleton-cell--mid"></div>
        <div class="skeleton-cell skeleton-cell--short"></div>
      </div>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="error"
      class="market-table__status market-table__status_error"
    >
      <div class="status-content">
        <div class="status-title">Не удалось загрузить данные рынка</div>
        <div class="status-text">
          {{ error }}
        </div>
      </div>
      <button type="button" class="status-btn" @click="onRetry">
        Повторить попытку
      </button>
    </div>

    <!-- ПУСТО -->
    <div v-else-if="!items.length" class="market-table__status">
      Нет данных для отображения.
    </div>

    <!-- ОСНОВНОЙ КОНТЕНТ -->
    <template v-else>
      <!-- DESKTOP TABLE -->
      <table class="market-table__table">
        <thead>
        <tr>
          <th class="cell cell-left cell-fav-col"></th>
          <th class="cell cell-left">#</th>
          <th class="cell cell-left">Актив</th>
          <th class="cell cell-left">Тикер</th>
          <th class="cell cell-right">Цена (USD)</th>
          <th class="cell cell-right">24h, %</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(item, index) in items"
          :key="item.id"
          class="row"
          :class="{ 'row--animated': firstLoad }"
          :style="{ animationDelay: `${index * 40}ms` }"
          @click="openDetails(item.id)"
        >
          <td class="cell cell-left cell-fav-col">
            <button
              type="button"
              class="fav-btn"
              :class="{ 'fav-btn_active': isFavorite(item.id) }"
              @click.stop="onToggleFavorite(item.id)"
              :aria-label="isFavorite(item.id) ? 'Убрать из избранного' : 'Добавить в избранное'"
            >
              <span class="fav-icon">★</span>
            </button>
          </td>

          <td class="cell cell-left">
            {{ index + 1 }}
          </td>

          <td class="cell cell-left cell-asset">
            <img
              :src="item.image"
              :alt="item.name"
              class="asset-icon"
            />
            <span class="asset-name">{{ item.name }}</span>
          </td>

          <td class="cell cell-left cell-symbol">
            {{ item.symbol.toUpperCase() }}
          </td>

          <td class="cell cell-right">
            {{ formatPrice(item.current_price) }}
          </td>

          <td
            class="cell cell-right"
            :class="getChangeClass(item.price_change_percentage_24h)"
          >
              <span v-if="item.price_change_percentage_24h !== null">
                {{ formatChange(item.price_change_percentage_24h) }}
              </span>
            <span v-else>—</span>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- MOBILE GRID -->
      <div class="market-table__grid">
        <article
          v-for="(item, index) in items"
          :key="`${item.id}-mobile`"
          class="grid-card"
          :style="{ animationDelay: `${index * 40}ms` }"
          @click="openDetails(item.id)"
        >
          <div class="grid-card__asset">
            <img
              :src="item.image"
              :alt="item.name"
              class="asset-icon"
            />
            <div class="grid-card__asset-text">
              <span class="grid-card__name">{{ item.name }}</span>
              <span class="grid-card__ticker">
                {{ item.symbol.toUpperCase() }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="fav-btn fav-btn_mobile"
            :class="{ 'fav-btn_active': isFavorite(item.id) }"
            @click.stop="onToggleFavorite(item.id)"
            :aria-label="isFavorite(item.id) ? 'Убрать из избранного' : 'Добавить в избранное'"
          >
            <span class="fav-icon">★</span>
          </button>

          <div class="grid-card__price">
            {{ formatPrice(item.current_price) }}
          </div>

          <div
            class="grid-card__change"
            :class="getChangeClass(item.price_change_percentage_24h)"
          >
            <span v-if="item.price_change_percentage_24h !== null">
              {{ formatChange(item.price_change_percentage_24h) }}
            </span>
            <span v-else>—</span>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CryptoMarketItem } from '@/entities/crypto';
import { useRouter } from 'vue-router';
import { useCryptoStore } from '@/entities/crypto';
import { ref, onMounted, computed } from 'vue';

interface Props {
  items: CryptoMarketItem[];
  isLoading: boolean;
  error: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'retry'): void;
}>();

const router = useRouter();
const cryptoStore = useCryptoStore();

const firstLoad = ref(true);

onMounted(() => {
  requestAnimationFrame(() => {
    firstLoad.value = false;
  });
});

const showSkeleton = computed(
  () => props.isLoading && !props.items.length && !props.error,
);

function onRetry() {
  emit('retry');
}

function openDetails(id: string) {
  router.push({ name: 'asset', params: { id } });
}

function onToggleFavorite(id: string) {
  cryptoStore.toggleFavorite(id);
}

function isFavorite(id: string): boolean {
  return cryptoStore.isFavorite(id);
}

function formatPrice(value: number): string {
  if (value >= 1) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  });
}

function formatChange(value: number): string {
  const rounded = value.toFixed(2);
  if (value > 0) {
    return `+${rounded}`;
  }
  return rounded;
}

function getChangeClass(value: number | null): string | null {
  if (value === null) return null;

  return value > 0
    ? 'cell-change_positive'
    : value < 0
      ? 'cell-change_negative'
      : null;
}
</script>

<style scoped>
.market-table__status {
  font-size: 14px;
  color: var(--text-secondary);
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.market-table__status_error {
  color: var(--danger);
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-title {
  font-weight: 600;
}

.status-text {
  font-size: 13px;
}

.status-btn {
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
}

.status-btn:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  transform: translateY(-1px);
}

/* SKELETON */

.market-table__skeleton {
  background-color: var(--bg-elevated);
  border-radius: var(--radius-lg);
  padding: 8px 10px 10px;
  box-shadow: var(--shadow-soft);
}

.skeleton-header {
  height: 18px;
  width: 40%;
  border-radius: 999px;
  background: var(--skeleton-bg);
  margin-bottom: 8px;
}

.skeleton-row {
  display: grid;
  grid-template-columns: 40px 1.4fr 0.9fr 0.9fr 0.7fr;
  gap: 8px;
  margin-bottom: 6px;
}

.skeleton-cell {
  height: 14px;
  border-radius: 999px;
  background: var(--skeleton-bg);
  overflow: hidden;
  position: relative;
}

.skeleton-cell::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
  animation: skeleton-shimmer 1.3s infinite;
}

.skeleton-cell--short {
  width: 60%;
}

.skeleton-cell--mid {
  width: 80%;
}

.skeleton-cell--wide {
  width: 100%;
}

/* DESKTOP TABLE */

.market-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background-color: var(--bg-elevated);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}

.market-table__table thead {
  background: linear-gradient(
    90deg,
    rgba(79, 70, 229, 0.1),
    rgba(56, 189, 248, 0.1)
  );
}

.row:nth-child(even) {
  background-color: var(--bg-elevated-soft);
}

.cell {
  padding: 8px 10px;
}

.cell-left {
  text-align: left;
}

.cell-right {
  text-align: right;
}

.cell-asset {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-icon {
  width: 20px;
  height: 20px;
  border-radius: 999px;
}

.asset-name {
  font-weight: 500;
}

.cell-symbol {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
  'Liberation Mono', 'Courier New', monospace;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.cell-change_positive {
  color: var(--success);
}

.cell-change_negative {
  color: var(--danger);
}

/* избранное */

.cell-fav-col {
  width: 40px;
}

.fav-btn {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}

.fav-btn:hover {
  transform: translateY(-1px);
  background: var(--accent-soft);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.15);
}

.fav-icon {
  font-size: 16px;
  color: var(--text-muted);
}

.fav-btn_active .fav-icon {
  color: var(--accent);
}

/* ROW HOVER / CURSOR */

.row {
  cursor: pointer;
}

.row:hover {
  background-color: rgba(148, 163, 184, 0.18);
}

/* MOBILE GRID */

.market-table__grid {
  display: none;
}

@media (max-width: 767px) {
  .market-table__table {
    display: none;
  }

  .market-table__skeleton {
    padding-inline: 8px;
  }

  .skeleton-row {
    grid-template-columns: 32px 1.4fr 0.9fr 0.9fr 0.7fr;
  }

  .market-table__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin-top: 4px;
  }

  .grid-card {
    position: relative;
    display: grid;
    grid-template-areas:
      "asset price"
      "asset change";
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr);
    row-gap: 4px;
    column-gap: 8px;

    padding: 30px 12px 10px;
    background-color: var(--bg-elevated);
    border-radius: var(--radius-md);
    border: 1px solid rgba(148, 163, 184, 0.35);
    box-shadow: var(--shadow-soft);

    opacity: 0;
    animation: fade-in-up 0.35s ease-out forwards;
    cursor: pointer;
  }

  .grid-card__asset {
    grid-area: asset;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .grid-card__asset-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .grid-card__name {
    font-size: 14px;
    font-weight: 600;
  }

  .grid-card__ticker {
    font-size: 12px;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  .grid-card__price {
    grid-area: price;
    text-align: right;
    font-size: 15px;
    font-weight: 600;
  }

  .grid-card__change {
    grid-area: change;
    text-align: right;
    font-size: 13px;
    font-weight: 500;
  }

  .asset-icon {
    width: 22px;
    height: 22px;
  }

  .fav-btn_mobile {
    position: absolute;
    top: 6px;
    right: 8px;
  }
}

/* ANIMATIONS */

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.row--animated {
  opacity: 0;
  animation: fade-in-up 0.35s ease-out forwards;
}

@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
