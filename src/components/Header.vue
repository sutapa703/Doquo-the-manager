<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">TM</span>
          </div>
          <h1 class="text-xl font-bold text-gray-900">TaskManager</h1>
        </div>

        <!-- User Menu -->
        <div v-if="currentUser" class="flex items-center gap-4">
          <div class="hidden sm:block text-right">
            <p class="text-sm font-medium text-gray-900">{{ currentUser.name }}</p>
            <p class="text-xs text-gray-500">{{ currentUser.email }}</p>
          </div>
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon class="h-5 w-5 text-gray-600" />
              </div>
              <ChevronDownIcon class="h-4 w-4 text-gray-500" />
            </button>

            <!-- User Dropdown -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { UserIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';

const { currentUser, logout } = useAuth();

const showUserMenu = ref(false);

const handleLogout = () => {
  logout();
  showUserMenu.value = false;
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>