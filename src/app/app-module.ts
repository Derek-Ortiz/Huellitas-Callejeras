import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navegation } from './navegation/navegation';
import { Medicine } from './medicine/medicine';
import { Tratamiento } from './tratamiento/tratamiento';
import { ModalMedicine } from './modal-medicine/modal-medicine';

@NgModule({
  declarations: [
    App,
    Navegation,
    Medicine,
    Tratamiento,
    ModalMedicine
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection()
  ],
  bootstrap: [App]
})
export class AppModule { }
