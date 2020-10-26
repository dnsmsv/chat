import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../models/alert.model';
import { AlertType } from '../models/alertType';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private hideTimeout: NodeJS.Timeout;

  constructor() {}

  alert: BehaviorSubject<Alert> = new BehaviorSubject<Alert>(new Alert());

  show(text: string, type: AlertType): void {
    this.alert.next(new Alert(text, type, true));
    this.hideTimeout = setTimeout(() => {
      if (this.alert.value.visible) this.hide();
    }, 10000);
  }

  hide() {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);

    const newAlert: Alert = new Alert(
      this.alert.value.text,
      this.alert.value.type,
      false
    );
    this.alert.next(newAlert);
  }
}
