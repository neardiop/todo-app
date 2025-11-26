import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { PersonService } from '../../services/person.service';
import { Todo, Priority, Label } from '../../models/todo.model';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  showModal = false;
  selectedTodo: Todo | null = null;
  
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'edit', title: '<i class="fa fa-edit"></i>' },
        { name: 'delete', title: '<i class="fa fa-trash"></i>' }
      ]
    },
    columns: {
      title: { title: 'Titre' },
      person: { 
        title: 'Personne',
        valuePrepareFunction: (person: Person) => {
          return person ? person.name : '';
        }
      },
      startDate: { title: 'Date début' },
      endDate: { title: 'Date fin' },
      priority: { title: 'Priorité' },
      labels: { 
        title: 'Labels',
        valuePrepareFunction: (labels: Label[]) => {
          return labels ? labels.join(', ') : '';
        }
      }
    },
    pager: {
      perPage: 10
    }
  };

  constructor(
    private todoService: TodoService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(data => {
      this.todos = data;
    });
  }

  openModal(todo?: Todo): void {
    this.selectedTodo = todo || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTodo = null;
  }

  onSave(todo: Todo): void {
    if (todo.id) {
      this.todoService.updateTodo(todo.id, todo).subscribe(() => {
        this.loadTodos();
        this.closeModal();
      });
    } else {
      this.todoService.createTodo(todo).subscribe(() => {
        this.loadTodos();
        this.closeModal();
      });
    }
  }

  onCustomAction(event: any): void {
    if (event.action === 'edit') {
      this.openModal(event.data);
    } else if (event.action === 'delete') {
      if (confirm('Supprimer cette tâche ?')) {
        this.todoService.deleteTodo(event.data.id).subscribe(() => {
          this.loadTodos();
        });
      }
    }
  }
}
