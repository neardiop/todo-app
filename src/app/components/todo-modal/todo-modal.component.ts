import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo, Priority, Label } from '../../models/todo.model';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-todo-modal',
  templateUrl: './todo-modal.component.html',
  styleUrls: ['./todo-modal.component.css']
})
export class TodoModalComponent implements OnInit {
  @Input() todo: Todo | null = null;
  @Output() save = new EventEmitter<Todo>();
  @Output() close = new EventEmitter<void>();

  todoForm: FormGroup;
  persons: Person[] = [];
  priorities = Object.values(Priority);
  labels = Object.values(Label);
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private personService: PersonService
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      personId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      priority: ['', Validators.required],
      labels: [[], Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadPersons();
    if (this.todo) {
      this.todoForm.patchValue({
        title: this.todo.title,
        personId: this.todo.person.id,
        startDate: this.todo.startDate,
        endDate: this.todo.endDate,
        priority: this.todo.priority,
        labels: this.todo.labels,
        description: this.todo.description
      });
    }
  }

  loadPersons(): void {
    this.personService.getPersons().subscribe(data => {
      this.persons = data;
    });
  }

  onLabelChange(label: Label, event: any): void {
    const labels = this.todoForm.get('labels')?.value || [];
    if (event.target.checked) {
      labels.push(label);
    } else {
      const index = labels.indexOf(label);
      if (index > -1) {
        labels.splice(index, 1);
      }
    }
    this.todoForm.patchValue({ labels });
  }

  isLabelChecked(label: Label): boolean {
    const labels = this.todoForm.get('labels')?.value || [];
    return labels.includes(label);
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const personId = this.todoForm.value.personId;
      const person = this.persons.find(p => p.id === +personId);
      
      if (!person) {
        this.errorMessage = 'Personne invalide';
        return;
      }

      const formValue = this.todoForm.value;
      const endDate = formValue.endDate || undefined;
      
      if (endDate && new Date(endDate) < new Date(formValue.startDate)) {
        this.errorMessage = 'La date de fin doit être après la date de début';
        return;
      }

      const todo: Todo = {
        ...this.todo,
        title: formValue.title,
        person: person,
        startDate: formValue.startDate,
        endDate: endDate,
        priority: formValue.priority,
        labels: formValue.labels,
        description: formValue.description
      };

      this.save.emit(todo);
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
