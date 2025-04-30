import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';
import { LOCALE_ID, Inject } from '@angular/core';

@Pipe({
  name: 'formatLargeNumber'
})
export class FormatLargeNumberPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: number | string | undefined): string {
    if (value === null || value === undefined) return '-';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) return '-';
    
    return formatNumber(num, this.locale, '1.0-0');
  }
}