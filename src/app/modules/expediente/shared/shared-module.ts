import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header';
import { StatusButtonsComponent } from './status-buttons/status-buttons';
@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [HeaderComponent, StatusButtonsComponent],
  exports: [CommonModule, FormsModule, HeaderComponent, StatusButtonsComponent]
})
export class SharedModule { }
