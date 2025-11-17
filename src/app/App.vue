<template>
  <div class="app">
    <header class="app-header">
      <div class="app-header__inner">
        <div class="app-brand">
          <div class="app-logo">
            <span class="app-logo__dot"></span>
          </div>
          <div class="app-brand__texts">
            <h1 class="app-title">Crypto Dashboard</h1>
            <p class="app-subtitle">Coins • Markets • Insights</p>
          </div>
        </div>

        <div class="app-actions">
          <button
            type="button"
            class="theme-toggle"
            @click="toggleTheme"
          >
            <span
              class="theme-toggle__pill"
              :class="{ 'theme-toggle__pill--dark': currentTheme === 'dark' }"
            >
              <span class="theme-toggle__icon theme-toggle__icon--light">
                ☀️
              </span>
              <span class="theme-toggle__icon theme-toggle__icon--dark">
                🌙
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView } from 'vue-router';

type Theme = 'light' | 'dark';

function detectInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

const currentTheme = ref<Theme>(detectInitialTheme());

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
}

watch(
  currentTheme,
  (next) => {
    applyTheme(next);
  },
  { immediate: true },
);
</script>


<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* HEADER */

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(18px);
  background: linear-gradient(
    to right,
    rgba(79, 70, 229, 0.24),
    rgba(56, 189, 248, 0.18)
  ),
  rgba(15, 23, 42, 0.3);
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
}

:root[data-theme='light'] .app-header {
  background: linear-gradient(
    120deg,
    rgba(79, 70, 229, 0.12),
    rgba(56, 189, 248, 0.12)
  ),
  rgba(248, 250, 252, 0.92);
  border-bottom-color: rgba(199, 210, 254, 0.9);
}

.app-header__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.app-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-logo {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 20%, #facc15, #f97316 45%, transparent 55%),
  radial-gradient(circle at 70% 70%, #4f46e5, #06b6d4 55%, transparent 60%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-soft);
  flex-shrink: 0;
}

.app-logo__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(248, 250, 252, 0.45);
}

.app-brand__texts {
  display: flex;
  flex-direction: column;
  justify-content: center; /* центрируем обе строки относительно иконки */
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.app-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

/* THEME TOGGLE */

.app-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-toggle {
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.theme-toggle__pill {
  width: 70px;
  height: 30px;
  border-radius: 999px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  position: relative;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.theme-toggle__icon {
  font-size: 16px;
  opacity: 0.55;
  z-index: 2;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  width: 15px;
  height: 20px;
}

.theme-toggle__icon--light {
  margin-left: 4px;
}

.theme-toggle__icon--dark {
  margin-right: 4px;
}

.theme-toggle__pill::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: linear-gradient(135deg, #fefce8, #f97316);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.25);
  transition: transform 0.25s ease, background 0.25s ease;
}

:root[data-theme='dark'] .theme-toggle__pill::before {
  background: radial-gradient(circle at 30% 20%, #4f46e5, #0ea5e9);
}

.theme-toggle__pill--dark::before {
  transform: translateX(38px);
}

:root[data-theme='dark'] .theme-toggle__icon--dark {
  opacity: 0.95;
}

:root[data-theme='light'] .theme-toggle__icon--light {
  opacity: 0.95;
}

/* MAIN */

.app-main {
  flex: 1;
  max-width: 1120px;
  margin: 0 auto;
  padding: 18px 20px 24px;
}

/* Адаптив */
@media (max-width: 640px) {
  .app-header__inner {
    padding-inline: 14px;
  }

  .app-title {
    font-size: 16px;
  }

  .app-subtitle {
    font-size: 11px;
  }

  .app-main {
    padding-inline: 14px;
  }
}
</style>
