import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo-app';

  constructor(public translocoService: TranslocoService) {}

  changeLanguage(lang: string): void {
    this.translocoService.setActiveLang(lang);
  }
}
