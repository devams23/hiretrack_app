import { Pipe, PipeTransform } from '@angular/core';

/**
 * JobCountPipe
 * Displays a job count with a configurable cap.
 * If count exceeds `max`, shows "{max}+" instead.
 *
 * @param value  The raw count number
 * @param max    The threshold (default: 99). Counts above this display as "{max}+"
 *
 * Usage:
 *   {{ column.job_applications.length | jobCount }}          → "5"
 *   {{ column.job_applications.length | jobCount: 9 }}       → "9+" when count > 9
 *   {{ column.job_applications.length | jobCount: 99 }}      → "99+" when count > 99
 */
@Pipe({
  name: 'jobCount',
  standalone: true,
})
export class JobCountPipe implements PipeTransform {
  transform(value: number, max: number = 99): string {
    if (value == null || isNaN(value)) return '0';
    return value > max ? `${max}+` : `${value}`;
  }
}
