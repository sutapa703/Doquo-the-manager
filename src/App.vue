<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <AuthModal />
    </div>
    
    <div v-else class="min-h-screen flex flex-col">
      <Header />
      <main class="flex-1 overflow-hidden">
        <KanbanBoard />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from './composables/useAuth';
import Header from './components/Header.vue';
import AuthModal from './components/AuthModal.vue';
import KanbanBoard from './components/KanbanBoard.vue';

const { isAuthenticated } = useAuth();
</script>