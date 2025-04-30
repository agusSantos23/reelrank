import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixedZero',
  standalone: true
})
export class ToFixedZeroPipe implements PipeTransform {
  transform(value: number | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    
    return value.toFixed(1);
  }
}