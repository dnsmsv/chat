import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from '../models/alert-type';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  email: string;
  password: string;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    const email = this.email;
    const password = this.password;
    await this.authService
      .login(email, password)
      .then(() => {
        this.router.navigate(['chat']);
      })
      .catch((error) => this.alertService.show(error.message, AlertType.Error));
  }
}
