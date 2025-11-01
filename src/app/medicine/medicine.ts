import { Component } from '@angular/core';

@Component({
  selector: 'app-medicine',
  standalone: false,
  templateUrl: './medicine.html',
  styleUrl: './medicine.css',
})
export class Medicine {
  num: number = 0;
  nums: number[] = [1, 2, 3, 4, 5];
}
