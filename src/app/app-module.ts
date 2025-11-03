import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navegation } from './navegation/navegation';
import { Medicine } from './medicine/medicine';
import { Tratamiento } from './tratamiento/tratamiento';
import { ModalMedicine } from './modal-medicine/modal-medicine';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [
    App,
    Navegation,
    Medicine,
    Tratamiento,
    ModalMedicine,
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
