import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetimeFormat'
})
export class DatetimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const [datePart, timePart] = value.split('T');
    const formattedDate = datePart;
    const formattedTime = timePart.substring(0, 8); // Extract HH:mm:ss part
    return `${formattedDate} | ${formattedTime}`;
  }
}
