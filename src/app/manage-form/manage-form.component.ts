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
      console.log(this.selectedMessage.$key);

      this.chatService.removeMessage(this.selectedMessage);
    }
  }

  replyHandler(): void {}

  cancelHandler(): void {
    this.messagesService.selectMessage(null);
  }
}
