import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['./reply-form.component.css'],
})
export class ReplyFormComponent implements OnDestroy {
  private messageSubscription: Subscription;

  userName: string;
  timeStamp: Date;
  messageContent: string;
  isOwn: boolean;

  constructor(private messagesService: MessagesService) {
    this.messageSubscription = messagesService.repliedMessage.subscribe(
      (message) => {
        if (message) {
          this.userName = message.userName;
          this.timeStamp = message.timeSent;
          this.messageContent = message.message;
          this.isOwn = message.isOwn;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  closeButtonHandler(): void {
    this.messagesService.replyMessage(null);
  }
}
