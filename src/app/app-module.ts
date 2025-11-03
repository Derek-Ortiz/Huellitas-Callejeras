import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navegation } from './navegation/navegation';


@NgModule({
  declarations: [
    App,
    Navegation,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
  
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection()
  ],
  bootstrap: [App]
})
export class AppModule { }
