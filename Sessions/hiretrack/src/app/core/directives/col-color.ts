import { Directive, Input, HostBinding, OnChanges } from '@angular/core';

@Directive({
  selector: '[appColColor]',
  standalone: true
})
export class ColColorDirective implements OnChanges {
  // Pass the column name into the directive
  @Input('appColColor') columnName: string = '';

  // Binds the 'class' attribute of the host element
  @HostBinding('class') elementClasses = '';

  // Base classes that never change
  private readonly baseClasses = 'inline-block px-2 py-0.5 text-[14px] font-bold uppercase tracking-wider rounded';

  ngOnChanges(): void {
    this.updateColors();
  }

  private updateColors(): void {
    // Map column names to specific Tailwind color pairs
    const colorMap: Record<string, string> = {
      'WISHLIST': 'border text-violet-500',
      'APPLIED': 'border text-blue-500',
      'INTERVIEW': 'border text-orange-500',
      'OFFER': 'border text-green-500',
      'REJECTED': 'border text-red-600'
    };

    // Get matched color or a default if not found
    const colorClasses = colorMap[this.columnName.toUpperCase()] || 'border text-slate-500';
    
    // Combine base styles with dynamic colors
    this.elementClasses = `${this.baseClasses} ${colorClasses}`;
  }
}
