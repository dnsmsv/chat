import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AlertType } from '../models/alertType';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userEmail: string;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.userEmail = user?.email;
    });
  }

  logout(): void {
    this.authService
      .logout()
      .then(() => this.router.navigate(['login']))
      .catch((error) => this.alertService.show(error.message, AlertType.Error));
  }
}
