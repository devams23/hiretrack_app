import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * SearchService — singleton that bridges the header search bar (in Layout)
 * with the Kanban board view. The layout writes to `searchQuery$`, the
 * board view reads `filteredQuery` signal after debounce.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  /** Raw input stream — layout pushes here on every keystroke */
  readonly searchInput$ = new Subject<string>();

  /** Debounced, deduplicated query — board view reads this signal */
  readonly filteredQuery = signal<string>('');

  constructor() {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((query) => {
        this.filteredQuery.set(query.trim().toLowerCase());
      });
  }

  /** Called by layout on input event */
  push(value: string) {
    this.searchInput$.next(value);
  }

  /** Clear the search (e.g. on route change) */
  clear() {
    this.searchInput$.next('');
    this.filteredQuery.set('');
  }
}
