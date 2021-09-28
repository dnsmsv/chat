import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { ChatService } from '../services/chat.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.css'],
})
export class ManageFormComponent implements OnInit, OnDestroy {
  private selectedMessage: ChatMessage;
  private subscription: Subscription;

  deleteVisible: boolean;

  constructor(
    private messagesService: MessagesService,
    private chatService: ChatService
  ) {
    if (messagesService.selectedMessage) {
      this.subscription = messagesService.selectedMessage.subscribe(
        (message) => {
          this.selectedMessage = message;
          this.deleteVisible = message ? message.isOwn : false;
        }
      );
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  deleteHandler(): void {
    if (this.selectedMessage) {
      this.chatService.removeMessage(this.selectedMessage);
      this.messagesService.selectMessage(null);
    }
  }

  replyHandler(): void {
    if (this.selectedMessage) {
      this.messagesService.replyMessage(this.selectedMessage);
      this.messagesService.selectMessage(null);
    }
  }

  cancelHandler(): void {
    this.messagesService.selectMessage(null);
  }
}
