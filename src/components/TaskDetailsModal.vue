<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Task Details</h2>
        <div class="flex items-center gap-2">
          <button
            @click="toggleEdit"
            class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
          >
            <PencilIcon class="h-5 w-5" />
          </button>
          <button
            @click="handleDelete"
            class="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
          <button
            @click="$emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Title -->
            <div>
              <h1 v-if="!isEditing" class="text-2xl font-bold text-gray-900 mb-2">
                {{ localTask.title }}
              </h1>
              <input
                v-else
                v-model="editData.title"
                class="text-2xl font-bold text-gray-900 mb-2 w-full border-b-2 border-primary-300 focus:border-primary-500 outline-none bg-transparent"
              >
            </div>

            <!-- Description -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p v-if="!isEditing" class="text-gray-700 whitespace-pre-wrap">
                {{ localTask.description || 'No description provided.' }}
              </p>
              <textarea
                v-else
                v-model="editData.description"
                rows="6"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter description..."
              ></textarea>
            </div>

            <!-- Comments Section -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Comments ({{ localTask.comments.length }})</h3>
              
              <!-- Add Comment -->
              <div class="mb-4">
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon class="h-4 w-4 text-gray-600" />
                  </div>
                  <div class="flex-1">
                    <textarea
                      v-model="newComment"
                      rows="3"
                      placeholder="Add a comment..."
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    ></textarea>
                    <div class="flex justify-end mt-2">
                      <button
                        @click="addComment"
                        :disabled="!newComment.trim()"
                        class="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Comments List -->
              <div class="space-y-4">
                <div
                  v-for="comment in localTask.comments"
                  :key="comment.id"
                  class="flex gap-3"
                >
                  <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon class="h-4 w-4 text-gray-600" />
                  </div>
                  <div class="flex-1">
                    <div class="bg-gray-50 rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-medium text-gray-900">{{ comment.author.name }}</span>
                        <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                      </div>
                      <p class="text-gray-700">{{ comment.text }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Status -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Status</h4>
              <select
                v-if="isEditing"
                v-model="editData.status"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <span
                v-else
                :class="getStatusClass(localTask.status)"
                class="inline-block px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ getStatusLabel(localTask.status) }}
              </span>
            </div>

            <!-- Priority -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Priority</h4>
              <select
                v-if="isEditing"
                v-model="editData.priority"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <span
                v-else
                :class="getPriorityClass(localTask.priority)"
                class="inline-block px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ localTask.priority.charAt(0).toUpperCase() + localTask.priority.slice(1) }}
              </span>
            </div>

            <!-- Assignee -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Assignee</h4>
              <select
                v-if="isEditing"
                v-model="selectedAssigneeId"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Unassigned</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
              <div v-else-if="localTask.assignee" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <UserIcon class="h-4 w-4 text-gray-600" />
                </div>
                <span class="text-gray-900">{{ localTask.assignee.name }}</span>
              </div>
              <span v-else class="text-gray-500">Unassigned</span>
            </div>

            <!-- Due Date -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Due Date</h4>
              <input
                v-if="isEditing"
                v-model="editData.dueDate"
                type="date"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
              <span v-else-if="localTask.dueDate" class="text-gray-900">
                {{ new Date(localTask.dueDate).toLocaleDateString() }}
              </span>
              <span v-else class="text-gray-500">No due date</span>
            </div>

            <!-- Tags -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Tags</h4>
              <div v-if="!isEditing" class="flex flex-wrap gap-1">
                <span
                  v-for="tag in localTask.tags"
                  :key="tag"
                  class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  {{ tag }}
                </span>
                <span v-if="localTask.tags.length === 0" class="text-gray-500">No tags</span>
              </div>
              <div v-else class="space-y-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(tag, index) in editData.tags"
                    :key="index"
                    class="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    {{ tag }}
                    <button
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
                    class="flex-1 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                  <button
                    @click="addTag"
                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <!-- Timestamps -->
            <div class="text-sm text-gray-500 space-y-1">
              <div>Created: {{ new Date(localTask.createdAt).toLocaleDateString() }}</div>
              <div>Updated: {{ new Date(localTask.updatedAt).toLocaleDateString() }}</div>
            </div>

            <!-- Edit Actions -->
            <div v-if="isEditing" class="flex gap-2">
              <button
                @click="saveChanges"
                class="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                @click="cancelEdit"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PencilIcon, TrashIcon, XMarkIcon, UserIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';
import { useTasks } from '../composables/useTasks';
import type { Task, User } from '../types';

const props = defineProps<{
  task: Task;
  users: User[];
}>();

const emit = defineEmits<{
  close: [];
  update: [taskId: string, updates: Partial<Task>];
  delete: [taskId: string];
}>();

const { currentUser } = useAuth();
const { addComment: addTaskComment } = useTasks();

const localTask = ref<Task>({ ...props.task });
const isEditing = ref(false);
const newComment = ref('');
const newTag = ref('');

const editData = ref({
  title: '',
  description: '',
  status: 'todo' as 'todo' | 'inprogress' | 'done',
  priority: 'medium' as 'low' | 'medium' | 'high',
  dueDate: '',
  tags: [] as string[]
});

const selectedAssigneeId = ref('');

const selectedAssignee = computed(() => {
  if (!selectedAssigneeId.value) return undefined;
  return props.users.find(user => user.id === selectedAssigneeId.value);
});

onMounted(() => {
  resetEditData();
});

const resetEditData = () => {
  editData.value = {
    title: localTask.value.title,
    description: localTask.value.description,
    status: localTask.value.status,
    priority: localTask.value.priority,
    dueDate: localTask.value.dueDate || '',
    tags: [...localTask.value.tags]
  };
  selectedAssigneeId.value = localTask.value.assignee?.id || '';
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    resetEditData();
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  resetEditData();
};

const saveChanges = () => {
  const updates: Partial<Task> = {
    title: editData.value.title,
    description: editData.value.description,
    status: editData.value.status,
    priority: editData.value.priority,
    dueDate: editData.value.dueDate || undefined,
    assignee: selectedAssignee.value,
    tags: editData.value.tags
  };

  // Update local task
  Object.assign(localTask.value, updates);
  
  // Emit update
  emit('update', localTask.value.id, updates);
  
  isEditing.value = false;
};

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', localTask.value.id);
  }
};

const addComment = () => {
  if (!newComment.value.trim() || !currentUser.value) return;
  
  addTaskComment(localTask.value.id, newComment.value.trim(), currentUser.value);
  
  // Update local task comments
  const comment = {
    id: Date.now().toString(),
    text: newComment.value.trim(),
    author: currentUser.value,
    createdAt: new Date().toISOString()
  };
  
  localTask.value.comments.push(comment);
  newComment.value = '';
};

const addTag = () => {
  if (newTag.value.trim() && !editData.value.tags.includes(newTag.value.trim())) {
    editData.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  editData.value.tags.splice(index, 1);
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'todo': return 'bg-red-100 text-red-800';
    case 'inprogress': return 'bg-yellow-100 text-yellow-800';
    case 'done': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'todo': return 'To Do';
    case 'inprogress': return 'In Progress';
    case 'done': return 'Done';
    default: return status;
  }
};

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
  const diffTime = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};
</script>