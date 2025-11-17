<template>
  <section class="not-found-page">
    <h2 class="not-found-title">Страница не найдена</h2>
    <p class="not-found-text">
      Кажется, вы перешли по некорректной ссылке.
    </p>
    <RouterLink to="/" class="not-found-link">
      Вернуться на дашборд
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.not-found-title {
  font-size: 18px;
  font-weight: 600;
}

.not-found-text {
  font-size: 14px;
  color: #6b7280;
}

.not-found-link {
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
