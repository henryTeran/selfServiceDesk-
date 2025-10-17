import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
  standalone: true
})
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined, currency: string = 'CHF'): string {
    if (value === null || value === undefined || isNaN(value)) return '-';

    const formatted = value.toLocaleString('fr-CH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${formatted} ${currency}`;
  }
}
