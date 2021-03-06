import { Component, HostListener, OnDestroy } from '@angular/core';
import { StatusType } from './models/status-type';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'chat';
  private statusTimeout: NodeJS.Timeout;

  constructor(private chatService: ChatService) {}

  ngOnDestroy(): void {
    if (this.statusTimeout) clearTimeout(this.statusTimeout);
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
}
