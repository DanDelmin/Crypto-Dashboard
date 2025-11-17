<template>
  <section class="price-chart">
    <header class="price-chart__header">
      <h2 class="price-chart__title">
        График цены за 7 дней
      </h2>
      <p class="price-chart__subtitle">
        Данные обновляются при загрузке страницы актива. Основано на CoinGecko market chart API.
      </p>
    </header>

    <div v-if="!hasData" class="price-chart__empty">
      Недостаточно данных для построения графика.
    </div>

    <div v-else class="price-chart__body">
      <apexchart
        type="line"
        height="280"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type PricePoint = [number, number];

interface Props {
  prices: PricePoint[];
}

const props = defineProps<Props>();

const hasData = computed(() => props.prices.length > 1);

const series = computed(() => {
  const data = props.prices.map(([timestamp, price]) => ({
    x: new Date(timestamp),
    y: price,
  }));

  return [
    {
      name: 'Price, USD',
      data,
    },
  ];
});

function isDarkTheme(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

const chartOptions = computed(() => {
  const dark = isDarkTheme();

  return {
    chart: {
      id: 'crypto-price-chart',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: 'transparent',
      foreColor: dark ? '#e5e7eb' : '#4b5563',
    },
    theme: {
      mode: dark ? 'dark' : 'light',
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        datetimeUTC: false,
        style: {
          fontSize: '11px',
          colors: dark ? '#9ca3af' : '#6b7280',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) =>
          value >= 1 ? value.toFixed(2) : value.toFixed(4),
        style: {
          fontSize: '11px',
          colors: dark ? '#9ca3af' : '#6b7280',
        },
      },
    },
    tooltip: {
      shared: true,
      x: {
        format: 'dd MMM HH:mm',
      },
      y: {
        formatter: (value: number) =>
          value >= 1 ? `${value.toFixed(2)} $` : `${value.toFixed(6)} $`,
      },
      theme: dark ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
      },
    },
    grid: {
      borderColor: dark ? '#1f2937' : '#e5e7eb',
      strokeDashArray: 4,
    },
    colors: [dark ? '#60a5fa' : '#2563eb'],
  };
});
</script>

<style scoped>
.price-chart {
  padding: 12px 14px;
  border-radius: var(--radius-lg);
  background-color: var(--bg-elevated);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-chart__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-chart__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.price-chart__subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

.price-chart__empty {
  font-size: 13px;
  color: var(--text-secondary);
  padding: 12px 0;
}

.price-chart__body {
  margin-top: 4px;
}

@media (max-width: 480px) {
  .price-chart {
    padding: 10px 10px;
  }

  .price-chart__title {
    font-size: 15px;
  }

  .price-chart__subtitle {
    font-size: 11px;
  }
}
</style>
