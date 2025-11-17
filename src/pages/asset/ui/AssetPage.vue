<template>
  <section class="asset-page">
    <RouterLink to="/" class="asset-page__back"> ← Назад к списку </RouterLink>

    <div v-if="isLoading" class="asset-page__status">Загрузка данных об активе...</div>

    <div v-else-if="error" class="asset-page__status asset-page__status_error">
      {{ error }}
    </div>

    <div v-else-if="!details" class="asset-page__status">Данные об активе не найдены.</div>

    <div v-else class="asset-page__content">
      <header class="asset-page__header">
        <div class="asset-page__title-block">
          <img
            :src="details.image.large || details.image.small"
            :alt="details.name"
            class="asset-page__icon"
          />
          <div>
            <h1 class="asset-page__title">
              {{ details.name }}
            </h1>
            <p class="asset-page__subtitle">
              {{ details.symbol.toUpperCase() }}
            </p>
          </div>
        </div>

        <div class="asset-page__price-block">
          <div class="asset-page__price">
            {{ formatPrice(details.market_data.current_price.usd) }} $
          </div>
          <div
            class="asset-page__change"
            :class="getChangeClass(details.market_data.price_change_percentage_24h)"
          >
            <span v-if="details.market_data.price_change_percentage_24h !== null">
              {{ formatChange(details.market_data.price_change_percentage_24h) }}
            </span>
            <span v-else>—</span>
          </div>
        </div>
      </header>

      <section class="asset-page__stats">
        <div class="asset-page__stat-card">
          <span class="asset-page__stat-label">Макс. цена за 24ч</span>
          <span class="asset-page__stat-value">
            {{
              details.market_data.high_24h.usd !== null
                ? formatPrice(details.market_data.high_24h.usd) + ' $'
                : '—'
            }}
          </span>
        </div>

        <div class="asset-page__stat-card">
          <span class="asset-page__stat-label">Мин. цена за 24ч</span>
          <span class="asset-page__stat-value">
            {{
              details.market_data.low_24h.usd !== null
                ? formatPrice(details.market_data.low_24h.usd) + ' $'
                : '—'
            }}
          </span>
        </div>

        <div class="asset-page__stat-card">
          <span class="asset-page__stat-label">Рыночная капитализация</span>
          <span class="asset-page__stat-value">
            {{
              details.market_data.market_cap.usd !== null
                ? formatMarketCap(details.market_data.market_cap.usd)
                : '—'
            }}
          </span>
        </div>

        <div class="asset-page__stat-card">
          <span class="asset-page__stat-label">Изменение за 7 дней</span>
          <span class="asset-page__stat-value" :class="getChangeClass(weekChangePercent)">
            <span v-if="weekChangePercent !== null">
              {{ formatChange(weekChangePercent) }}
            </span>
            <span v-else>—</span>
          </span>
        </div>
      </section>

      <section class="asset-page__chart">
        <PriceChart :prices="prices" />
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { fetchCryptoDetails, fetchCryptoMarketChart } from '@/entities/crypto/api/crypto.api'
import type { CryptoDetails, CryptoMarketChart } from '@/entities/crypto'
import { PriceChart } from '@/widgets/price-chart'

const route = useRoute()

const isLoading = ref(false)
const error = ref<string | null>(null)
const details = ref<CryptoDetails | null>(null)
const chart = ref<CryptoMarketChart | null>(null)

const prices = computed(() => chart.value?.prices ?? [])

const weekChangePercent = computed<number | null>(() => {
  const list = prices.value;

  if (!Array.isArray(list) || list.length < 2) {
    return null;
  }

  const first = list[0]?.[1];
  const last = list[list.length - 1]?.[1];

  if (first === undefined || last === undefined || first === 0) {
    return null;
  }

  return ((last - first) / first) * 100;
});


onMounted(async () => {
  const id = route.params.id

  if (typeof id !== 'string' || !id) {
    error.value = 'Некорректный идентификатор актива'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const [detailsData, chartData] = await Promise.all([
      fetchCryptoDetails(id),
      fetchCryptoMarketChart(id, 7),
    ])

    details.value = detailsData
    chart.value = chartData
  } catch (e) {
    console.error('AssetPage load error:', e)
    error.value = 'Не удалось загрузить данные об активе'
  } finally {
    isLoading.value = false
  }
})

function formatPrice(value: number): string {
  if (value >= 1) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  })
}

function formatChange(value: number): string {
  const rounded = value.toFixed(2)
  if (value > 0) {
    return `+${rounded}%`
  }
  return `${rounded}%`
}

function getChangeClass(value: number | null): string | null {
  if (value === null) return null
  return value > 0 ? 'asset-change_positive' : value < 0 ? 'asset-change_negative' : null
}

function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)} B $`
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} M $`
  }

  return `${value.toLocaleString('en-US', { maximumFractionDigits: 0 })} $`
}
</script>

<style scoped>
.asset-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.asset-page__back {
  font-size: 14px;
  color: var(--accent);
  text-decoration: none;
  margin-bottom: 4px;
}

.asset-page__back:hover {
  text-decoration: underline;
}

.asset-page__status {
  font-size: 14px;
  color: var(--text-secondary);
  padding: 12px 0;
}

.asset-page__status_error {
  color: var(--danger);
}

.asset-page__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.asset-page__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.asset-page__title-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.asset-page__icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
}

.asset-page__title {
  font-size: 22px;
  font-weight: 600;
}

.asset-page__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.asset-page__price-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.asset-page__price {
  font-size: 22px;
  font-weight: 600;
}

.asset-page__change {
  font-size: 14px;
  font-weight: 500;
}

.asset-change_positive {
  color: var(--success);
}

.asset-change_negative {
  color: var(--danger);
}

.asset-page__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.asset-page__stat-card {
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background-color: var(--bg-elevated);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.asset-page__stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.asset-page__stat-value {
  font-size: 14px;
  font-weight: 500;
}

.asset-page__chart {
  margin-top: 4px;
}

/* На очень маленьких экранах выравниваем header по колонкам */
@media (max-width: 480px) {
  .asset-page__header {
    align-items: flex-start;
  }

  .asset-page__price-block {
    align-items: flex-start;
  }
}
</style>
