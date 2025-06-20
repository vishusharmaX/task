export type Priority = 'high' | 'medium' | 'low';

export interface Card {
  id: string;
  title: string;
  description: string;
  creator: string;
  priority: Priority;
  dueDate: string;
  assignee: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}
