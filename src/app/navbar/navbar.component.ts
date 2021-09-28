import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AlertType } from '../models/alert-type';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userName: string;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.user) {
      this.subscription = this.authService.user.subscribe((user) => {
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

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  async logout() {
    await this.authService
      .logout()
      .then(() => this.router.navigate(['login']))
      .catch((error) => this.alertService.show(error.message, AlertType.Error));
  }
}
