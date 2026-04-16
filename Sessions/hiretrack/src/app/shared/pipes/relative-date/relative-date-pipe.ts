import { Pipe, PipeTransform } from '@angular/core';

/**
 * RelativeDatePipe
 * Transforms a date string/Date into a human-readable relative string.
 * Examples: "just now", "3 mins ago", "2 hours ago", "yesterday", "4 days ago", "3 months ago"
 */
@Pipe({
  name: 'relativeDate',
  standalone: true,
})
export class RelativeDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '—';

    const date = value instanceof Date ? value : new Date(value);
    //console.log(date);
    const now = new Date();
    if(date > now){
      return date.toDateString();
    }
      
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return diffMins === 1 ? '1 min ago' : `${diffMins} mins ago`;
    if (diffHours < 24) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffWeeks === 1) return '1 week ago';
    if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    if (diffYears === 1) return '1 year ago';
    return `${diffYears} years ago`;
  }
}
