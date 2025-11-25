export enum Priority {
  Facile = 'Facile',
  Moyen = 'Moyen',
  Difficile = 'Difficile'
}

export enum Label {
  HTML = 'HTML',
  CSS = 'CSS',
  NODE_JS = 'NODE_JS',
  JQUERY = 'JQUERY'
}

export interface Todo {
  id?: number;
  title: string;
  person: Person;
  startDate: Date;
  endDate?: Date;
  priority: Priority;
  labels: Label[];
  description: string;
}

export interface Person {
  id?: number;
  name: string;
  email: string;
  phone: string;
}
