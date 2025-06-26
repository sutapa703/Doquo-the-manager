export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  comments: Comment[];
  order: number;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
  tasks: Task[];
  color: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  columns: Column[];
  members: User[];
  createdAt: string;
}