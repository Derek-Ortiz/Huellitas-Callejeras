import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-navegation',
    standalone: false,
    templateUrl: './navegation.component.html',
    styleUrls: ['./navegation.component.css']
})
export class NavegationComponent {
    @Output() clickInicio = new EventEmitter<void>();
    @Output() clickCalendario = new EventEmitter<void>();

    onClickInicio(): void {
        this.clickInicio.emit();
    }

    onClickCalendario(): void {
        this.clickCalendario.emit();
    }
}