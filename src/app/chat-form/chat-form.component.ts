import { Component, OnInit } from '@angular/core';
import { AlertType } from '../models/alertType';
import { StatusType } from '../models/statusType';
import { AlertService } from '../services/alert.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css'],
})
export class ChatFormComponent implements OnInit {
  message: string;

  constructor(
    private alertService: AlertService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {}

  send() {
    try {
      this.chatService.postMessage(this.message);
    } catch (error) {
      this.alertService.show(error.message, AlertType.Error);
    }

    this.message = '';
  }

  handleSubmit(event) {
    if (event.keyCode === 13 && this.message?.trim()) {
      this.send();
    }
  }
}
