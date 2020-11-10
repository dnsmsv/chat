import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { ChatMessage } from '../models/chat-message.model';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  @Input() chatMessage: ChatMessage;
  userEmail: string;
  userName: string;
  messageContent: string;
  timeStamp: Date;
  isOwnMessage: boolean;
  selected: boolean;
  repliedMessage: ChatMessage;
  private pressTimeout: NodeJS.Timeout;

  constructor(
    private messagesService: MessagesService,
    private chatService: ChatService
  ) {
    messagesService.selectedMessage.subscribe((message) => {
      if (message != this.chatMessage) this.selected = false;
    });
  }

  ngOnInit(chatMessage = this.chatMessage): void {
    this.messageContent = chatMessage.message;
    this.timeStamp = chatMessage.timeSent;
    this.userEmail = chatMessage.email;
    this.userName = chatMessage.userName;
    this.isOwnMessage = chatMessage.isOwn;

    if (chatMessage.replyedMessageKey) {
      const message: ChatMessage = this.chatService.getMessage(
        chatMessage.replyedMessageKey
      );

      if (message) {
        this.repliedMessage = message;
        this.repliedMessage.message =
          this.repliedMessage.message && this.repliedMessage.message.length > 38
            ? this.repliedMessage.message.substr(0, 38) + '...'
            : this.repliedMessage.message;
      }
    }
  }

  selectUnselectMessage() {
    this.selected = !this.selected;
    this.messagesService.selectMessage(this.selected ? this.chatMessage : null);

    if (window.screen.availWidth <= 950) {
      this.pressTimeout = setTimeout(() => {
        this.selected = false;
      }, 300);
    }
  }

  mouseDownHandler() {
    // console.log('Start');
    // this.pressTimeout = setTimeout(() => {
    //   this.selected = true;
    //   console.log('End');
    // }, 1000);
  }

  mouseUpHandler() {
    // clearTimeout(this.pressTimeout);
  }
}
