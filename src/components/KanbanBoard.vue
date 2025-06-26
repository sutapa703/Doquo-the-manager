<template>
  <div class="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 p-4 md:p-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Project Board</h1>
          <p class="text-gray-600 mt-1">Manage your team's tasks efficiently</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tasks..."
              class="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
            <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            @click="showCreateModal = true"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <PlusIcon class="h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="flex-1 overflow-hidden">
      <div class="h-full overflow-x-auto">
        <div class="flex gap-4 md:gap-6 p-4 md:p-6 min-w-max h-full">
          <div
            v-for="column in filteredColumns"
            :key="column.id"
            class="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col"
          >
            <!-- Column Header -->
            <div class="p-4 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div :class="getColumnBadgeClass(column.status)" class="w-3 h-3 rounded-full"></div>
                  <h3 class="font-semibold text-gray-900">{{ column.title }}</h3>
                  <span class="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full font-medium">
                    {{ column.tasks.length }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Tasks Container -->
            <div class="flex-1 p-4 overflow-y-auto">
              <draggable
                v-model="column.tasks"
                :group="{ name: 'tasks', pull: true, put: true }"
                item-key="id"
                @end="onTaskMove"
                class="space-y-3 min-h-[200px]"
              >
                <template #item="{ element: task }">
                  <TaskCard
                    :task="task"
                    @edit="editTask"
                    @delete="deleteTask"
                    @click="openTaskDetails(task)"
                    class="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  />
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Task Modal -->
    <TaskModal
      v-if="showCreateModal || editingTask"
      :task="editingTask"
      :users="users"
      @save="handleTaskSave"
      @cancel="cancelTaskEdit"
    />

    <!-- Task Details Modal -->
    <TaskDetailsModal
      v-if="selectedTask"
      :task="selectedTask"
      :users="users"
      @close="selectedTask = null"
      @update="handleTaskUpdate"
      @delete="handleTaskDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import draggable from 'vuedraggable';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useTasks } from '../composables/useTasks';
import TaskCard from './TaskCard.vue';
import TaskModal from './TaskModal.vue';
import TaskDetailsModal from './TaskDetailsModal.vue';
import type { Task } from '../types';

const { columns, users, createTask, updateTask, deleteTask: removeTask, moveTask } = useTasks();

const searchQuery = ref('');
const showCreateModal = ref(false);
const editingTask = ref<Task | null>(null);
const selectedTask = ref<Task | null>(null);

const filteredColumns = computed(() => {
  if (!searchQuery.value) return columns.value;
  
  return columns.value.map(column => ({
    ...column,
    tasks: column.tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }));
});

const getColumnBadgeClass = (status: string) => {
  switch (status) {
    case 'todo': return 'bg-red-400';
    case 'inprogress': return 'bg-yellow-400';
    case 'done': return 'bg-green-400';
    default: return 'bg-gray-400';
  }
};

const editTask = (task: Task) => {
  editingTask.value = task;
};

const handleTaskSave = (taskData: Partial<Task>) => {
  if (editingTask.value) {
    updateTask(editingTask.value.id, taskData);
    editingTask.value = null;
  } else {
    createTask(taskData);
    showCreateModal.value = false;
  }
};

const cancelTaskEdit = () => {
  editingTask.value = null;
  showCreateModal.value = false;
};

const openTaskDetails = (task: Task) => {
  selectedTask.value = task;
};

const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
  updateTask(taskId, updates);
  // Update selectedTask if it's the same task
  if (selectedTask.value && selectedTask.value.id === taskId) {
    selectedTask.value = { ...selectedTask.value, ...updates };
  }
};

const handleTaskDelete = (taskId: string) => {
  removeTask(taskId);
  selectedTask.value = null;
};

const onTaskMove = (evt: any) => {
  if (evt.to && evt.from) {
    const taskId = evt.item._underlying_vm_.id;
    const newStatus = evt.to.closest('[data-column]')?.dataset.column || 'todo';
    const newOrder = evt.newIndex;
    
    moveTask(taskId, newStatus as any, newOrder);
  }
};
</script>