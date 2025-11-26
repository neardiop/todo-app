import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';
import { TranslocoService } from '@ngneat/transloco';

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

  constructor(
    private personService: PersonService,
    private translocoService: TranslocoService
  ) {
    this.translocoService.langChanges$.subscribe(() => {
      this.updateTableSettings();
    });
  }

  ngOnInit(): void {
    this.translocoService.load(this.translocoService.getActiveLang()).subscribe(() => {
      this.updateTableSettings();
      this.loadPersons();
    });
  }

  loadPersons(): void {
    this.personService.getPersons().subscribe(data => {
      this.persons = data;
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
        name: { title: this.translocoService.translate('persons.columns.name') },
        email: { title: this.translocoService.translate('persons.columns.email') },
        phone: { title: this.translocoService.translate('persons.columns.phone') }
      },
      pager: {
        perPage: 10
      }
    };
    
    if (this.persons.length > 0) {
      const temp = [...this.persons];
      this.persons = [];
      setTimeout(() => {
        this.persons = temp;
      }, 0);
    }
  }

  openModal(person?: Person): void{
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
      if (confirm(this.translocoService.translate('persons.deleteConfirm'))) {
        this.personService.deletePerson(event.data.id).subscribe(() => {
          this.loadPersons();
        });
      }
    }
  }
}
