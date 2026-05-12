// pipes/format-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate', standalone: true })
export class FormatDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    return `${day}.${month}.${year}`;  // → 'DD.MM.YYYY'
  }
}
