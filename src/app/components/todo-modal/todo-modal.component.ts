import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo, Priority, Label } from '../../models/todo.model';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  filteredPersons: Observable<Person[]>;
  priorities = Object.values(Priority);
  labels = Object.values(Label);
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private personService: PersonService
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      person: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      priority: ['', Validators.required],
      labels: [[], Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
    
    this.filteredPersons = this.todoForm.get('person')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPersons(value))
    );
  }

  ngOnInit(): void {
    this.loadPersons();
    if (this.todo) {
      this.todoForm.patchValue({
        title: this.todo.title,
        person: this.todo.person,
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

  private _filterPersons(value: any): Person[] {
    if (!value) {
      return this.persons;
    }
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name?.toLowerCase() || '';
    return this.persons.filter(person => 
      person.name.toLowerCase().includes(filterValue)
    );
  }

  displayPerson(person: Person): string {
    return person ? person.name : '';
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
    this.errorMessage = '';
    
    Object.keys(this.todoForm.controls).forEach(key => {
      this.todoForm.get(key)?.markAsTouched();
    });
    
    if (!this.todoForm.valid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement';
      return;
    }

    const formValue = this.todoForm.value;
    const person = formValue.person;
    
    if (!person || typeof person === 'string') {
      this.errorMessage = 'Veuillez sélectionner une personne valide dans la liste';
      return;
    }

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
  }

  onClose(): void {
    this.close.emit();
  }
}
