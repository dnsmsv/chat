import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { AlertType } from '../models/alertType';
import { Alert } from '../models/alert.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  alert: Alert;
  alertType = AlertType;

  constructor(private alertService: AlertService) {
    alertService.alert.subscribe(
      (alert) => {
        const newAlert: Alert = new Alert();
        newAlert.clone(alert);
        this.alert = newAlert;
      },
      (error) => console.error(error)
    );
  }

  hide() {
    this.alertService.hide();
  }
}
