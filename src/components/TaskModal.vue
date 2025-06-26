<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ task ? 'Edit Task' : 'Create New Task' }}
        </h2>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter task title"
          >
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            v-model="formData.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <!-- Priority and Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              v-model="formData.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <!-- Assignee and Due Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
            <select
              v-model="selectedAssigneeId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Unassigned</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              v-model="formData.dueDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(tag, index) in formData.tags"
              :key="index"
              class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(index)"
                class="text-primary-600 hover:text-primary-800"
              >
                <XMarkIcon class="h-3 w-3" />
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              type="text"
              placeholder="Add tag"
              @keyup.enter="addTag"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
            <button
              type="button"
              @click="addTag"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            {{ task ? 'Update Task' : 'Create Task' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import type { Task, User } from '../types';

const props = defineProps<{
  task?: Task;
  users: User[];
}>();

const emit = defineEmits<{
  save: [taskData: Partial<Task>];
  cancel: [];
}>();

const formData = ref({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  status: 'todo' as 'todo' | 'inprogress' | 'done',
  dueDate: '',
  tags: [] as string[]
});

const selectedAssigneeId = ref('');
const newTag = ref('');

const selectedAssignee = computed(() => {
  if (!selectedAssigneeId.value) return undefined;
  return props.users.find(user => user.id === selectedAssigneeId.value);
});

onMounted(() => {
  if (props.task) {
    formData.value = {
      title: props.task.title,
      description: props.task.description,
      priority: props.task.priority,
      status: props.task.status,
      dueDate: props.task.dueDate || '',
      tags: [...props.task.tags]
    };
    selectedAssigneeId.value = props.task.assignee?.id || '';
  }
});

const addTag = () => {
  if (newTag.value.trim() && !formData.value.tags.includes(newTag.value.trim())) {
    formData.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1);
};

const handleSubmit = () => {
  const taskData: Partial<Task> = {
    title: formData.value.title,
    description: formData.value.description,
    priority: formData.value.priority,
    status: formData.value.status,
    dueDate: formData.value.dueDate || undefined,
    assignee: selectedAssignee.value,
    tags: formData.value.tags
  };

  emit('save', taskData);
};
</script>