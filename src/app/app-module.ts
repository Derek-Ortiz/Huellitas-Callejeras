import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { HeaderComponent } from './header/header.component';
import { GaleriaModule } from './galeria/galeria-module';

@NgModule({
  declarations: [
    App,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    GaleriaModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }