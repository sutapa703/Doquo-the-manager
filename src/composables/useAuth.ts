import { ref, computed } from 'vue';
import type { User } from '../types';

const currentUser = ref<User | null>(null);

const isAuthenticated = computed(() => currentUser.value !== null);

export function useAuth() {
  const login = (email: string, password: string) => {
    // Mock login - in real app, this would use Firebase Auth
    // For demo purposes, we'll create a user based on email
    const userName = email.split('@')[0]; // Extract name from email for demo
    currentUser.value = {
      id: '1',
      name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
      email: email
    };
  };

  const logout = () => {
    currentUser.value = null;
  };

  const signup = (name: string, email: string, password: string) => {
    // Mock signup - in real app, this would use Firebase Auth
    // Use the actual name provided by the user
    currentUser.value = {
      id: Date.now().toString(),
      name: name, // Use the actual input name
      email: email
    };
  };

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    signup
  };
}