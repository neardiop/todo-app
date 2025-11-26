import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Todo } from '../models/todo.model';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private translocoService: TranslocoService) {}

  exportToExcel(todos: Todo[], filename: string = 'taches'): void {
    const data = todos.map(todo => ({
      [this.translocoService.translate('tasks.columns.title')]: todo.title,
      [this.translocoService.translate('tasks.columns.person')]: todo.person.name,
      [this.translocoService.translate('tasks.columns.startDate')]: todo.startDate,
      [this.translocoService.translate('tasks.columns.endDate')]: todo.endDate || '',
      [this.translocoService.translate('tasks.columns.priority')]: todo.priority,
      [this.translocoService.translate('tasks.columns.labels')]: todo.labels.join(', '),
      [this.translocoService.translate('taskModal.fields.description')]: todo.description
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.translocoService.translate('tasks.title'));
    
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  exportToPDF(todos: Todo[], filename: string = 'taches'): void {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(this.translocoService.translate('tasks.title'), 14, 22);
    
    const tableData = todos.map(todo => [
      todo.title,
      todo.person.name,
      todo.startDate.toString(),
      todo.endDate ? todo.endDate.toString() : '',
      todo.priority,
      todo.labels.join(', ')
    ]);

    (doc as any).autoTable({
      head: [[
        this.translocoService.translate('tasks.columns.title'),
        this.translocoService.translate('tasks.columns.person'),
        this.translocoService.translate('tasks.columns.startDate'),
        this.translocoService.translate('tasks.columns.endDate'),
        this.translocoService.translate('tasks.columns.priority'),
        this.translocoService.translate('tasks.columns.labels')
      ]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [63, 81, 181] }
    });

    doc.save(`${filename}.pdf`);
  }
}
