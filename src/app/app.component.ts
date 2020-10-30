import { Component, OnInit } from '@angular/core';
import { StatusType } from './models/statusType';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'chat';
  private statusTimeout: NodeJS.Timeout;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    window.addEventListener('focus', () => {
      this.chatService.updateUser(StatusType.Online);
      if (this.statusTimeout) clearTimeout(this.statusTimeout);
    });
    window.addEventListener('blur', () => {
      this.statusTimeout = setTimeout(() => {
        this.chatService.updateUser(StatusType.Offline);
      }, 180000);
    });
    window.addEventListener('beforeunload', () => {
      this.chatService.updateUser(StatusType.Offline);
    });
  }
}
