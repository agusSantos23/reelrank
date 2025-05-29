import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | undefined, format: 'day' | 'month' | 'year' | 'complete'): string | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear().toString();

    switch (format) {
      case 'day':
        return day;
      case 'month':
        return month;
      case 'year':
        return year;
      case 'complete':
        return `${year}-${month}-${day}`;
      default:
        return `${year}-${month}-${day} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
  }
}