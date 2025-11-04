import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './root.component';

@NgModule({
  // root component is standalone, import it so it can be bootstrapped
  imports: [
    BrowserModule,
    AppRoutingModule,
    RootComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection()
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
