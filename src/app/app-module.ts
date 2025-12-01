import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
<<<<<<< HEAD
=======
import { HttpClientModule } from '@angular/common/http';

>>>>>>> ba61a2fe521496fd54fe95832e51bdff75ac90d8
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navegation } from './navegation/navegation';
import { Citas } from './modules/citas/citas/citas';
import { CitasEdit } from './modules/citas/citas-edit/citas-edit';
import { Calendario } from './modules/citas/calendario/calendario';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

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
    HttpClientModule,
    AppRoutingModule,
<<<<<<< HEAD
    FormsModule,
    FullCalendarModule,
    HttpClientModule
=======
>>>>>>> ba61a2fe521496fd54fe95832e51bdff75ac90d8
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    
  ],
  bootstrap: [App]
})
export class AppModule { }
