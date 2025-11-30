import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navegation } from './navegation/navegation';
import { Citas } from './modules/citas/citas/citas';
import { CitasEdit } from './modules/citas/citas-edit/citas-edit';
import { Calendario } from './modules/citas/calendario/calendario';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, withInterceptors } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';



@NgModule({
  declarations: [
    App,
    Navegation,
    Citas,
    CitasEdit,
    Calendario
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FullCalendarModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    
  ],
  bootstrap: [App]
})
export class AppModule { }
