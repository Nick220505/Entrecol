import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empty',
  standalone: true,
})
export class EmptyPipe implements PipeTransform {
  transform(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return String(value);
  }
}
