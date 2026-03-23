import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailFormat',
  standalone: true
})

export class EmailFormatPipe implements PipeTransform {

  transform(value: string): string {

    if (!value) return '';

    // quitar espacios
    value = value.trim();

    // convertir a minúsculas
    return value.toLowerCase();

  }

}

