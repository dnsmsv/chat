import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
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
  private timeoutElapsed: boolean = false;

  constructor(
    private messagesService: MessagesService,
    private chatService: ChatService
  ) {
    messagesService.selectedMessage.subscribe((message) => {
      this.selected = message === this.chatMessage;
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

  mouseDownHandler(): void {
    if (window.screen.availWidth > 950) {
      this.messagesService.selectMessage(
        this.selected ? null : this.chatMessage
      );
    }
  }

  touchStartHandler(): void {
    if (window.screen.availWidth <= 950) {
      this.selected = true;
      this.timeoutElapsed = false;
      this.pressTimeout = setTimeout(() => {
        console.log('timer');
        this.timeoutElapsed = true;
        this.messagesService.selectMessage(this.chatMessage);
      }, 300);
    }
  }

  touchEndHandler(): void {
    if (window.screen.availWidth <= 950 && !this.timeoutElapsed) {
      this.selected = false;
      this.messagesService.selectMessage(null);
      clearTimeout(this.pressTimeout);
    }
  }
}
