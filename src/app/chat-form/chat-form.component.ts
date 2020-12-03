import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertType } from '../models/alertType';
import { ChatMessage } from '../models/chat-message.model';
import { AlertService } from '../services/alert.service';
import { ChatService } from '../services/chat.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css'],
})
export class ChatFormComponent implements OnInit {
  @ViewChild('chatInput') private chatInput: ElementRef;
  message: string = '';
  replyedMessageKey: string;

  constructor(
    private alertService: AlertService,
    private chatService: ChatService,
    private messagesService: MessagesService
  ) {
    this.messagesService.repliedMessage.subscribe((message) => {
      if (message !== null) {
        this.replyedMessageKey = message.$key;

        setTimeout(() => {
          this.chatInput.nativeElement.focus();
        }, 300);
      }
    });
  }

  ngOnInit(): void {}

  send() {
    try {
      this.chatService.postMessage(this.message, this.replyedMessageKey);
    } catch (error) {
      this.alertService.show(error.message, AlertType.Error);
    }

    this.message = '';
    this.replyedMessageKey = null;
    this.messagesService.replyMessage(null);
  }

  handleSubmit(event) {
    if (event.keyCode === 13 && this.message?.trim()) {
      this.send();
    }
  }
}
