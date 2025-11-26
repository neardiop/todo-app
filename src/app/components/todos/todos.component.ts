import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { PersonService } from '../../services/person.service';
import { Todo, Priority, Label } from '../../models/todo.model';
import { Person } from '../../models/person.model';
import { TranslocoService } from '@ngneat/transloco';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  showModal = false;
  selectedTodo: Todo | null = null;
  persons: Person[] = [];
  settings: any;
  
  defaultSettings = {
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
    private personService: PersonService,
    private translocoService: TranslocoService,
    private exportService: ExportService
  ) {
    this.translocoService.langChanges$.subscribe(() => {
      this.updateTableSettings();
    });
  }

  ngOnInit(): void {
    this.translocoService.load(this.translocoService.getActiveLang()).subscribe(() => {
      this.updateTableSettings();
      this.loadTodos();
    });
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(data => {
      this.todos = data;
    });
  }

  updateTableSettings(): void {
    this.settings = {
      actions: {
        add: false,
        edit: false,
        delete: false,
        custom: [
          { name: 'edit', title: '<i class="material-icons">edit</i>' },
          { name: 'delete', title: '<i class="material-icons">delete</i>' }
        ]
      },
      columns: {
        title: { title: this.translocoService.translate('tasks.columns.title') },
        person: { 
          title: this.translocoService.translate('tasks.columns.person'),
          valuePrepareFunction: (person: Person) => {
            return person ? person.name : '';
          }
        },
        startDate: { title: this.translocoService.translate('tasks.columns.startDate') },
        endDate: { title: this.translocoService.translate('tasks.columns.endDate') },
        priority: { title: this.translocoService.translate('tasks.columns.priority') },
        labels: { 
          title: this.translocoService.translate('tasks.columns.labels'),
          valuePrepareFunction: (labels: Label[]) => {
            return labels ? labels.join(', ') : '';
          }
        }
      },
      pager: {
        perPage: 10
      }
    };
    
    if (this.todos.length > 0) {
      const temp = [...this.todos];
      this.todos = [];
      setTimeout(() => {
        this.todos = temp;
      }, 0);
    }
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
      if (confirm(this.translocoService.translate('tasks.deleteConfirm'))) {
        this.todoService.deleteTodo(event.data.id).subscribe(() => {
          this.loadTodos();
        });
      }
    }
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.todos, 'taches');
  }

  exportToPDF(): void {
    this.exportService.exportToPDF(this.todos, 'taches');
  }
}
