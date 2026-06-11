<template>
  <div class="ranking-board retro-box">
    <h2 class="ranking-title">🏆 명예의 전당</h2>
    <table class="ranking-table">
      <thead>
        <tr>
          <th>순위</th>
          <th>이름</th>
          <th>달성 스테이지</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(record, index) in rankings" 
          :key="index"
          :class="{ 'my-record': record.id === '나의햄스터' }"
        >
          <td class="rank-col">
            <span v-if="index === 0">🥇</span>
            <span v-else-if="index === 1">🥈</span>
            <span v-else-if="index === 2">🥉</span>
            <span v-else>{{ index + 1 }}등</span>
          </td>
          <td class="name-col">{{ record.id }}</td>
          <td class="stage-col">{{ record.stage }} 스테이지</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { RankingRecord } from '../composables/useGameState'

defineProps<{
  rankings: RankingRecord[]
}>()
</script>

<style scoped>
.ranking-board {
  margin-top: 10px;
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  padding: 20px;
}

.ranking-title {
  text-align: center;
  font-size: 1.6rem;
  color: #f39c12;
  margin-bottom: 15px;
  text-shadow: 1px 1px 0 #000;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 1.1rem;
}

.ranking-table th {
  background: #fdfaf2;
  padding: 10px;
  border-bottom: 3px solid #000;
  color: var(--text-dark);
  font-weight: bold;
}

.ranking-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  color: var(--text-dark);
}

.ranking-table tr:last-child td {
  border-bottom: none;
}

.rank-col {
  width: 20%;
  font-weight: bold;
}

.name-col {
  width: 50%;
}

.stage-col {
  width: 30%;
  color: #d35400;
  font-weight: bold;
}

.my-record {
  background-color: #fff9db;
  font-weight: bold;
}
.my-record td {
  border-bottom: 2px dashed #f39c12;
}
</style>
