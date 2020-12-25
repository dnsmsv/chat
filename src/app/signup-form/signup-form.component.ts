import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from '../models/alert-type';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
})
export class SignupFormComponent {
  email: string;
  password: string;
  displayName: string;
  errorMsg: string;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  async signUp() {
    const email = this.email;
    const password = this.password;
    const displayName = this.displayName;
    await this.authService
      .signUp(email, password, displayName)
      .then(() => this.router.navigate(['chat']))
      .catch((error) => this.alertService.show(error.message, AlertType.Error));
  }
}
