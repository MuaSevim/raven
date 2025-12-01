export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'raven' | 'scribe';
  createdAt: Date;
  updatedAt: Date;
}

export interface RavenProfile extends User {
  role: 'raven';
  bio?: string;
  skills?: string[];
  rating?: number;
  completedTasks?: number;
}

export interface ScribeProfile extends User {
  role: 'scribe';
  company?: string;
  preferences?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  scribeId: string;
  ravenId?: string;
  status: 'open' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  budget: number;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  channelId: string;
  createdAt: Date;
}
