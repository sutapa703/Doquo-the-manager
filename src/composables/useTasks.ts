import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Column, User, Comment } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    email: 'arjun@example.com'
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com'
  },
  {
    id: '3',
    name: 'Rahul Singh',
    email: 'rahul@example.com'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design Homepage',
    description: 'Create wireframes and mockups for the new homepage design',
    status: 'todo',
    priority: 'high',
    assignee: mockUsers[0],
    dueDate: '2024-01-20',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    tags: ['design', 'ui/ux'],
    comments: [],
    order: 0
  },
  {
    id: '2',
    title: 'Implement Authentication',
    description: 'Set up user authentication with Firebase',
    status: 'inprogress',
    priority: 'high',
    assignee: mockUsers[1],
    dueDate: '2024-01-18',
    createdAt: '2024-01-09T14:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    tags: ['backend', 'security'],
    comments: [
      {
        id: '1',
        text: 'Started working on the authentication flow',
        author: mockUsers[1],
        createdAt: '2024-01-12T09:00:00Z'
      }
    ],
    order: 0
  },
  {
    id: '3',
    title: 'Database Schema',
    description: 'Define the database structure for tasks and users',
    status: 'done',
    priority: 'medium',
    assignee: mockUsers[2],
    dueDate: '2024-01-15',
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-01-13T11:00:00Z',
    tags: ['database', 'backend'],
    comments: [],
    order: 0
  },
  {
    id: '4',
    title: 'Mobile Responsiveness',
    description: 'Ensure the app works well on mobile devices',
    status: 'todo',
    priority: 'medium',
    assignee: mockUsers[0],
    dueDate: '2024-01-25',
    createdAt: '2024-01-11T12:00:00Z',
    updatedAt: '2024-01-11T12:00:00Z',
    tags: ['frontend', 'responsive'],
    comments: [],
    order: 1
  },
  {
    id: '5',
    title: 'Write Tests',
    description: 'Add unit tests for critical components',
    status: 'inprogress',
    priority: 'low',
    assignee: mockUsers[2],
    dueDate: '2024-01-30',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-13T15:00:00Z',
    tags: ['testing', 'quality'],
    comments: [],
    order: 1
  }
];

const tasks = ref<Task[]>(mockTasks);
const users = ref<User[]>(mockUsers);

export function useTasks() {
  const columns = computed<Column[]>(() => [
    {
      id: 'todo',
      title: 'To Do',
      status: 'todo',
      tasks: tasks.value.filter(task => task.status === 'todo').sort((a, b) => a.order - b.order),
      color: 'bg-red-100 border-red-200'
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      status: 'inprogress',
      tasks: tasks.value.filter(task => task.status === 'inprogress').sort((a, b) => a.order - b.order),
      color: 'bg-yellow-100 border-yellow-200'
    },
    {
      id: 'done',
      title: 'Done',
      status: 'done',
      tasks: tasks.value.filter(task => task.status === 'done').sort((a, b) => a.order - b.order),
      color: 'bg-green-100 border-green-200'
    }
  ]);

  const createTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: taskData.tags || [],
      comments: [],
      order: tasks.value.filter(t => t.status === (taskData.status || 'todo')).length
    };
    tasks.value.push(newTask);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = {
        ...tasks.value[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
  };

  const deleteTask = (taskId: string) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1);
    }
  };

  const moveTask = (taskId: string, newStatus: 'todo' | 'inprogress' | 'done', newOrder: number) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      task.order = newOrder;
      task.updatedAt = new Date().toISOString();
      
      // Reorder other tasks in the same column
      tasks.value
        .filter(t => t.status === newStatus && t.id !== taskId)
        .forEach((t, index) => {
          if (index >= newOrder) {
            t.order = index + 1;
          }
        });
    }
  };

  const addComment = (taskId: string, text: string, author: User) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      const comment: Comment = {
        id: uuidv4(),
        text,
        author,
        createdAt: new Date().toISOString()
      };
      task.comments.push(comment);
      task.updatedAt = new Date().toISOString();
    }
  };

  return {
    tasks,
    columns,
    users,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    addComment
  };
}