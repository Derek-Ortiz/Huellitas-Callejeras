import { Component, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnDestroy {
  message = '';
  visible = false;
  sub?: Subscription;

  constructor(private toast: ToastService) {
    this.sub = this.toast.messages.subscribe(m => {
      this.message = m;
      this.visible = true;

      timer(3000).subscribe(() => this.visible = false);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

