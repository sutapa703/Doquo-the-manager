<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 group">
    <!-- Task Header -->
    <div class="flex items-start justify-between mb-3">
      <h4 class="font-medium text-gray-900 line-clamp-2 flex-1 mr-2">{{ task.title }}</h4>
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click.stop="$emit('edit', task)"
          class="p-1 text-gray-400 hover:text-primary-600 transition-colors"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        <button
          @click.stop="$emit('delete', task.id)"
          class="p-1 text-gray-400 hover:text-red-600 transition-colors"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Task Description -->
    <p v-if="task.description" class="text-gray-600 text-sm mb-3 line-clamp-2">
      {{ task.description }}
    </p>

    <!-- Priority Badge -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span :class="getPriorityClass(task.priority)" class="px-2 py-1 rounded-full text-xs font-medium">
          {{ task.priority.charAt(0).toUpperCase() + task.priority.slice(1) }}
        </span>
        <span v-if="task.dueDate" class="text-xs text-gray-500">
          Due {{ formatDate(task.dueDate) }}
        </span>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="task.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Assignee and Comments -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
          <UserIcon class="h-4 w-4 text-gray-600" />
        </div>
        <span class="text-sm text-gray-600">{{ task.assignee?.name || 'Unassigned' }}</span>
      </div>
      
      <div v-if="task.comments.length > 0" class="flex items-center gap-1 text-gray-500">
        <ChatBubbleLeftIcon class="h-4 w-4" />
        <span class="text-xs">{{ task.comments.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon, UserIcon, ChatBubbleLeftIcon } from '@heroicons/vue/24/outline';
import type { Task } from '../types';

defineProps<{
  task: Task;
}>();

defineEmits<{
  edit: [task: Task];
  delete: [taskId: string];
}>();

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>