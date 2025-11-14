import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'runTime'
})
export class RunTimePipe implements PipeTransform {
  transform(value: any): string {
    if (value && value !== '-') {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0'); 
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear() + 543;
      return `${day}/${month}/${year}`;
    } else {
      return '-';
    }
  }
}
