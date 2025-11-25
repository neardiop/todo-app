import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodosComponent } from './components/todos/todos.component';
import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { PersonsComponent } from './components/persons/persons.component';
import { PersonModalComponent } from './components/person-modal/person-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    TodosComponent,
    TodoModalComponent,
    PersonsComponent,
    PersonModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
