import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../models/chat-message.model';
import { ChatService } from '../services/chat.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.css'],
})
export class ManageFormComponent implements OnInit {
  private selectedMessage: ChatMessage;

  deleteVisible: boolean;

  constructor(
    private messagesService: MessagesService,
    private chatService: ChatService
  ) {
    messagesService.selectedMessage.subscribe((message) => {
      this.selectedMessage = message;
      this.deleteVisible = message ? message.isOwn : false;
    });
  }

  ngOnInit(): void {}

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
