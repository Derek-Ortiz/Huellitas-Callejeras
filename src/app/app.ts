// Deprecated/duplicate root component kept for reference during migration.
// Selector changed to avoid conflicts with RootComponent. This file can be
// safely removed once migration is complete.
import { Component } from '@angular/core';

@Component({
  selector: 'app-root-deprecated',
  template: '<!-- deprecated root component -->'
})
export class App {
  protected readonly title = signal('Huellitas-Callejeras');
}