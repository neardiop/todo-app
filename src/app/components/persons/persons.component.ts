import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {
  persons: Person[] = [];
  showModal = false;
  selectedPerson: Person | null = null;
  
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
      name: { title: 'Nom' },
      email: { title: 'Email' },
      phone: { title: 'Téléphone' }
    },
    pager: {
      perPage: 10
    }
  };

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService.getPersons().subscribe(data => {
      this.persons = data;
    });
  }

  openModal(person?: Person): void {
    this.selectedPerson = person || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPerson = null;
  }

  onSave(person: Person): void {
    if (person.id) {
      this.personService.updatePerson(person.id, person).subscribe(() => {
        this.loadPersons();
        this.closeModal();
      });
    } else {
      this.personService.createPerson(person).subscribe(() => {
        this.loadPersons();
        this.closeModal();
      });
    }
  }

  onCustomAction(event: any): void {
    if (event.action === 'edit') {
      this.openModal(event.data);
    } else if (event.action === 'delete') {
      if (confirm('Supprimer cette personne ?')) {
        this.personService.deletePerson(event.data.id).subscribe(() => {
          this.loadPersons();
        });
      }
    }
  }
}
