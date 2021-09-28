import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StatusType } from './models/status-type';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'chat';
  private statusTimeout: NodeJS.Timeout;
  private userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.redirect(this.authService.user.value);
    this.userSubscription = this.authService.user.subscribe((user) => {
      this.redirect(user);
    });
  }

  ngOnDestroy(): void {
    if (this.statusTimeout) clearTimeout(this.statusTimeout);

    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  @HostListener('window:focus', ['$event'])
  handleWindowFocus(event: any) {
    this.chatService.updateUser(StatusType.Online);

    if (this.statusTimeout) clearTimeout(this.statusTimeout);
  }

  @HostListener('window:blur', ['$event'])
  handleWindowBlur(event: any) {
    this.statusTimeout = setTimeout(() => {
      this.chatService.updateUser(StatusType.Offline);
    }, 180000);
  }

  @HostListener('window:beforeunload', ['$event'])
  handleWindowBeforeunload(event: any) {
    this.chatService.updateUser(StatusType.Offline);
  }

  public redirect(user) {
    if (user === null) {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['chat']);
    }
  }
}
