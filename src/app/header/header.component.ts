import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-header',
    standalone: false,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    @Output() clickInicio = new EventEmitter<void>();
    @Output() clickCalendario = new EventEmitter<void>();
    @Output() clickAgregar = new EventEmitter<void>();

    onClickInicio(): void {
        this.clickInicio.emit();
    }

    onClickCalendario(): void {
        this.clickCalendario.emit();
    }

    onClickAgregar(): void {
        this.clickAgregar.emit();
    }
}