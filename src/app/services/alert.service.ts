import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../models/alert.model';
import { AlertType } from '../models/alert-type';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private hideTimeout: NodeJS.Timeout;
  private _alert: BehaviorSubject<Alert> = new BehaviorSubject<Alert>(
    new Alert()
  );

  constructor() {}

  get alert() {
    return this._alert;
  }

  show(text: string, type: AlertType): void {
    this._alert.next(new Alert(text, type, true));
    this.hideTimeout = setTimeout(() => {
      if (this._alert.value.visible) this.hide();
    }, 10000);
  }

  hide() {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);

    const newAlert: Alert = new Alert(
      this._alert.value.text,
      this._alert.value.type,
      false
    );
    this._alert.next(newAlert);
  }
}
