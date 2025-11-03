import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages = new Subject<string>();

  get messages(): Observable<string> {
    return this._messages.asObservable();
  }

  show(msg: string) {
    this._messages.next(msg);
  }
}
