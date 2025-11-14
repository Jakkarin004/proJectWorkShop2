import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ageDate'
})
export class AgeDatePipe implements PipeTransform {

  transform(value: string | Date): number {
    if (!value) return 0;

    let birthDate: Date;
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        birthDate = new Date(year, month, day);
      } else {
        birthDate = new Date(value);
      }
    } else {
      birthDate = value;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 0) {
      age = 0;
    }
    return age;
  }
}
