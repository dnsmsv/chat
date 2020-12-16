import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AlertType } from '../models/alertType';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userName: string;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.user) {
      this.authService.user.subscribe((user) => {
        if (user) {
          this.chatService
            .getUser(user.uid)
            .subscribe((u) => (this.userName = u?.name));
        } else {
          this.userName = null;
        }
      });
    }
  }

  async logout() {
    await this.authService
      .logout()
      .then(() => this.router.navigate(['login']))
      .catch((error) => this.alertService.show(error.message, AlertType.Error));
  }
}
