<template>
  <div class="ranking-board">
    <div class="table-wrapper">
      <table class="ranking-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>이름</th>
            <th>스테이지</th>
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
            <td class="stage-col">{{ record.stage }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
  margin-top: 0;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  min-height: 0;
  margin-bottom: env(safe-area-inset-bottom);
}

.table-wrapper {
  width: 100%;
  overflow-y: auto;
  flex-grow: 1;
  min-height: 0;
  padding: 20px 24px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Retro cartoon scrollbar styles */
.table-wrapper::-webkit-scrollbar {
  width: 10px;
}
.table-wrapper::-webkit-scrollbar-track {
  background: #fdfaf2;
  border-left: 3px solid #000;
}
.table-wrapper::-webkit-scrollbar-thumb {
  background: #ffa502;
  border: 3px solid #000;
  border-radius: 6px;
}

@media (max-width: 600px) {
  .ranking-board {
    margin-bottom: env(safe-area-inset-bottom);
  }
  .table-wrapper {
    padding: 12px 12px 12px 8px;
  }
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 1.1rem;
}

@media (max-width: 600px) {
  .ranking-table {
    font-size: 1rem;
  }
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
  background: #ffffff;
  color: var(--text-dark);
}

@media (max-width: 600px) {
  .ranking-table th {
    padding: 10px 4px;
  }
  .ranking-table td {
    padding: 14px 4px;
  }
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
  font-weight: bold;
}
.my-record td {
  background: #fff9db;
  border-bottom: 2px dashed #f39c12;
}
</style>
