import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToDecimal',
  standalone: true
})
export class ConvertToDecimalPipe implements PipeTransform {

  transform(value: number | null | undefined): string | null {
    
    if (value === null || value === undefined) return null;

    const valueAsString = String(value);
    if (valueAsString.length <= 1) {
      return '0.' + valueAsString;

    } else {
      const integerPart = valueAsString.slice(0, -1);
      const decimalPart = valueAsString.slice(-1);
      return `${integerPart}.${decimalPart}`;

    }
  }
}