import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { AlertType } from '../models/alert-type';
import { Alert } from '../models/alert.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnDestroy {
  alert: Alert;
  alertType = AlertType;

  private subscription: Subscription;

  constructor(private alertService: AlertService) {
    if (alertService.alert) {
      this.subscription = alertService.alert.subscribe((alert) => {
        const newAlert: Alert = new Alert();
        newAlert.clone(alert);
        this.alert = newAlert;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  hide() {
    this.alertService.hide();
  }
}
