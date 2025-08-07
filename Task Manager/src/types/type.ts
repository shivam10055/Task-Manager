export type Status = 'todo'| 'inprogress' | 'done';
export type Priority = 'low'|'high'|'medium';

export interface Task{
    id:number,
    title:string,
    desc:string,
    status:Status,
    priority:Priority
}

export interface Column {
  name: string;
  items: Task[];
}