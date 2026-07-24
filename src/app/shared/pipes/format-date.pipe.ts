import { Pipe, PipeTransform } from '@angular/core';
import { toGermanDate } from '../utils/date.util';

/** 'YYYY-MM-DD' → 'DD.MM.YYYY' */
@Pipe({ name: 'formatDate', standalone: true })
export class FormatDatePipe implements PipeTransform {
  transform(value: string): string {
    return toGermanDate(value);
  }
}
