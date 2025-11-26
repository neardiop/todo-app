import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.css']
})
export class PersonModalComponent implements OnInit {
  @Input() person: Person | null = null;
  @Output() save = new EventEmitter<Person>();
  @Output() close = new EventEmitter<void>();

  personForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit(): void {
    if (this.person) {
      this.personForm.patchValue({
        name: this.person.name,
        email: this.person.email,
        phone: this.person.phone
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    
    Object.keys(this.personForm.controls).forEach(key => {
      this.personForm.get(key)?.markAsTouched();
    });
    
    if (!this.personForm.valid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }
    
    const person: Person = {
      ...this.person,
      name: this.personForm.value.name,
      email: this.personForm.value.email,
      phone: this.personForm.value.phone
    };
    this.save.emit(person);
  }

  onClose(): void {
    this.close.emit();
  }
}
