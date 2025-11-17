<template>
  <div class="crypto-filters">
    <div class="crypto-filters__search">
      <div class="crypto-filters__search-inner">
        <span class="crypto-filters__search-icon">
          🔍
        </span>
        <input
          id="crypto-search"
          v-model="search"
          type="text"
          class="crypto-filters__input"
          placeholder="Например: bitcoin или BTC"
        />
      </div>
    </div>

    <div class="crypto-filters__sort-mobile">
      <div class="crypto-filters__sort-row">
        <div class="crypto-filters__select-wrap">
          <select
            id="crypto-sort-by"
            v-model="sortBy"
            class="crypto-filters__select"
          >
            <option value="name">По названию</option>
            <option value="price">По цене (USD)</option>
          </select>
        </div>

        <button
          type="button"
          class="crypto-filters__dir-btn"
          :aria-label="sortDir === 'asc' ? 'По возрастанию' : 'По убыванию'"
          @click="toggleDirection"
        >
          <span v-if="sortDir === 'asc'">↑</span>
          <span v-else>↓</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export type SortBy = 'name' | 'price';
export type SortDir = 'asc' | 'desc';

export interface CryptoFilterState {
  search: string;
  sortBy: SortBy;
  sortDir: SortDir;
}

const emit = defineEmits<{
  (e: 'change', value: CryptoFilterState): void;
}>();

const search = ref('');
const sortBy = ref<SortBy>('name');
const sortDir = ref<SortDir>('asc');

watch([search, sortBy, sortDir], () => {
  emit('change', {
    search: search.value,
    sortBy: sortBy.value,
    sortDir: sortDir.value,
  });
});

function toggleDirection() {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
}
</script>

<style scoped>
.crypto-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
  width: 100%;
}

.crypto-filters__search {
  width: 100%;
}

.crypto-filters__search-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: radial-gradient(circle at 0 0, var(--accent-soft), transparent 55%),
  var(--bg-input);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.12);
}

:root[data-theme='dark'] .crypto-filters__search-inner {
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.85);
}

.crypto-filters__search-icon {
  font-size: 15px;
  opacity: 0.8;
}

.crypto-filters__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--text-primary);
}

.crypto-filters__input::placeholder {
  color: var(--text-muted);
}

.crypto-filters__sort-mobile {
  display: flex;
}

.crypto-filters__sort-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.crypto-filters__select-wrap {
  position: relative;
  flex: 1;
}

.crypto-filters__select {
  width: 100%;
  padding: 6px 28px 6px 10px;
  font-size: 14px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-input);
  color: var(--text-primary);
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.crypto-filters__select-wrap::after {
  content: '';
  position: absolute;
  pointer-events: none;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px 4px 0 4px;
  border-style: solid;
  border-color: var(--text-muted) transparent transparent transparent;
}

.crypto-filters__select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.25);
}

.crypto-filters__dir-btn {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: radial-gradient(circle at 30% 0, var(--accent-soft), transparent 60%),
  var(--bg-input);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
}

.crypto-filters__dir-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
  border-color: var(--border-strong);
}

/* сортировка только на мобиле */
@media (min-width: 768px) {
  .crypto-filters__sort-mobile {
    display: none;
  }
}
</style>
