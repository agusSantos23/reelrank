import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'formatLargeNumber',
})
export class FormatLargeNumberPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: number | string | undefined | null): string { 
    if (value === null || value === undefined) return '-';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) return '-';
    
    return formatNumber(num, this.locale, '1.0-0');
  }
}