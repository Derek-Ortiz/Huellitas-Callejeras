import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NavegationComponent} from './navegation/navegation.component';

@NgModule({
  declarations: [
    App,
    NavegationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection()
  ],
  bootstrap: [App]
})
export class AppModule { }
