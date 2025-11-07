import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header';
import { StatusButtonsComponent } from './status-buttons/status-buttons';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [HeaderComponent, StatusButtonsComponent, ToastComponent],
  exports: [CommonModule, FormsModule, HeaderComponent, StatusButtonsComponent, ToastComponent]
})
export class SharedModule { }
