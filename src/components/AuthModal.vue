<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
      <div class="p-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ isLogin ? 'Welcome Back' : 'Create Account' }}
          </h2>
          <p class="text-gray-600">
            {{ isLogin ? 'Sign in to your account' : 'Sign up to get started' }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="!isLogin">
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              v-model="formData.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your password"
            >
          </div>

          <button
            type="submit"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            {{ isLogin ? 'Sign In' : 'Sign Up' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <button
            @click="isLogin = !isLogin"
            class="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {{ isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const { login, signup } = useAuth();

const isLogin = ref(true);
const formData = ref({
  name: '',
  email: '',
  password: ''
});

const handleSubmit = () => {
  if (isLogin.value) {
    login(formData.value.email, formData.value.password);
  } else {
    signup(formData.value.name, formData.value.email, formData.value.password);
  }
};
</script>